import type { FullTest, Question, Section } from '@quizforge/shared'

export const sampleQuestions: Question[] = [
  {
    id: 'question-1',
    sectionId: 'section-1',
    type: 'MCQ_SINGLE',
    body: 'A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?',
    order: 1,
    marks: 2,
    negativeMarks: 0.5,
    difficulty: 'MEDIUM',
    tags: ['aptitude'],
    questionData: {
      type: 'MCQ_SINGLE',
      shuffleOptions: false,
      options: [
        { id: 'a', text: '120 metres', isCorrect: false },
        { id: 'b', text: '150 metres', isCorrect: true },
        { id: 'c', text: '180 metres', isCorrect: false },
        { id: 'd', text: '210 metres', isCorrect: false }
      ]
    }
  },
  {
    id: 'question-2',
    sectionId: 'section-1',
    type: 'FILL_BLANK',
    body: 'The square root of 144 is {{blank_1}}.',
    order: 2,
    marks: 1,
    negativeMarks: 0,
    difficulty: 'EASY',
    tags: ['math'],
    questionData: {
      type: 'FILL_BLANK',
      template: 'The square root of 144 is {{blank_1}}.',
      blanks: [
        {
          id: 'blank_1',
          acceptedAnswers: ['12'],
          caseSensitive: false,
          matchType: 'exact'
        }
      ]
    }
  }
]

export const sampleSections: Section[] = [
  {
    id: 'section-1',
    testId: 'test-1',
    title: 'Section 1: Quantitative Aptitude',
    instructions: 'Solve all questions.',
    order: 1,
    durationMins: 30,
    totalQuestionsInPool: 2,
    questionsToDisplay: 2,
    shuffleQuestions: false,
    questions: sampleQuestions
  },
  {
    id: 'section-2',
    testId: 'test-1',
    title: 'Section 2: General Knowledge',
    instructions: 'Choose the most accurate option.',
    order: 2,
    durationMins: 30,
    totalQuestionsInPool: 20,
    questionsToDisplay: 20,
    shuffleQuestions: true,
    questions: []
  }
]

export const sampleTest: FullTest = {
  id: 'test-1',
  creatorId: 'creator-1',
  title: 'Mid-Term Exam',
  description: 'A structured test for mid-term assessment.',
  instructions: 'Read each question carefully before answering.',
  status: 'DRAFT',
  totalMarks: 100,
  passingScore: 40,
  timingMode: 'GLOBAL',
  globalDurationMins: 90,
  allowSectionBacktrack: true,
  shuffleQuestions: false,
  requireFullscreen: false,
  sections: sampleSections
}

export const dashboardRows = [
  {
    name: 'JavaScript Fundamentals',
    module: 'Module 1',
    status: 'PUBLISHED',
    takers: '342',
    created: 'Oct 12, 2023',
    icon: 'JS'
  },
  {
    name: 'UI/UX Principles Exam',
    module: 'Midterm',
    status: 'DRAFT',
    takers: '-',
    created: 'Oct 14, 2023',
    icon: 'UX'
  },
  {
    name: 'Advanced Python Concepts',
    module: 'Module 4',
    status: 'PUBLISHED',
    takers: '128',
    created: 'Sep 28, 2023',
    icon: 'PY'
  },
  {
    name: 'SQL Basics Q3',
    module: 'Quiz',
    status: 'CLOSED',
    takers: '412',
    created: 'Aug 15, 2023',
    icon: 'SQL'
  }
]
