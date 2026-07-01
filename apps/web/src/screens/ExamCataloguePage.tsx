'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MaterialIcon } from '../components/ui/MaterialIcon'
import { SiteNav } from '../components/layout/SiteNav'

interface Exam {
  name: string
  sections: string
  duration: string
  marks: string
  questions: number
  badge?: string
}

interface Category {
  id: string
  label: string
  icon: string
  iconColor: string
  bg: string
  border: string
  description: string
  exams: Exam[]
}

const categories: Category[] = [
  {
    id: 'engineering',
    label: 'Engineering Entrance',
    icon: 'engineering',
    iconColor: 'text-primary',
    bg: 'bg-primary-container/10',
    border: 'border-primary/20',
    description: 'Top engineering entrance exams for IIT, NIT, BITS and other premier institutions.',
    exams: [
      { name: 'JEE Main', sections: 'Physics · Chemistry · Maths', duration: '3 hrs', marks: '300', questions: 90, badge: 'Popular' },
      { name: 'JEE Advanced', sections: 'Paper 1 + Paper 2', duration: '3 + 3 hrs', marks: '360', questions: 54 },
      { name: 'BITSAT', sections: 'PCM + English + Logic', duration: '3 hrs', marks: '450', questions: 150 },
      { name: 'VITEEE', sections: 'PCM/PCB + Aptitude + English', duration: '2.5 hrs', marks: '125', questions: 125 },
      { name: 'MHT CET', sections: 'PCM / PCB', duration: '3 hrs', marks: '200', questions: 150 },
      { name: 'KCET', sections: 'Physics · Chemistry · Maths', duration: '80 min', marks: '60', questions: 60 },
    ],
  },
  {
    id: 'medical',
    label: 'Medical Entrance',
    icon: 'medical_services',
    iconColor: 'text-tertiary',
    bg: 'bg-tertiary-container/10',
    border: 'border-tertiary/20',
    description: 'National and state-level medical entrance tests for MBBS, BDS and allied health programs.',
    exams: [
      { name: 'NEET UG', sections: 'Physics · Chemistry · Biology', duration: '3 hrs 20 min', marks: '720', questions: 180, badge: 'Popular' },
      { name: 'AIIMS MBBS', sections: 'PCB + GK + Aptitude', duration: '3.5 hrs', marks: '200', questions: 200 },
      { name: 'JIPMER', sections: 'PCB + English + Logical', duration: '2.5 hrs', marks: '200', questions: 200 },
      { name: 'NEET PG', sections: 'Clinical Sciences', duration: '3.5 hrs', marks: '1200', questions: 200 },
      { name: 'MH CET Medical', sections: 'Physics · Chemistry · Biology', duration: '3 hrs', marks: '200', questions: 200 },
    ],
  },
  {
    id: 'government',
    label: 'Government & Civil Services',
    icon: 'account_balance',
    iconColor: 'text-[#b45309]',
    bg: 'bg-[#fffbeb]',
    border: 'border-[#fde68a]',
    description: 'UPSC, banking, railways, SSC and state public service commission exams.',
    exams: [
      { name: 'UPSC CSE Prelims', sections: 'GS Paper 1 + CSAT', duration: '2 + 2 hrs', marks: '400', questions: 200, badge: 'Popular' },
      { name: 'SSC CGL', sections: 'Tier 1 — Reasoning · GK · Quant · English', duration: '60 min', marks: '200', questions: 100 },
      { name: 'IBPS PO', sections: 'Reasoning · English · Quantitative', duration: '60 min', marks: '100', questions: 100 },
      { name: 'RRB NTPC', sections: 'Maths · Reasoning · General Awareness', duration: '90 min', marks: '100', questions: 100 },
      { name: 'SBI PO', sections: 'Reasoning · English · Data Interpretation', duration: '60 min', marks: '100', questions: 100 },
      { name: 'IBPS Clerk', sections: 'Reasoning · English · Numerical', duration: '60 min', marks: '100', questions: 100 },
      { name: 'RBI Grade B', sections: 'Phase 1 — Reasoning · English · Finance', duration: '120 min', marks: '200', questions: 200 },
    ],
  },
  {
    id: 'management',
    label: 'Management Entrance',
    icon: 'business_center',
    iconColor: 'text-secondary',
    bg: 'bg-secondary-container/20',
    border: 'border-secondary/20',
    description: 'MBA and post-graduate management entrance tests for IIMs, XLRI and top B-schools.',
    exams: [
      { name: 'CAT', sections: 'VARC · DILR · Quantitative Aptitude', duration: '2 hrs', marks: '198', questions: 66, badge: 'Popular' },
      { name: 'XAT', sections: 'Decision Making · VALR · QA + GK', duration: '3 hrs', marks: '303', questions: 101 },
      { name: 'SNAP', sections: 'English · Analytical & Logical · Quantitative', duration: '60 min', marks: '60', questions: 60 },
      { name: 'NMAT', sections: 'Language Skills · Quantitative · Logical', duration: '2 hrs', marks: '108', questions: 108 },
      { name: 'MAT', sections: 'Language · Maths · DI · Reasoning · GK', duration: '150 min', marks: '200', questions: 200 },
      { name: 'IIFT', sections: 'GK · English · Logical · Quantitative', duration: '2 hrs', marks: '300', questions: 110 },
    ],
  },
  {
    id: 'law',
    label: 'Law & Defence',
    icon: 'gavel',
    iconColor: 'text-error',
    bg: 'bg-error-container/20',
    border: 'border-error/20',
    description: 'Law school entrance and defence services exams including CLAT, NDA and CDS.',
    exams: [
      { name: 'CLAT', sections: 'English · Current Affairs · Maths · Reasoning · Legal', duration: '2 hrs', marks: '150', questions: 150, badge: 'Popular' },
      { name: 'NDA', sections: 'Mathematics + General Ability Test', duration: '2.5 + 2.5 hrs', marks: '900', questions: 270 },
      { name: 'CDS', sections: 'English · General Knowledge · Elementary Maths', duration: '2 + 2 + 2 hrs', marks: '300', questions: 300 },
      { name: 'AILET', sections: 'English · GK · Reasoning · Legal Aptitude', duration: '90 min', marks: '150', questions: 150 },
      { name: 'LSAT India', sections: 'Analytical Reasoning · LR · RC', duration: '2 hrs 20 min', marks: '100', questions: 92 },
    ],
  },
  {
    id: 'school',
    label: 'School & Olympiads',
    icon: 'menu_book',
    iconColor: 'text-on-surface-variant',
    bg: 'bg-surface-container',
    border: 'border-outline-variant',
    description: 'Board examinations and national-level competitive olympiads for Classes 1–12.',
    exams: [
      { name: 'CBSE Board — Class 10 / 12', sections: 'All subjects · MCQ + Subjective', duration: '3 hrs', marks: '100', questions: 80, badge: 'Popular' },
      { name: 'ICSE / ISC', sections: 'Class 10 & 12 · All subjects', duration: '2–3 hrs', marks: '100', questions: 80 },
      { name: 'NSO (Science Olympiad)', sections: 'Class 1–12 · Science', duration: '60 min', marks: '50', questions: 50 },
      { name: 'IMO (Maths Olympiad)', sections: 'Class 1–12 · Mathematics', duration: '60 min', marks: '50', questions: 50 },
      { name: 'NTSE', sections: 'Mental Ability Test + Scholastic Aptitude', duration: '2 + 2 hrs', marks: '200', questions: 200 },
      { name: 'KVPY', sections: 'SA / SX / SB streams', duration: '3 hrs', marks: '100', questions: 80 },
      { name: 'State Board Exams', sections: 'UP · Maharashtra · TN · Karnataka…', duration: 'Varies', marks: 'Varies', questions: 0 },
    ],
  },
]

export function ExamCataloguePage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') ?? 'all'
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')

  const visibleCategories = useMemo(() => {
    const cats = activeCategory === 'all' ? categories : categories.filter((c) => c.id === activeCategory)
    if (!search.trim()) return cats
    const q = search.toLowerCase()
    return cats
      .map((cat) => ({
        ...cat,
        exams: cat.exams.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.sections.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.exams.length > 0)
  }, [activeCategory, search])

  return (
    <div className="min-h-screen bg-background text-on-background antialiased">
      <SiteNav />

      {/* Header */}
      <div className="border-b border-outline-variant bg-surface-container-lowest px-margin-mobile py-12 md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <div className="mb-2 flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/" className="hover:text-primary">Home</Link>
            <MaterialIcon name="chevron_right" className="text-[16px]" />
            <span className="font-medium text-on-surface">Exam Catalogue</span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-on-background">Exam Catalogue</h1>
          <p className="mb-8 max-w-2xl text-base text-on-surface-variant">
            1,000+ mock tests across 6 major exam categories. Practice with real exam patterns and get instant results.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search exams — JEE, UPSC, CAT…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[44px] w-full rounded-xl border border-outline-variant bg-surface pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop">
        {/* Category filter tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeCategory === 'all'
                ? 'bg-primary text-on-primary'
                : 'border border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant bg-surface text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              <MaterialIcon name={cat.icon} className="text-[14px]" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Exam lists */}
        {visibleCategories.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <MaterialIcon name="search_off" className="mb-4 text-[48px] text-on-surface-variant/40" />
            <p className="text-lg font-semibold text-on-surface">No exams match &ldquo;{search}&rdquo;</p>
            <p className="mt-1 text-sm text-on-surface-variant">Try a different keyword or browse by category.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {visibleCategories.map((cat) => (
              <section key={cat.id}>
                {/* Category heading */}
                <div className={`mb-5 flex items-center gap-3 rounded-xl border p-4 ${cat.bg} ${cat.border}`}>
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-surface/60">
                    <MaterialIcon name={cat.icon} className={`text-[22px] ${cat.iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-on-surface">{cat.label}</h2>
                    <p className="text-xs text-on-surface-variant">{cat.description}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-surface/70 px-3 py-1 text-xs font-semibold text-on-surface-variant">
                    {cat.exams.length} exams
                  </span>
                </div>

                {/* Exam cards grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cat.exams.map((exam) => (
                    <div
                      key={exam.name}
                      className="flex flex-col rounded-xl border border-outline-variant bg-surface p-stack-md shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-on-surface">{exam.name}</h3>
                        {exam.badge && (
                          <span className="flex-none rounded-full bg-primary-container/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            {exam.badge}
                          </span>
                        )}
                      </div>
                      <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">{exam.sections}</p>
                      <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-3 text-xs text-on-surface-variant">
                        <span className="flex items-center gap-1">
                          <MaterialIcon name="schedule" className="text-[14px]" />
                          {exam.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <MaterialIcon name="bar_chart" className="text-[14px]" />
                          {exam.marks} marks
                        </span>
                        {exam.questions > 0 && (
                          <span className="flex items-center gap-1">
                            <MaterialIcon name="quiz" className="text-[14px]" />
                            {exam.questions} Qs
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex h-[36px] items-center justify-center gap-1 rounded-lg border border-outline-variant bg-surface-container-low text-xs font-semibold text-on-surface-variant cursor-not-allowed select-none">
                        <MaterialIcon name="lock_clock" className="text-[16px]" />
                        Coming Soon
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 border-t border-outline-variant bg-surface-container-highest px-margin-mobile py-8 md:px-margin-desktop">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <MaterialIcon name="quiz" className="text-[20px] text-on-surface-variant" />
            <span className="text-base font-bold text-on-surface-variant">QuizForge</span>
          </div>
          <p className="text-xs text-on-surface-variant">&copy; 2026 QuizForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
