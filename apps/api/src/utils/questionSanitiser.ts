import type { Question, QuestionData } from '@quizforge/shared'

type QuestionLike = Omit<Question, 'questionData' | 'marks' | 'negativeMarks'> & {
  marks: number
  negativeMarks: number
  questionData: QuestionData
}

const shuffle = <T>(items: T[]) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = copy[index]
    copy[index] = copy[swapIndex] as T
    copy[swapIndex] = current as T
  }
  return copy
}

export const sanitiseQuestionForTaker = (question: QuestionLike) => {
  const { questionData } = question

  switch (questionData.type) {
    case 'MCQ_SINGLE':
    case 'MCQ_MULTIPLE': {
      const options = questionData.options.map(({ isCorrect: _isCorrect, ...option }) => option)
      return {
        ...question,
        questionData: {
          ...questionData,
          options: questionData.shuffleOptions ? shuffle(options) : options
        }
      }
    }
    case 'TRUE_FALSE':
      return { ...question, questionData: { type: 'TRUE_FALSE' as const } }
    case 'FILL_BLANK':
      return {
        ...question,
        questionData: {
          type: 'FILL_BLANK' as const,
          template: questionData.template,
          blanks: questionData.blanks.map(({ acceptedAnswers: _acceptedAnswers, ...blank }) => blank)
        }
      }
    case 'MATCHING': {
      const matches = questionData.pairs.map((pair) => ({ id: pair.id, text: pair.match }))
      return {
        ...question,
        questionData: {
          type: 'MATCHING' as const,
          pairs: questionData.pairs.map((pair) => ({ id: pair.id, prompt: pair.prompt })),
          matches: questionData.shuffleMatches ? shuffle(matches) : matches
        }
      }
    }
    case 'ORDERING':
      return {
        ...question,
        questionData: {
          type: 'ORDERING' as const,
          items: shuffle(questionData.items.map((item) => ({ id: item.id, text: item.text })))
        }
      }
    case 'NUMERICAL':
      return {
        ...question,
        questionData: {
          type: 'NUMERICAL' as const,
          unit: questionData.unit
        }
      }
    case 'SHORT_ANSWER':
    case 'LONG_ANSWER':
    case 'FILE_UPLOAD':
      return { ...question, questionData }
  }
}
