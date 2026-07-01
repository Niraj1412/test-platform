import {
  type FillBlankData,
  type FillBlankResponse,
  type MatchingData,
  type MatchingResponse,
  type MCQMultipleData,
  type MCQMultipleResponse,
  type MCQSingleData,
  type MCQSingleResponse,
  type NumericalData,
  type NumericalResponse,
  type OrderingData,
  type OrderingResponse,
  type QuestionData,
  QuestionDataSchema,
  type ResponseData,
  ResponseDataSchema,
  type TrueFalseData,
  type TrueFalseResponse
} from '@quizforge/shared'
import { AttemptStatus } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { AppError } from '../utils/appError.js'

export interface GradeResult {
  earnedMarks: number | null
  isCorrect: boolean | null
  isAutoGraded: boolean
}

const subjectiveTypes = new Set<QuestionData['type']>(['SHORT_ANSWER', 'LONG_ANSWER', 'FILE_UPLOAD'])

const jsonArrayToStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((item): item is string => typeof item === 'string')
}

export class GradingService {
  async gradeAttempt(attemptId: string): Promise<void> {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          include: {
            sections: {
              include: {
                questions: true
              }
            }
          }
        },
        answers: {
          include: {
            question: true
          }
        }
      }
    })

    if (!attempt) {
      throw new AppError(404, 'ATTEMPT_NOT_FOUND', 'Attempt not found')
    }

    const assignedIds = jsonArrayToStringArray(attempt.assignedQuestions)
    const allQuestions = attempt.test.sections.flatMap((section) => section.questions)
    const questions = assignedIds.length
      ? allQuestions.filter((question) => assignedIds.includes(question.id))
      : allQuestions
    const answerByQuestionId = new Map(attempt.answers.map((answer) => [answer.questionId, answer]))

    let rawScore = 0
    let hasManualAnswers = false
    const answerUpdates = []

    for (const question of questions) {
      const questionData = QuestionDataSchema.parse(question.questionData)
      const answer = answerByQuestionId.get(question.id)
      const response = answer ? ResponseDataSchema.safeParse(answer.responseData) : null

      if (subjectiveTypes.has(questionData.type)) {
        if (answer) {
          hasManualAnswers = true
          answerUpdates.push(
            prisma.answer.update({
              where: { id: answer.id },
              data: {
                isAutoGraded: false,
                earnedMarks: null,
                isCorrect: null
              }
            })
          )
        }
        continue
      }

      const grade = this.gradeQuestionResponse(
        response?.success ? response.data : null,
        questionData,
        question.marks,
        question.negativeMarks
      )

      rawScore += grade.earnedMarks ?? 0
      if (answer) {
        answerUpdates.push(
          prisma.answer.update({
            where: { id: answer.id },
            data: {
              isAutoGraded: grade.isAutoGraded,
              earnedMarks: grade.earnedMarks,
              isCorrect: grade.isCorrect
            }
          })
        )
      }
    }

    const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0)
    const percentage = totalMarks > 0 ? (rawScore / totalMarks) * 100 : 0
    const passed = percentage >= attempt.test.passingScore

    await prisma.$transaction([
      ...answerUpdates,
      prisma.attempt.update({
        where: { id: attempt.id },
        data: {
          status: hasManualAnswers ? AttemptStatus.GRADING : AttemptStatus.GRADED,
          rawScore,
          totalMarks,
          percentage,
          passed
        }
      })
    ])
  }

  gradeQuestionResponse(
    responseData: ResponseData | null,
    questionData: QuestionData,
    marks: number,
    negMarks: number
  ): GradeResult {
    switch (questionData.type) {
      case 'MCQ_SINGLE':
        return this.gradeMCQSingle(
          responseData?.type === 'MCQ_SINGLE' ? responseData : null,
          questionData,
          marks,
          negMarks
        )
      case 'MCQ_MULTIPLE':
        return this.gradeMCQMultiple(
          responseData?.type === 'MCQ_MULTIPLE' ? responseData : null,
          questionData,
          marks,
          negMarks
        )
      case 'TRUE_FALSE':
        return this.gradeTrueFalse(
          responseData?.type === 'TRUE_FALSE' ? responseData : null,
          questionData,
          marks,
          negMarks
        )
      case 'FILL_BLANK':
        return this.gradeFillBlank(
          responseData?.type === 'FILL_BLANK' ? responseData : null,
          questionData,
          marks,
          negMarks
        )
      case 'MATCHING':
        return this.gradeMatching(
          responseData?.type === 'MATCHING' ? responseData : null,
          questionData,
          marks,
          negMarks
        )
      case 'ORDERING':
        return this.gradeOrdering(
          responseData?.type === 'ORDERING' ? responseData : null,
          questionData,
          marks,
          negMarks
        )
      case 'NUMERICAL':
        return this.gradeNumerical(
          responseData?.type === 'NUMERICAL' ? responseData : null,
          questionData,
          marks,
          negMarks
        )
      case 'SHORT_ANSWER':
      case 'LONG_ANSWER':
      case 'FILE_UPLOAD':
        return { earnedMarks: null, isCorrect: null, isAutoGraded: false }
    }
  }

  private binaryGrade(correct: boolean, answered: boolean, marks: number, negMarks: number): GradeResult {
    if (!answered) {
      return { earnedMarks: 0, isCorrect: false, isAutoGraded: true }
    }
    return {
      earnedMarks: correct ? marks : -negMarks,
      isCorrect: correct,
      isAutoGraded: true
    }
  }

  private gradeMCQSingle(
    responseData: MCQSingleResponse | null,
    questionData: MCQSingleData,
    marks: number,
    negMarks: number
  ): GradeResult {
    const selected = responseData?.selectedOptionId
    const correctOption = questionData.options.find((option) => option.isCorrect)
    return this.binaryGrade(Boolean(selected && selected === correctOption?.id), Boolean(selected), marks, negMarks)
  }

  private gradeMCQMultiple(
    responseData: MCQMultipleResponse | null,
    questionData: MCQMultipleData,
    marks: number,
    negMarks: number
  ): GradeResult {
    const correct = new Set(questionData.options.filter((option) => option.isCorrect).map((option) => option.id))
    const selected = new Set(responseData?.selectedOptionIds ?? [])
    if (selected.size === 0) {
      return { earnedMarks: 0, isCorrect: false, isAutoGraded: true }
    }

    const setsEqual =
      correct.size === selected.size && [...correct].every((optionId) => selected.has(optionId))
    if (!questionData.partialCredit || questionData.partialCreditMode === 'all_or_nothing') {
      return {
        earnedMarks: setsEqual ? marks : -negMarks,
        isCorrect: setsEqual,
        isAutoGraded: true
      }
    }

    const correctSelected = [...selected].filter((optionId) => correct.has(optionId)).length
    const incorrectSelected = selected.size - correctSelected
    const earned = (correctSelected / Math.max(correct.size, 1)) * marks - incorrectSelected * negMarks
    return {
      earnedMarks: Math.max(0, earned),
      isCorrect: setsEqual,
      isAutoGraded: true
    }
  }

  private gradeTrueFalse(
    responseData: TrueFalseResponse | null,
    questionData: TrueFalseData,
    marks: number,
    negMarks: number
  ): GradeResult {
    const answered = typeof responseData?.answer === 'boolean'
    return this.binaryGrade(answered && responseData?.answer === questionData.correctAnswer, answered, marks, negMarks)
  }

  private gradeFillBlank(
    responseData: FillBlankResponse | null,
    questionData: FillBlankData,
    marks: number,
    _negMarks: number
  ): GradeResult {
    const total = questionData.blanks.length
    const correct = questionData.blanks.filter((blank) => {
      const rawAnswer = responseData?.blankAnswers[blank.id] ?? ''
      const answer = blank.caseSensitive ? rawAnswer.trim() : rawAnswer.trim().toLowerCase()
      return blank.acceptedAnswers.some((accepted) => {
        const acceptedAnswer = blank.caseSensitive ? accepted.trim() : accepted.trim().toLowerCase()
        return blank.matchType === 'contains'
          ? answer.includes(acceptedAnswer)
          : answer === acceptedAnswer
      })
    }).length

    return {
      earnedMarks: total > 0 ? (correct / total) * marks : 0,
      isCorrect: correct === total,
      isAutoGraded: true
    }
  }

  private gradeMatching(
    responseData: MatchingResponse | null,
    questionData: MatchingData,
    marks: number,
    _negMarks: number
  ): GradeResult {
    const total = questionData.pairs.length
    const correct = questionData.pairs.filter((pair) => responseData?.pairs[pair.id] === pair.match).length
    return {
      earnedMarks: total > 0 ? (correct / total) * marks : 0,
      isCorrect: correct === total,
      isAutoGraded: true
    }
  }

  private gradeOrdering(
    responseData: OrderingResponse | null,
    questionData: OrderingData,
    marks: number,
    negMarks: number
  ): GradeResult {
    const expected = [...questionData.items]
      .sort((left, right) => left.correctPosition - right.correctPosition)
      .map((item) => item.id)
    const actual = responseData?.orderedIds ?? []
    if (actual.length === 0) {
      return { earnedMarks: 0, isCorrect: false, isAutoGraded: true }
    }
    const correct = expected.length === actual.length && expected.every((id, index) => actual[index] === id)
    return {
      earnedMarks: correct ? marks : -negMarks,
      isCorrect: correct,
      isAutoGraded: true
    }
  }

  private gradeNumerical(
    responseData: NumericalResponse | null,
    questionData: NumericalData,
    marks: number,
    negMarks: number
  ): GradeResult {
    const answered = typeof responseData?.value === 'number'
    const correct = answered && Math.abs((responseData?.value ?? 0) - questionData.correctAnswer) <= questionData.tolerance
    return this.binaryGrade(correct, answered, marks, negMarks)
  }
}

export const gradingService = new GradingService()
