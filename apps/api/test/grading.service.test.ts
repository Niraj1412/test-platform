import { GradingService } from '../src/services/grading.service.js'
import type {
  FillBlankData,
  MatchingData,
  MCQMultipleData,
  MCQSingleData,
  NumericalData,
  OrderingData
} from '@quizforge/shared'

const service = new GradingService()

describe('GradingService', () => {
  describe('MCQ_SINGLE', () => {
    const question: MCQSingleData = {
      type: 'MCQ_SINGLE',
      shuffleOptions: false,
      options: [
        { id: 'a', text: 'A', isCorrect: false },
        { id: 'b', text: 'B', isCorrect: true }
      ]
    }

    it('grades a correct answer', () => {
      expect(
        service.gradeQuestionResponse({ type: 'MCQ_SINGLE', selectedOptionId: 'b' }, question, 2, 0.5)
      ).toMatchObject({ earnedMarks: 2, isCorrect: true })
    })

    it('grades a wrong answer with negative marks', () => {
      expect(
        service.gradeQuestionResponse({ type: 'MCQ_SINGLE', selectedOptionId: 'a' }, question, 2, 0.5)
      ).toMatchObject({ earnedMarks: -0.5, isCorrect: false })
    })

    it('grades no answer as zero', () => {
      expect(service.gradeQuestionResponse(null, question, 2, 0.5)).toMatchObject({
        earnedMarks: 0,
        isCorrect: false
      })
    })
  })

  describe('MCQ_MULTIPLE', () => {
    const question: MCQMultipleData = {
      type: 'MCQ_MULTIPLE',
      shuffleOptions: false,
      partialCredit: false,
      partialCreditMode: 'all_or_nothing',
      options: [
        { id: 'a', text: 'A', isCorrect: true },
        { id: 'b', text: 'B', isCorrect: true },
        { id: 'c', text: 'C', isCorrect: false }
      ]
    }

    it('grades all correct', () => {
      expect(
        service.gradeQuestionResponse({ type: 'MCQ_MULTIPLE', selectedOptionIds: ['a', 'b'] }, question, 4, 1)
      ).toMatchObject({ earnedMarks: 4, isCorrect: true })
    })

    it('grades partial correct as wrong without partial credit', () => {
      expect(
        service.gradeQuestionResponse({ type: 'MCQ_MULTIPLE', selectedOptionIds: ['a'] }, question, 4, 1)
      ).toMatchObject({ earnedMarks: -1, isCorrect: false })
    })

    it('grades all wrong', () => {
      expect(
        service.gradeQuestionResponse({ type: 'MCQ_MULTIPLE', selectedOptionIds: ['c'] }, question, 4, 1)
      ).toMatchObject({ earnedMarks: -1, isCorrect: false })
    })

    it('grades proportional credit and clamps below zero', () => {
      const partialQuestion = { ...question, partialCredit: true, partialCreditMode: 'proportional' as const }
      expect(
        service.gradeQuestionResponse(
          { type: 'MCQ_MULTIPLE', selectedOptionIds: ['a', 'c'] },
          partialQuestion,
          4,
          1
        )
      ).toMatchObject({ earnedMarks: 1, isCorrect: false })
    })
  })

  describe('FILL_BLANK', () => {
    const question: FillBlankData = {
      type: 'FILL_BLANK',
      template: 'The capital of {{blank_1}} is {{blank_2}}',
      blanks: [
        {
          id: 'blank_1',
          acceptedAnswers: ['France'],
          caseSensitive: false,
          matchType: 'exact'
        },
        {
          id: 'blank_2',
          acceptedAnswers: ['Paris'],
          caseSensitive: false,
          matchType: 'contains'
        }
      ]
    }

    it('grades exact and contains matches across multiple blanks', () => {
      expect(
        service.gradeQuestionResponse(
          { type: 'FILL_BLANK', blankAnswers: { blank_1: 'france', blank_2: 'City of Paris' } },
          question,
          4,
          0
        )
      ).toMatchObject({ earnedMarks: 4, isCorrect: true })
    })

    it('grades partial blanks proportionally', () => {
      expect(
        service.gradeQuestionResponse(
          { type: 'FILL_BLANK', blankAnswers: { blank_1: 'France', blank_2: 'Lyon' } },
          question,
          4,
          0
        )
      ).toMatchObject({ earnedMarks: 2, isCorrect: false })
    })
  })

  describe('NUMERICAL', () => {
    const question: NumericalData = {
      type: 'NUMERICAL',
      correctAnswer: 10,
      tolerance: 0.5
    }

    it('grades exactly equal', () => {
      expect(service.gradeQuestionResponse({ type: 'NUMERICAL', value: 10 }, question, 3, 0)).toMatchObject({
        earnedMarks: 3,
        isCorrect: true
      })
    })

    it('grades within tolerance', () => {
      expect(service.gradeQuestionResponse({ type: 'NUMERICAL', value: 10.4 }, question, 3, 0)).toMatchObject({
        earnedMarks: 3,
        isCorrect: true
      })
    })

    it('grades outside tolerance', () => {
      expect(service.gradeQuestionResponse({ type: 'NUMERICAL', value: 11 }, question, 3, 0.25)).toMatchObject({
        earnedMarks: -0.25,
        isCorrect: false
      })
    })
  })

  describe('MATCHING', () => {
    const question: MatchingData = {
      type: 'MATCHING',
      shuffleMatches: true,
      pairs: [
        { id: 'one', prompt: '1', match: 'A' },
        { id: 'two', prompt: '2', match: 'B' }
      ]
    }

    it('grades all correct', () => {
      expect(
        service.gradeQuestionResponse({ type: 'MATCHING', pairs: { one: 'A', two: 'B' } }, question, 4, 0)
      ).toMatchObject({ earnedMarks: 4, isCorrect: true })
    })

    it('grades partial correct', () => {
      expect(
        service.gradeQuestionResponse({ type: 'MATCHING', pairs: { one: 'A', two: 'C' } }, question, 4, 0)
      ).toMatchObject({ earnedMarks: 2, isCorrect: false })
    })
  })

  describe('ORDERING', () => {
    const question: OrderingData = {
      type: 'ORDERING',
      items: [
        { id: 'first', text: 'First', correctPosition: 0 },
        { id: 'second', text: 'Second', correctPosition: 1 }
      ]
    }

    it('grades all correct order', () => {
      expect(
        service.gradeQuestionResponse({ type: 'ORDERING', orderedIds: ['first', 'second'] }, question, 2, 1)
      ).toMatchObject({ earnedMarks: 2, isCorrect: true })
    })

    it('grades wrong order', () => {
      expect(
        service.gradeQuestionResponse({ type: 'ORDERING', orderedIds: ['second', 'first'] }, question, 2, 1)
      ).toMatchObject({ earnedMarks: -1, isCorrect: false })
    })
  })
})
