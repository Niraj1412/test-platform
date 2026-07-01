import { create } from 'zustand'
import type { FullTest, Question, Section } from '@quizforge/shared'

interface TestBuilderState {
  test: FullTest | null
  activeSection: string | null
  isDrawerOpen: boolean
  editingQuestion: Question | null
  setTest: (test: FullTest) => void
  addSection: (section: Section) => void
  updateSection: (id: string, data: Partial<Section>) => void
  reorderSections: (orderedIds: string[]) => void
  openQuestionEditor: (question: Question | null, sectionId: string) => void
  closeQuestionEditor: () => void
  addQuestion: (sectionId: string, question: Question) => void
  updateQuestion: (id: string, data: Partial<Question>) => void
  deleteQuestion: (id: string, sectionId: string) => void
  reorderQuestions: (sectionId: string, orderedIds: string[]) => void
}

export const useTestBuilderStore = create<TestBuilderState>((set) => ({
  test: null,
  activeSection: null,
  isDrawerOpen: false,
  editingQuestion: null,
  setTest: (test) => set({ test, activeSection: test.sections[0]?.id ?? null }),
  addSection: (section) =>
    set((state) => ({
      test: state.test ? { ...state.test, sections: [...state.test.sections, section] } : state.test
    })),
  updateSection: (id, data) =>
    set((state) => ({
      test: state.test
        ? {
            ...state.test,
            sections: state.test.sections.map((section) =>
              section.id === id ? { ...section, ...data } : section
            )
          }
        : state.test
    })),
  reorderSections: (orderedIds) =>
    set((state) => {
      if (!state.test) {
        return state
      }
      const byId = new Map(state.test.sections.map((section) => [section.id, section]))
      return {
        test: {
          ...state.test,
          sections: orderedIds
            .map((id, index) => {
              const section = byId.get(id)
              return section ? { ...section, order: index + 1 } : null
            })
            .filter((section): section is Section => Boolean(section))
        }
      }
    }),
  openQuestionEditor: (question, sectionId) =>
    set({ editingQuestion: question, activeSection: sectionId, isDrawerOpen: true }),
  closeQuestionEditor: () => set({ editingQuestion: null, isDrawerOpen: false }),
  addQuestion: (sectionId, question) =>
    set((state) => ({
      test: state.test
        ? {
            ...state.test,
            sections: state.test.sections.map((section) =>
              section.id === sectionId
                ? { ...section, questions: [...section.questions, question] }
                : section
            )
          }
        : state.test
    })),
  updateQuestion: (id, data) =>
    set((state) => ({
      test: state.test
        ? {
            ...state.test,
            sections: state.test.sections.map((section) => ({
              ...section,
              questions: section.questions.map((question) =>
                question.id === id ? { ...question, ...data } : question
              )
            }))
          }
        : state.test
    })),
  deleteQuestion: (id, sectionId) =>
    set((state) => ({
      test: state.test
        ? {
            ...state.test,
            sections: state.test.sections.map((section) =>
              section.id === sectionId
                ? {
                    ...section,
                    questions: section.questions.filter((question) => question.id !== id)
                  }
                : section
            )
          }
        : state.test
    })),
  reorderQuestions: (sectionId, orderedIds) =>
    set((state) => {
      if (!state.test) {
        return state
      }
      return {
        test: {
          ...state.test,
          sections: state.test.sections.map((section) => {
            if (section.id !== sectionId) {
              return section
            }
            const byId = new Map(section.questions.map((question) => [question.id, question]))
            return {
              ...section,
              questions: orderedIds
                .map((id, index) => {
                  const question = byId.get(id)
                  return question ? { ...question, order: index + 1 } : null
                })
                .filter((question): question is Question => Boolean(question))
            }
          })
        }
      }
    })
}))
