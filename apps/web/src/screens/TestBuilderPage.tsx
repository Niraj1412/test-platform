'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '../components/ui/Button'
import { MaterialIcon } from '../components/ui/MaterialIcon'
import { Modal } from '../components/ui/Modal'
import { Toast } from '../components/ui/Toast'
import { testsApi } from '../api/tests.api'
import { sectionsApi } from '../api/sections.api'
import { questionsApi } from '../api/questions.api'
import { questionBankApi } from '../api/questionBank.api'
import type { FullTest, Question, Section } from '@quizforge/shared'
import { sampleTest } from './mockData'

type BankItem = {
  id: string
  type: Question['type']
  body: string
  marks: number
  negativeMarks: number
  tags: string[]
  difficulty: Question['difficulty']
  questionData: Question['questionData']
}

const fallbackBankItems: BankItem[] = [
  {
    id: 'bank-derivative',
    type: 'MCQ_SINGLE',
    body: 'What is the derivative of x^2 with respect to x?',
    marks: 1,
    negativeMarks: 0,
    tags: ['calculus', 'math'],
    difficulty: 'EASY',
    questionData: {
      type: 'MCQ_SINGLE',
      shuffleOptions: true,
      options: [
        { id: 'a', text: '2x', isCorrect: true },
        { id: 'b', text: 'x', isCorrect: false },
        { id: 'c', text: 'x^2', isCorrect: false },
        { id: 'd', text: '2', isCorrect: false }
      ]
    }
  },
  {
    id: 'bank-capital',
    type: 'FILL_BLANK',
    body: 'The capital of France is {{blank_1}}.',
    marks: 1,
    negativeMarks: 0,
    tags: ['geography'],
    difficulty: 'EASY',
    questionData: {
      type: 'FILL_BLANK',
      template: 'The capital of France is {{blank_1}}.',
      blanks: [
        { id: 'blank_1', acceptedAnswers: ['Paris'], caseSensitive: false, matchType: 'exact' }
      ]
    }
  },
  {
    id: 'bank-singleton',
    type: 'MCQ_SINGLE',
    body: 'Which design pattern ensures a class only has one instance?',
    marks: 2,
    negativeMarks: 0,
    tags: ['software-design'],
    difficulty: 'MEDIUM',
    questionData: {
      type: 'MCQ_SINGLE',
      shuffleOptions: true,
      options: [
        { id: 'a', text: 'Factory', isCorrect: false },
        { id: 'b', text: 'Singleton', isCorrect: true },
        { id: 'c', text: 'Observer', isCorrect: false },
        { id: 'd', text: 'Adapter', isCorrect: false }
      ]
    }
  }
]

const makeOfflineTest = (testId: string): FullTest => ({
  ...sampleTest,
  id: testId,
  title: sampleTest.title,
  status: 'DRAFT',
  accessCode: null,
  accessLink: null,
  totalMarks: 0,
  sections: []
})

const filterFallbackBankItems = (query: string) => {
  const value = query.trim().toLowerCase()
  if (!value) return fallbackBankItems
  return fallbackBankItems.filter((item) =>
    item.body.toLowerCase().includes(value) ||
    item.type.toLowerCase().includes(value) ||
    item.tags.some((tag) => tag.toLowerCase().includes(value))
  )
}

const localId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const isNetworkError = (error: unknown) => {
  if (!error || typeof error !== 'object') return false
  const record = error as { message?: unknown; code?: unknown; response?: unknown }
  return record.response === undefined && (
    record.message === 'Network Error' ||
    record.code === 'ERR_NETWORK'
  )
}

export function TestBuilderPage() {
  const { id: testId } = useParams() as { id: string }


  const [test, setTest] = useState<FullTest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  // Question Bank
  const [bankItems, setBankItems] = useState<BankItem[]>([])
  const [bankQuery, setBankQuery] = useState('')

  // Publish Checklist modal
  const [isPublishOpen, setIsPublishOpen] = useState(false)
  const [publishedData, setPublishedData] = useState<{ accessCode: string; accessLink: string } | null>(null)

  // Question editing
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null)

  // Custom dialog/modal states for Section actions
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState('Quantitative Aptitude')
  const [renameSectionData, setRenameSectionData] = useState<{ id: string; title: string } | null>(null)
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null)
  const [isCreatingSection, setIsCreatingSection] = useState(false)

  const showToast = (message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3000)
  }

  const createLocalSection = (title: string) => {
    const section: Section = {
      id: localId('section'),
      testId,
      title,
      instructions: null,
      order: (test?.sections?.length ?? 0) + 1,
      durationMins: null,
      totalQuestionsInPool: 0,
      questionsToDisplay: 0,
      shuffleQuestions: false,
      questions: []
    }

    setTest((current) => current ? {
      ...current,
      sections: [...(current.sections ?? []), section]
    } : current)
    return section
  }

  const renameLocalSection = (sectionId: string, title: string) => {
    setTest((current) => current ? {
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    } : current)
  }

  const deleteLocalSection = (sectionId: string) => {
    setTest((current) => current ? {
      ...current,
      sections: current.sections
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index + 1 }))
    } : current)
  }

  const upsertLocalQuestion = (sectionId: string, question: Question) => {
    setTest((current) => current ? {
      ...current,
      sections: current.sections.map((section) => {
        if (section.id !== sectionId) return section
        const exists = section.questions.some((item) => item.id === question.id)
        const questions = exists
          ? section.questions.map((item) => item.id === question.id ? question : item)
          : [...section.questions, question]
        return {
          ...section,
          questions,
          totalQuestionsInPool: questions.length,
          questionsToDisplay: questions.length
        }
      })
    } : current)
  }

  const deleteLocalQuestion = (questionId: string) => {
    setTest((current) => current ? {
      ...current,
      sections: current.sections.map((section) => {
        const questions = section.questions
          .filter((question) => question.id !== questionId)
          .map((question, index) => ({ ...question, order: index + 1 }))
        return {
          ...section,
          questions,
          totalQuestionsInPool: questions.length,
          questionsToDisplay: questions.length
        }
      })
    } : current)
  }

  const buildQuestionForSection = (sectionId: string, source: {
    id?: string
    type: Question['type']
    body: string
    marks: number
    difficulty: Question['difficulty']
    questionData: Question['questionData']
    negativeMarks?: number
    tags?: string[]
  }): Question => {
    const section = test?.sections.find((item) => item.id === sectionId)
    const existing = section?.questions.find((item) => item.id === source.id)
    return {
      id: source.id || localId('question'),
      sectionId,
      type: source.type,
      body: source.body,
      order: existing?.order ?? ((section?.questions.length ?? 0) + 1),
      marks: Number(source.marks) || 1,
      negativeMarks: source.negativeMarks ?? 0,
      difficulty: source.difficulty,
      tags: source.tags ?? [],
      questionData: source.questionData
    }
  }

  const fetchTest = async () => {
    try {
      setIsLoading(true)
      const data = await testsApi.get(testId)
      setTest(data)
      setIsOfflineMode(false)
    } catch (error) {
      setIsOfflineMode(true)
      setTest(makeOfflineTest(testId))
      setBankItems(filterFallbackBankItems(bankQuery))
      if (isNetworkError(error)) {
        showToast('API is offline. Builder is using local demo data.', 'error')
      } else {
        showToast('Could not load this test. Showing a local demo draft.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBank = async (query = '') => {
    if (isOfflineMode) {
      setBankItems(filterFallbackBankItems(query))
      return
    }

    try {
      const items = await questionBankApi.list({ query })
      setBankItems(items as BankItem[])
    } catch {
      setBankItems(filterFallbackBankItems(query))
    }
  }

  useEffect(() => {
    if (testId) {
      fetchTest()
      fetchBank()
    }
  }, [testId])

  // Section handlers
  const handleAddSection = () => {
    const nextNumber = (test?.sections?.length ?? 0) + 1
    setNewSectionTitle(nextNumber === 1 ? 'Quantitative Aptitude' : `Section ${nextNumber}`)
    setIsAddSectionOpen(true)
  }

  const handleRenameSection = (sectionId: string, currentTitle: string) => {
    setRenameSectionData({ id: sectionId, title: currentTitle })
  }

  const handleDeleteSection = (sectionId: string) => {
    setDeleteSectionId(sectionId)
  }

  const handleConfirmAddSection = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    const title = newSectionTitle.trim()
    if (!title) {
      showToast('Section title is required.', 'error')
      return
    }

    if (isOfflineMode) {
      createLocalSection(title)
      showToast('Section created in local demo mode.')
      setNewSectionTitle('Section')
      setIsAddSectionOpen(false)
      return
    }

    try {
      setIsCreatingSection(true)
      const createdSection = await sectionsApi.create(testId, {
        title,
        questionsToDisplay: 0,
        shuffleQuestions: false
      })
      setTest((current) => current ? {
        ...current,
        sections: [...(current.sections ?? []), { ...createdSection, questions: createdSection.questions ?? [] }]
      } : current)
      showToast('Section created successfully.')
      setNewSectionTitle('Section')
      setIsAddSectionOpen(false)
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOfflineMode(true)
        createLocalSection(title)
        showToast('API is offline. Section created in local demo mode.', 'error')
        setNewSectionTitle('Section')
        setIsAddSectionOpen(false)
        return
      }
      showToast('Failed to create section.', 'error')
    } finally {
      setIsCreatingSection(false)
    }
  }

  const handleConfirmRenameSection = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()
    if (!renameSectionData) return
    const title = renameSectionData.title.trim()
    if (!title) return

    if (isOfflineMode) {
      renameLocalSection(renameSectionData.id, title)
      showToast('Section renamed in local demo mode.')
      setRenameSectionData(null)
      return
    }

    try {
      await sectionsApi.update(testId, renameSectionData.id, { title })
      renameLocalSection(renameSectionData.id, title)
      showToast('Section renamed successfully.')
      setRenameSectionData(null)
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOfflineMode(true)
        renameLocalSection(renameSectionData.id, title)
        showToast('API is offline. Section renamed locally.', 'error')
        setRenameSectionData(null)
        return
      }
      showToast('Failed to rename section.', 'error')
    }
  }

  const handleConfirmDeleteSection = async () => {
    if (!deleteSectionId) return

    if (isOfflineMode) {
      deleteLocalSection(deleteSectionId)
      showToast('Section deleted in local demo mode.')
      setDeleteSectionId(null)
      return
    }

    try {
      await sectionsApi.remove(testId, deleteSectionId)
      deleteLocalSection(deleteSectionId)
      showToast('Section deleted successfully.')
      setDeleteSectionId(null)
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOfflineMode(true)
        deleteLocalSection(deleteSectionId)
        showToast('API is offline. Section deleted locally.', 'error')
        setDeleteSectionId(null)
        return
      }
      showToast('Failed to delete section.', 'error')
    }
  }

  // Question handlers
  const handleSelectQuestionForEdit = (question: Question) => {
    setSelectedQuestion({
      id: question.id,
      sectionId: question.sectionId,
      type: question.type,
      body: question.body,
      marks: question.marks,
      difficulty: question.difficulty,
      questionData: { ...question.questionData }
    })
  }

  const handleCreateNewQuestion = (sectionId: string) => {
    setSelectedQuestion({
      id: '', // Empty ID indicates a new question
      sectionId,
      type: 'MCQ_SINGLE',
      body: 'Enter question text here',
      marks: 1,
      difficulty: 'MEDIUM',
      questionData: {
        type: 'MCQ_SINGLE',
        options: [
          { id: 'opt_1', text: 'Option A', isCorrect: true },
          { id: 'opt_2', text: 'Option B', isCorrect: false }
        ]
      }
    })
  }

  const handleSaveQuestion = async () => {
    if (!selectedQuestion) return
    if (!selectedQuestion.body.trim()) {
      showToast('Question text cannot be empty.', 'error')
      return
    }

    const payload = {
      body: selectedQuestion.body,
      marks: Number(selectedQuestion.marks),
      negativeMarks: 0,
      tags: [],
      difficulty: selectedQuestion.difficulty,
      questionData: selectedQuestion.questionData
    }

    const saveQuestionLocally = () => {
      const localQuestion = buildQuestionForSection(selectedQuestion.sectionId, {
        id: selectedQuestion.id || undefined,
        type: selectedQuestion.type,
        body: selectedQuestion.body,
        marks: Number(selectedQuestion.marks),
        difficulty: selectedQuestion.difficulty,
        questionData: selectedQuestion.questionData,
        negativeMarks: 0,
        tags: []
      })
      upsertLocalQuestion(selectedQuestion.sectionId, localQuestion)
      setSelectedQuestion(null)
    }

    if (isOfflineMode) {
      saveQuestionLocally()
      showToast('Question saved in local demo mode.')
      return
    }

    try {
      if (selectedQuestion.id) {
        const updatedQuestion = await questionsApi.update(selectedQuestion.id, payload)
        upsertLocalQuestion(updatedQuestion.sectionId, updatedQuestion)
        showToast('Question updated successfully.')
      } else {
        const createdQuestion = await questionsApi.create(selectedQuestion.sectionId, payload)
        upsertLocalQuestion(selectedQuestion.sectionId, createdQuestion)
        showToast('Question created successfully.')
      }

      setSelectedQuestion(null)
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOfflineMode(true)
        saveQuestionLocally()
        showToast('API is offline. Question saved locally.', 'error')
        return
      }
      showToast('Failed to save question.', 'error')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Delete this question?')) return

    if (isOfflineMode) {
      deleteLocalQuestion(questionId)
      showToast('Question deleted in local demo mode.')
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null)
      }
      return
    }

    try {
      await questionsApi.remove(questionId)
      deleteLocalQuestion(questionId)
      showToast('Question deleted successfully.')
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null)
      }
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOfflineMode(true)
        deleteLocalQuestion(questionId)
        showToast('API is offline. Question deleted locally.', 'error')
        if (selectedQuestion?.id === questionId) {
          setSelectedQuestion(null)
        }
        return
      }
      showToast('Failed to delete question.', 'error')
    }
  }

  const handleAddFromBank = async (bankItem: BankItem, sectionId: string) => {
    const addQuestionLocally = () => {
      const localQuestion = buildQuestionForSection(sectionId, {
        type: bankItem.type,
        body: bankItem.body,
        marks: bankItem.marks || 1,
        difficulty: bankItem.difficulty || 'MEDIUM',
        questionData: bankItem.questionData,
        negativeMarks: bankItem.negativeMarks || 0,
        tags: bankItem.tags || []
      })
      upsertLocalQuestion(sectionId, localQuestion)
    }

    if (isOfflineMode) {
      addQuestionLocally()
      showToast('Question added from bank in local demo mode.')
      return
    }

    try {
      const createdQuestion = await questionsApi.create(sectionId, {
        body: bankItem.body,
        marks: bankItem.marks || 1,
        negativeMarks: 0,
        tags: bankItem.tags || [],
        difficulty: bankItem.difficulty || 'MEDIUM',
        questionData: bankItem.questionData
      })
      upsertLocalQuestion(sectionId, createdQuestion)
      showToast('Question added from bank.')
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOfflineMode(true)
        addQuestionLocally()
        showToast('API is offline. Question added locally.', 'error')
        return
      }
      showToast('Failed to add question from bank.', 'error')
    }
  }

  const handlePublish = async () => {
    const publishLocally = () => {
      const accessCode = Math.random().toString(36).slice(2, 8).toUpperCase()
      const accessLink = `${window.location.origin}/t/${accessCode}`
      setPublishedData({ accessCode, accessLink })
      setTest((current) => current ? {
        ...current,
        status: 'PUBLISHED',
        accessCode,
        accessLink,
        totalMarks: current.sections.reduce((sum, section) =>
          sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0), 0)
      } : current)
    }

    if (isOfflineMode) {
      publishLocally()
      showToast('Test published in local demo mode.')
      return
    }

    try {
      const res = await testsApi.publish(testId)
      setPublishedData(res)
      setTest((current) => current ? {
        ...current,
        status: 'PUBLISHED',
        accessCode: res.accessCode,
        accessLink: res.accessLink
      } : current)
      showToast('Test published successfully!')
    } catch (error) {
      if (isNetworkError(error)) {
        setIsOfflineMode(true)
        publishLocally()
        showToast('API is offline. Test published locally for demo.', 'error')
        return
      }
      const msg = (error as any).response?.data?.error?.message ?? 'Failed to publish test.'
      showToast(msg, 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-on-surface">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm text-on-surface-variant">Loading test builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-on-surface">
      {toast && (
        <div className="fixed right-6 top-20 z-50">
          <Toast message={toast.message} tone={toast.tone} />
        </div>
      )}

      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-gutter">
          <div className="flex items-center gap-stack-sm text-sm">
            <Link className="flex items-center gap-1 text-on-surface-variant transition-colors hover:text-primary" href="/dashboard">
              <MaterialIcon name="home" className="text-[18px]" />
              Dashboard
            </Link>
            <MaterialIcon name="chevron_right" className="text-[18px] text-outline" />
            <span className="font-medium text-on-surface">{test?.title || 'Untitled Test'}</span>
            {test?.status && (
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${test.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 'bg-outline-variant/30 text-on-surface-variant'}`}>
                {test.status}
              </span>
            )}
          </div>
          <nav className="hidden items-center gap-stack-md md:flex">
            <Link className="rounded-md px-3 py-2 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low" href="/dashboard">
              Dashboard
            </Link>
            <span className="rounded-md bg-surface-container px-3 py-2 text-sm font-medium text-on-surface">Test Editor</span>
          </nav>
          <div className="flex items-center gap-stack-md">
            {test?.accessCode && (
              <Link className="flex h-10 items-center gap-2 rounded border border-outline-variant px-4 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low" href={`/t/${test.accessCode}`} target="_blank">
                <MaterialIcon name="visibility" className="text-[18px]" />
                Preview Taker
              </Link>
            )}
            <Link className="flex h-10 items-center gap-2 rounded border border-outline-variant px-4 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low" href={`/dashboard/tests/${testId}/settings`}>
              <MaterialIcon name="settings" className="text-[18px]" />
              Settings
            </Link>
            {test?.status !== 'PUBLISHED' && (
              <button
                className="flex h-10 items-center gap-2 rounded bg-primary px-6 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-on-primary-fixed-variant"
                onClick={() => {
                  setPublishedData(null)
                  setIsPublishOpen(true)
                }}
              >
                <MaterialIcon name="publish" className="text-[18px]" />
                Publish
              </button>
            )}
          </div>
        </div>
      </header>

      {isOfflineMode && (
        <div className="border-b border-tertiary-fixed-dim bg-tertiary-fixed px-gutter py-2 text-sm text-on-tertiary-fixed">
          <div className="mx-auto flex max-w-container-max items-center gap-2">
            <MaterialIcon name="cloud_off" className="text-[18px]" />
            <span>Demo mode is active because the API is not reachable. Builder changes work locally until the backend is running.</span>
          </div>
        </div>
      )}

      <main className="flex flex-1 overflow-hidden">
        <aside className="z-10 flex h-full w-[260px] flex-shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
          <div className="border-b border-outline-variant p-stack-md">
            <h2 className="mb-stack-sm flex items-center gap-2 text-lg font-medium text-primary">
              <MaterialIcon name="database" />
              Question Bank
            </h2>
            <div className="relative">
              <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline-variant" />
              <input
                className="w-full rounded border border-outline-variant bg-surface-container-low py-2 pl-9 pr-3 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary outline-none"
                placeholder="Search bank..."
                value={bankQuery}
                onChange={(e) => {
                  setBankQuery(e.target.value)
                  fetchBank(e.target.value)
                }}
              />
            </div>
          </div>
          <div className="flex-1 space-y-stack-md overflow-y-auto bg-surface-container-low/30 p-stack-md">
            {bankItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-on-surface-variant">
                No bank items found. Use the editor to create and save questions.
              </div>
            ) : (
              bankItems.map((item) => (
                <div
                  key={item.id || item.body}
                  className="group w-full rounded border border-outline-variant bg-surface-container-lowest p-stack-sm text-left shadow-sm hover:border-primary"
                >
                  <div className="mb-1 flex items-start justify-between">
                    <span className="rounded-full bg-primary-container/10 px-2 py-0.5 text-xs text-primary font-semibold">
                      {item.type}
                    </span>
                    {(test?.sections?.length ?? 0) > 0 && (
                      <button
                        className="rounded p-0.5 text-primary hover:bg-primary-container/10"
                        title="Add to first section"
                        onClick={() => {
                          const firstSecId = test?.sections?.[0]?.id
                          if (firstSecId) {
                            handleAddFromBank(item, firstSecId)
                          }
                        }}
                      >
                        <MaterialIcon name="add" className="text-[18px]" />
                      </button>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm text-on-surface">{item.body}</p>
                </div>
              ))
            )}
          </div>
        </aside>

        <section className="flex-1 overflow-y-auto bg-surface-container p-gutter">
          <div className="mx-auto max-w-[800px] space-y-stack-lg pb-32">
            {test?.sections?.length === 0 ? (
              <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <div className="border-b border-outline-variant bg-primary-container/5 p-stack-md">
                  <div className="flex items-center gap-3">
                    <MaterialIcon name="post_add" className="text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold text-on-surface">Create First Section</h3>
                      <p className="text-sm text-on-surface-variant">Every test needs at least one section before questions can be added.</p>
                    </div>
                  </div>
                </div>
                <form className="space-y-stack-md p-stack-lg" onSubmit={handleConfirmAddSection}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Section title
                    <input
                      className="mt-2 w-full rounded border border-outline-variant bg-surface p-3 text-base font-normal text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
                      value={newSectionTitle}
                      onChange={(event) => setNewSectionTitle(event.target.value)}
                      placeholder="Quantitative Aptitude"
                      autoFocus
                    />
                  </label>
                  <div className="grid gap-stack-md md:grid-cols-3">
                    <div className="rounded border border-outline-variant bg-surface-container-low p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Time</div>
                      <div className="mt-1 text-sm font-medium text-on-surface">Uses test default</div>
                    </div>
                    <div className="rounded border border-outline-variant bg-surface-container-low p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Shuffle</div>
                      <div className="mt-1 text-sm font-medium text-on-surface">Off by default</div>
                    </div>
                    <div className="rounded border border-outline-variant bg-surface-container-low p-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Questions shown</div>
                      <div className="mt-1 text-sm font-medium text-on-surface">All questions</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-stack-sm border-t border-outline-variant pt-stack-md">
                    <Link
                      href="/dashboard"
                      className="inline-flex h-11 items-center justify-center rounded-md border border-outline-variant bg-surface px-4 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                    >
                      Back to Tests
                    </Link>
                    <Button type="submit" className="gap-2" disabled={isCreatingSection}>
                      <MaterialIcon name="add" className="text-[18px]" />
                      {isCreatingSection ? 'Creating...' : 'Create Section'}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              test?.sections?.map((section, secIdx) => (
                <div key={section.id} className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                  <div className="group flex cursor-pointer items-center justify-between border-b border-outline-variant bg-primary-container/5 p-stack-md transition-colors hover:bg-primary-container/10">
                    <div className="flex items-center gap-3">
                      <MaterialIcon name="drag_indicator" className="cursor-grab text-outline-variant group-hover:text-primary" />
                      <h3 className="text-xl font-semibold text-on-surface">Section {secIdx + 1}: {section.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded p-1 text-on-surface-variant hover:bg-surface-variant" onClick={() => handleRenameSection(section.id, section.title)}><MaterialIcon name="edit" className="text-[20px]" /></button>
                      <button className="rounded p-1 text-error hover:bg-error-container" onClick={() => handleDeleteSection(section.id)}><MaterialIcon name="delete" className="text-[20px]" /></button>
                    </div>
                  </div>

                  <div className="space-y-stack-sm p-stack-md">
                    {section.questions?.length === 0 ? (
                      <div className="py-6 text-center text-sm text-on-surface-variant">
                        No questions in this section yet.
                      </div>
                    ) : (
                      section.questions?.map((question, qIdx) => (
                        <div
                          key={question.id}
                          className={`relative flex w-full gap-stack-sm rounded border-2 p-stack-md text-left shadow-sm cursor-pointer transition-all ${selectedQuestion?.id === question.id ? 'border-primary bg-surface-container-lowest ring-4 ring-primary/10' : 'border-outline-variant bg-surface-container-lowest hover:border-outline'}`}
                          onClick={() => handleSelectQuestionForEdit(question)}
                        >
                          <div className="mt-1 flex flex-col items-center gap-2">
                            <MaterialIcon name="drag_indicator" className="cursor-grab text-outline-variant hover:text-primary" />
                            <span className="text-xs font-bold text-on-surface-variant">{qIdx + 1}</span>
                          </div>
                          <div className="flex-1 pl-2">
                            <div className="mb-2 flex items-start justify-between">
                              <span className="rounded-full bg-primary-container/10 px-2 py-0.5 text-xs font-bold text-primary">
                                {question.type === 'MCQ_SINGLE' ? 'Multiple Choice' : question.type === 'TRUE_FALSE' ? 'True / False' : 'Fill in Blank'}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-on-surface-variant">{question.marks} Marks</span>
                                <button
                                  className="text-outline hover:text-error rounded p-0.5"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteQuestion(question.id)
                                  }}
                                >
                                  <MaterialIcon name="delete" className="text-[18px]" />
                                </button>
                              </div>
                            </div>
                            <p className="mb-3 text-base text-on-surface">{question.body}</p>

                            {question.type === 'MCQ_SINGLE' && (
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {((question.questionData as any)?.options || []).map((option: any, oIdx: number) => (
                                  <div key={option.id || oIdx} className={`flex items-center gap-2 rounded border p-2 ${option.isCorrect ? 'border-primary bg-primary-container/5 text-primary' : 'border-outline-variant bg-surface text-on-surface'}`}>
                                    <div className={`h-4 w-4 flex-shrink-0 rounded-full ${option.isCorrect ? 'border-4 border-primary' : 'border border-outline'}`} />
                                    <span className={option.isCorrect ? 'font-medium' : ''}>{option.text}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === 'TRUE_FALSE' && (
                              <div className="flex gap-2 text-sm">
                                <div className={`rounded border px-4 py-1.5 ${(question.questionData as any)?.correctAnswer === true ? 'border-primary bg-primary-container/5 text-primary' : 'border-outline-variant bg-surface text-on-surface'}`}>True</div>
                                <div className={`rounded border px-4 py-1.5 ${(question.questionData as any)?.correctAnswer === false ? 'border-primary bg-primary-container/5 text-primary' : 'border-outline-variant bg-surface text-on-surface'}`}>False</div>
                              </div>
                            )}

                            {question.type === 'FILL_BLANK' && (
                              <p className="text-sm text-on-surface-variant">
                                Template: <span className="font-mono text-on-surface">{((question.questionData as any)?.template)}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}

                    <button
                      className="flex w-full flex-col items-center justify-center rounded border-2 border-dashed border-outline-variant py-4 text-on-surface-variant opacity-50 transition-all hover:border-primary hover:bg-primary-container/5 hover:opacity-100"
                      onClick={() => handleCreateNewQuestion(section.id)}
                    >
                      <MaterialIcon name="add_circle" className="mb-1" />
                      <span className="text-sm font-medium">Add Question</span>
                    </button>
                  </div>
                </div>
              ))
            )}

            {test?.sections && test.sections.length > 0 && (
              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-outline py-4 text-base font-medium text-on-surface-variant transition-all hover:border-primary hover:bg-primary-container/5 hover:text-primary"
                onClick={handleAddSection}
              >
                <MaterialIcon name="post_add" className="text-[20px]" />
                Add New Section
              </button>
            )}
          </div>
        </section>

        {selectedQuestion ? (
          <aside className="z-20 flex h-full w-[380px] flex-col border-l border-outline-variant bg-surface-container-lowest shadow-[-4px_0_15px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between border-b border-outline-variant p-stack-md">
              <h3 className="text-lg font-semibold text-on-surface">
                {selectedQuestion.id ? 'Edit Question' : 'New Question'}
              </h3>
              <button className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-variant" onClick={() => setSelectedQuestion(null)}>
                <MaterialIcon name="close" />
              </button>
            </div>
            <div className="flex-1 space-y-stack-lg overflow-y-auto p-stack-md">
              <div className="flex gap-4">
                <label className="flex-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Type
                  <select
                    className="mt-1 w-full rounded border border-outline-variant bg-surface p-2 text-sm font-normal text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    value={selectedQuestion.type}
                    onChange={(e) => {
                      const type = e.target.value
                      let defaultData: any = { type }
                      if (type === 'MCQ_SINGLE') {
                        defaultData.options = [
                          { id: 'opt_1', text: 'Option A', isCorrect: true },
                          { id: 'opt_2', text: 'Option B', isCorrect: false }
                        ]
                      } else if (type === 'FILL_BLANK') {
                        defaultData.template = 'The capital of France is [blank1].'
                        defaultData.blanks = [
                          { id: 'blank1', acceptedAnswers: ['Paris'], caseSensitive: false, matchType: 'exact' }
                        ]
                      } else if (type === 'TRUE_FALSE') {
                        defaultData.correctAnswer = true
                      }
                      setSelectedQuestion((prev: any) => ({
                        ...prev,
                        type,
                        questionData: defaultData
                      }))
                    }}
                  >
                    <option value="MCQ_SINGLE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True / False</option>
                    <option value="FILL_BLANK">Fill in Blank</option>
                  </select>
                </label>
                <label className="w-24 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Marks
                  <input
                    className="mt-1 w-full rounded border border-outline-variant bg-surface p-2 text-sm font-normal text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary"
                    type="number"
                    value={selectedQuestion.marks}
                    onChange={(event) => setSelectedQuestion((prev: any) => ({ ...prev, marks: Number(event.target.value) }))}
                  />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Difficulty</label>
                <div className="flex gap-2">
                  {['EASY', 'MEDIUM', 'HARD'].map((item) => (
                    <button
                      key={item}
                      className={`flex-1 rounded border py-1.5 text-sm transition-all ${selectedQuestion.difficulty === item ? 'border-primary bg-primary-container/10 font-medium text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
                      onClick={() => setSelectedQuestion((prev: any) => ({ ...prev, difficulty: item }))}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Question Stem
                <div className="mt-1 overflow-hidden rounded border border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary">
                  <textarea
                    className="h-32 w-full resize-none bg-surface p-3 text-base font-normal text-on-surface outline-none"
                    value={selectedQuestion.body}
                    onChange={(event) => setSelectedQuestion((prev: any) => ({ ...prev, body: event.target.value }))}
                  />
                </div>
              </label>

              {selectedQuestion.type === 'MCQ_SINGLE' && (
                <div>
                  <div className="mb-2 flex items-end justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Options</label>
                    <span className="text-xs text-on-surface-variant">Select correct answer</span>
                  </div>
                  <div className="space-y-3">
                    {selectedQuestion.questionData?.options?.map((option: any, index: number) => {
                      const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
                      const letter = letters[index] || '?'
                      return (
                        <div key={option.id} className="group flex items-start gap-2">
                          <button
                            className={`mt-2 h-5 w-5 flex-shrink-0 rounded-full transition-colors ${option.isCorrect ? 'border-4 border-primary' : 'border border-outline hover:border-primary'}`}
                            onClick={() => {
                              const updated = selectedQuestion.questionData.options.map((o: any) => ({
                                ...o,
                                isCorrect: o.id === option.id
                              }))
                              setSelectedQuestion((prev: any) => ({
                                ...prev,
                                questionData: { ...prev.questionData, options: updated }
                              }))
                            }}
                          />
                          <div className={`flex flex-1 rounded bg-surface ${option.isCorrect ? 'border-2 border-primary bg-primary-container/5' : 'border border-outline-variant focus-within:border-primary'}`}>
                            <span className={`border-r px-3 py-2 text-sm font-medium ${option.isCorrect ? 'border-primary/20 bg-primary-container/10 text-primary' : 'border-outline-variant bg-surface-container text-on-surface-variant'}`}>{letter}</span>
                            <input
                              className={`w-full bg-transparent p-2 text-sm outline-none ${option.isCorrect ? 'font-medium text-on-surface' : 'text-on-surface'}`}
                              value={option.text}
                              onChange={(event) => {
                                const updated = selectedQuestion.questionData.options.map((o: any) => o.id === option.id ? { ...o, text: event.target.value } : o)
                                setSelectedQuestion((prev: any) => ({
                                  ...prev,
                                  questionData: { ...prev.questionData, options: updated }
                                }))
                              }}
                            />
                          </div>
                          {selectedQuestion.questionData.options.length > 2 && (
                            <button
                              className="mt-2 text-outline opacity-0 transition-opacity hover:text-error group-hover:opacity-100"
                              onClick={() => {
                                const updated = selectedQuestion.questionData.options.filter((o: any) => o.id !== option.id)
                                setSelectedQuestion((prev: any) => ({
                                  ...prev,
                                  questionData: { ...prev.questionData, options: updated }
                                }))
                              }}
                            >
                              <MaterialIcon name="close" className="text-[20px]" />
                            </button>
                          )}
                        </div>
                      )
                    })}
                    <button
                      className="mt-2 flex w-full items-center justify-center gap-1 rounded py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-container/10"
                      onClick={() => {
                        const len = selectedQuestion.questionData.options.length
                        const nextLetter = String.fromCharCode(65 + len)
                        const updated = [
                          ...selectedQuestion.questionData.options,
                          { id: `opt_${Date.now()}`, text: `Option ${nextLetter}`, isCorrect: false }
                        ]
                        setSelectedQuestion((prev: any) => ({
                          ...prev,
                          questionData: { ...prev.questionData, options: updated }
                        }))
                      }}
                    >
                      <MaterialIcon name="add" className="text-[18px]" />
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              {selectedQuestion.type === 'TRUE_FALSE' && (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Correct Answer</label>
                  <div className="flex gap-2">
                    {[true, false].map((val) => (
                      <button
                        key={val.toString()}
                        className={`flex-1 rounded border py-2 text-sm transition-all ${selectedQuestion.questionData.correctAnswer === val ? 'border-primary bg-primary-container/10 font-medium text-primary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
                        onClick={() => setSelectedQuestion((prev: any) => ({
                          ...prev,
                          questionData: { ...prev.questionData, correctAnswer: val }
                        }))}
                      >
                        {val ? 'True' : 'False'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedQuestion.type === 'FILL_BLANK' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Template
                    <input
                      className="mt-1 w-full rounded border border-outline-variant bg-surface p-2 text-sm font-normal text-on-surface outline-none focus:border-primary"
                      value={selectedQuestion.questionData.template}
                      onChange={(e) => setSelectedQuestion((prev: any) => ({
                        ...prev,
                        questionData: { ...prev.questionData, template: e.target.value }
                      }))}
                    />
                  </label>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Accepted Answer (for [blank1])
                    <input
                      className="mt-1 w-full rounded border border-outline-variant bg-surface p-2 text-sm font-normal text-on-surface outline-none focus:border-primary"
                      value={selectedQuestion.questionData.blanks?.[0]?.acceptedAnswers?.[0] || ''}
                      onChange={(e) => {
                        const blanks = [{ id: 'blank1', acceptedAnswers: [e.target.value], caseSensitive: false, matchType: 'exact' }]
                        setSelectedQuestion((prev: any) => ({
                          ...prev,
                          questionData: { ...prev.questionData, blanks }
                        }))
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 border-t border-outline-variant bg-surface-container-lowest p-stack-md">
              <button
                className="rounded border border-outline-variant px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant"
                onClick={() => setSelectedQuestion(null)}
              >
                Discard
              </button>
              <button
                className="rounded bg-primary px-4 py-2 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-on-primary-fixed-variant"
                onClick={handleSaveQuestion}
              >
                Save Question
              </button>
            </div>
          </aside>
        ) : (
          <aside className="z-10 flex h-full w-[380px] flex-col items-center justify-center border-l border-outline-variant bg-surface-container-lowest p-6 text-center text-on-surface-variant">
            <MaterialIcon name="edit_note" className="text-[48px] text-outline mb-2" />
            <h3 className="font-semibold text-on-surface">No Question Selected</h3>
            <p className="text-sm mt-1">Select an existing question to edit or click "Add Question" to build a new one.</p>
          </aside>
        )}
      </main>

      <Modal title="Add Section" open={isAddSectionOpen} onClose={() => setIsAddSectionOpen(false)}>
        <form className="space-y-5" onSubmit={handleConfirmAddSection}>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Section title
            <input
              className="mt-2 w-full rounded border border-outline-variant bg-surface p-3 text-base font-normal text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
              value={newSectionTitle}
              onChange={(event) => setNewSectionTitle(event.target.value)}
              placeholder="Verbal Reasoning"
              autoFocus
            />
          </label>
          <div className="rounded border border-outline-variant bg-surface-container-low p-3 text-sm text-on-surface-variant">
            New sections are added as drafts. You can add questions immediately after creating the section.
          </div>
          <div className="flex justify-end gap-3 border-t border-outline-variant pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsAddSectionOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingSection}>
              {isCreatingSection ? 'Creating...' : 'Create Section'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal title="Rename Section" open={Boolean(renameSectionData)} onClose={() => setRenameSectionData(null)}>
        <form className="space-y-5" onSubmit={handleConfirmRenameSection}>
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            Section title
            <input
              className="mt-2 w-full rounded border border-outline-variant bg-surface p-3 text-base font-normal text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary"
              value={renameSectionData?.title ?? ''}
              onChange={(event) =>
                setRenameSectionData((current) => current ? { ...current, title: event.target.value } : current)
              }
              placeholder="Section title"
              autoFocus
            />
          </label>
          <div className="flex justify-end gap-3 border-t border-outline-variant pt-4">
            <Button type="button" variant="secondary" onClick={() => setRenameSectionData(null)}>
              Cancel
            </Button>
            <Button type="submit">Save Title</Button>
          </div>
        </form>
      </Modal>

      <Modal title="Delete Section" open={Boolean(deleteSectionId)} onClose={() => setDeleteSectionId(null)}>
        <div className="space-y-5">
          <div className="rounded border border-error/30 bg-error-container p-4 text-sm text-on-error-container">
            This removes the section and its questions from the draft test.
          </div>
          <div className="flex justify-end gap-3 border-t border-outline-variant pt-4">
            <Button type="button" variant="secondary" onClick={() => setDeleteSectionId(null)}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleConfirmDeleteSection}>
              Delete Section
            </Button>
          </div>
        </div>
      </Modal>

      <Modal title="Publish Checklist" open={isPublishOpen} onClose={() => setIsPublishOpen(false)}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded border border-outline-variant p-3 animate-fade-in">
            <MaterialIcon name="check_circle" className="text-success" />
            <span className="text-on-surface font-medium">Ready to publish test "{test?.title}"</span>
          </div>

          {!publishedData ? (
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsPublishOpen(false)}>Cancel</Button>
              <Button onClick={handlePublish}>Confirm Publish</Button>
            </div>
          ) : (
            <div className="rounded border border-outline-variant bg-surface-container-low p-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase">Direct Access Link</p>
                <a
                  className="font-medium text-primary hover:underline break-all text-sm block mt-1"
                  href={publishedData.accessLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {publishedData.accessLink}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase">6-Character Access Code</p>
                <p className="text-3xl font-bold text-primary tracking-wider mt-1">{publishedData.accessCode}</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => {
                  setIsPublishOpen(false)
                  if (!isOfflineMode) {
                    fetchTest()
                  }
                }}>Done</Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
