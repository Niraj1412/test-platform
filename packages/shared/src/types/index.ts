import type { QuestionData, QuestionType, DifficultyLevel } from '../schemas/question.schema.js'
import type { ResponseData } from '../schemas/attempt.schema.js'
import type { TestStatus, TimingMode } from '../schemas/test.schema.js'
import type { UserRole } from '../schemas/auth.schema.js'

export interface ApiError {
  code: string
  message: string
  fields?: Record<string, string[]>
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError }

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

export interface SafeUser {
  id: string
  email: string
  name: string
  role: UserRole
  isEmailVerified: boolean
  createdAt: string | Date
}

export interface Question {
  id: string
  sectionId: string
  type: QuestionType
  body: string
  mediaUrl?: string | null
  order: number
  marks: number
  negativeMarks: number
  difficulty: DifficultyLevel
  tags: string[]
  questionData: QuestionData
}

export interface SanitisedQuestion extends Omit<Question, 'questionData'> {
  questionData: unknown
}

export interface Section {
  id: string
  testId: string
  title: string
  instructions?: string | null
  order: number
  durationMins?: number | null
  totalQuestionsInPool: number
  questionsToDisplay: number
  shuffleQuestions: boolean
  questions: Question[]
}

export interface FullTest {
  id: string
  creatorId: string
  title: string
  description?: string | null
  instructions?: string | null
  status: TestStatus
  accessCode?: string | null
  accessLink?: string | null
  totalMarks: number
  passingScore: number
  timingMode: TimingMode
  globalDurationMins?: number | null
  allowSectionBacktrack: boolean
  shuffleQuestions: boolean
  requireFullscreen: boolean
  sections: Section[]
}

export interface AttemptAnswer {
  questionId: string
  responseData: ResponseData
  isFlagged: boolean
  earnedMarks?: number | null
  isCorrect?: boolean | null
}

export interface Attempt {
  id: string
  testId: string
  takerId?: string | null
  guestName?: string | null
  guestEmail?: string | null
  guestSessionId?: string | null
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADING' | 'GRADED' | 'EXPIRED'
  startedAt: string | Date
  submittedAt?: string | Date | null
  rawScore?: number | null
  totalMarks?: number | null
  percentage?: number | null
  passed?: boolean | null
  assignedQuestions: string[]
  answers?: AttemptAnswer[]
}
