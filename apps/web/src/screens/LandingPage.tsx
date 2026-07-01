'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MaterialIcon } from '../components/ui/MaterialIcon'
import { SiteNav } from '../components/layout/SiteNav'

function BrowserMock() {
  return (
    <div className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-[0_20px_25px_rgba(0,0,0,0.1)] transition-transform duration-500 md:rotate-2 md:hover:rotate-0">
      <div className="flex h-12 items-center gap-4 border-b border-outline-variant bg-surface-container-lowest px-stack-md">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-error-container" />
          <div className="h-3 w-3 rounded-full bg-tertiary-fixed-dim" />
          <div className="h-3 w-3 rounded-full bg-surface-variant" />
        </div>
        <div className="flex-1 rounded-md bg-surface-container px-3 py-1 text-center font-mono text-xs text-on-surface-variant">
          app.quizforge.com/editor
        </div>
      </div>
      <div className="flex flex-1 gap-gutter bg-surface-container-lowest p-gutter">
        <div className="flex w-1/4 flex-col gap-stack-sm border-r border-outline-variant pr-gutter">
          <div className="mb-4 h-6 w-3/4 rounded bg-surface-variant" />
          <div className="flex h-8 w-full items-center rounded-r border-l-2 border-primary bg-primary-container/10 px-2">
            <span className="h-3 w-1/2 rounded bg-primary" />
          </div>
          <div className="flex h-8 w-full items-center rounded bg-surface-container-low px-2">
            <span className="h-3 w-2/3 rounded bg-outline-variant" />
          </div>
          <div className="flex h-8 w-full items-center rounded bg-surface-container-low px-2">
            <span className="h-3 w-1/2 rounded bg-outline-variant" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-stack-md">
          <div className="h-8 w-1/3 rounded bg-surface-variant" />
          <div className="flex h-32 w-full flex-col gap-2 rounded-lg border border-outline-variant p-stack-md">
            <div className="h-4 w-full rounded bg-surface-container-high" />
            <div className="h-4 w-5/6 rounded bg-surface-container-high" />
          </div>
          <div className="mt-auto flex gap-stack-sm">
            <div className="h-10 w-24 rounded-lg bg-surface-variant" />
            <div className="ml-auto h-10 w-32 rounded-lg bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}

const roles = [
  {
    icon: 'edit_note',
    label: 'Creator',
    tagline: 'Build & publish assessments',
    desc: 'Design multi-section tests, add 10+ question types, configure timing and scoring, then publish with a shareable access code.',
    steps: ['Build multi-section tests', 'Configure timing & scoring', 'Publish with an access code', 'Review attempt analytics'],
    cta: 'Go to Creator Studio',
    href: '/dashboard',
    iconBg: 'bg-primary-container/10',
    iconColor: 'text-primary',
    ctaClass: 'bg-primary text-on-primary hover:bg-surface-tint',
  },
  {
    icon: 'school',
    label: 'Test Taker',
    tagline: 'Discover & attempt exams',
    desc: 'Browse a catalogue of 1000+ mock tests across Engineering, Medical, Government, Management, Law and School exams.',
    steps: ['Browse by exam category', 'Join via access code', 'Take timed mock tests', 'Receive instant results'],
    cta: 'Browse Exams',
    href: '/exams',
    iconBg: 'bg-tertiary-container/10',
    iconColor: 'text-tertiary',
    ctaClass: 'border border-outline-variant bg-surface text-on-surface hover:border-tertiary hover:text-tertiary',
  },
  {
    icon: 'admin_panel_settings',
    label: 'Admin',
    tagline: 'Manage the platform',
    desc: 'Control user roles, audit and archive tests, curate the exam catalogue, and monitor platform-wide analytics.',
    steps: ['Manage users & roles', 'Audit and moderate tests', 'Curate exam catalogue', 'View platform analytics'],
    cta: 'Admin Panel',
    href: '/admin',
    iconBg: 'bg-secondary-container/30',
    iconColor: 'text-secondary',
    ctaClass: 'border border-outline-variant bg-surface text-on-surface hover:border-secondary hover:text-secondary',
  },
]

const examCats = [
  {
    id: 'engineering',
    label: 'Engineering Entrance',
    icon: 'engineering',
    sub: 'JEE Main · JEE Advanced · BITSAT · VITEEE · MHT CET',
    count: '240+ tests',
    bg: 'bg-primary-container/10',
    border: 'border-primary/20',
    iconColor: 'text-primary',
  },
  {
    id: 'medical',
    label: 'Medical Entrance',
    icon: 'medical_services',
    sub: 'NEET UG · AIIMS MBBS · JIPMER · NEET PG',
    count: '180+ tests',
    bg: 'bg-tertiary-container/10',
    border: 'border-tertiary/20',
    iconColor: 'text-tertiary',
  },
  {
    id: 'government',
    label: 'Government & Civil Services',
    icon: 'account_balance',
    sub: 'UPSC CSE · SSC CGL · IBPS PO · RRB NTPC · SBI PO',
    count: '310+ tests',
    bg: 'bg-[#fffbeb]',
    border: 'border-[#fde68a]',
    iconColor: 'text-[#b45309]',
  },
  {
    id: 'management',
    label: 'Management Entrance',
    icon: 'business_center',
    sub: 'CAT · XAT · SNAP · NMAT · MAT · IIFT',
    count: '150+ tests',
    bg: 'bg-secondary-container/20',
    border: 'border-secondary/20',
    iconColor: 'text-secondary',
  },
  {
    id: 'law',
    label: 'Law & Defence',
    icon: 'gavel',
    sub: 'CLAT · NDA · CDS · AILET · MH CET Law',
    count: '90+ tests',
    bg: 'bg-error-container/20',
    border: 'border-error/20',
    iconColor: 'text-error',
  },
  {
    id: 'school',
    label: 'School & Olympiads',
    icon: 'menu_book',
    sub: 'CBSE · ICSE · NSO · IMO · NTSE · KVPY',
    count: '200+ tests',
    bg: 'bg-surface-container',
    border: 'border-outline-variant',
    iconColor: 'text-on-surface-variant',
  },
]

export function LandingPage() {
  const [accessCode, setAccessCode] = useState('')
  const router = useRouter()

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault()
    const code = accessCode.trim()
    if (code) router.push(`/t/${code}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background antialiased">
      <SiteNav />

      <main className="flex flex-grow flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
          <div className="relative z-10 mx-auto grid max-w-container-max grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="flex max-w-2xl flex-col gap-stack-lg">
              <h1 className="text-4xl font-bold text-on-background">
                Build tests that <span className="text-primary">mean something.</span>
              </h1>
              <p className="max-w-xl text-lg text-on-surface-variant">
                A professional assessment platform engineered for clarity, rigor, and actionable insights. Design high-stakes evaluations with a low-noise interface that prioritizes focus.
              </p>
              <div className="flex flex-wrap gap-stack-md pt-stack-sm">
                <Link href="/dashboard/tests/demo-test/build" className="flex h-[48px] items-center gap-2 rounded-lg bg-primary px-8 text-lg font-medium text-on-primary shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-colors hover:bg-surface-tint">
                  <span>Create a Test</span>
                  <MaterialIcon name="arrow_forward" className="text-[20px]" />
                </Link>
                <Link href="/exams" className="flex h-[48px] items-center rounded-lg border border-outline-variant bg-surface px-8 text-lg font-medium text-on-surface transition-colors hover:border-primary hover:text-primary">
                  Browse Exams
                </Link>
              </div>

              {/* Access code entry */}
              <form onSubmit={handleJoin} className="mt-2 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-on-surface-variant">Have an access code?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. XY9-KZ4"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    maxLength={12}
                    className="h-[40px] flex-1 rounded-lg border border-outline-variant bg-surface px-4 font-mono text-sm font-medium tracking-widest text-on-surface placeholder-on-surface-variant/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={!accessCode.trim()}
                    className="flex h-[40px] items-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    Join
                    <MaterialIcon name="arrow_forward" className="text-[18px]" />
                  </button>
                </div>
              </form>

              <div className="flex items-center gap-stack-md text-sm text-on-surface-variant">
                <div className="flex -space-x-2">
                  {[['A', 'text-primary'], ['B', 'text-tertiary'], ['C', 'text-secondary']].map(([letter, color]) => (
                    <div key={letter} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-surface-container-high text-xs font-bold ${color}`}>
                      {letter}
                    </div>
                  ))}
                </div>
                <span>Trusted by 10,000+ educators &amp; professionals.</span>
              </div>
            </div>
            <BrowserMock />
          </div>
        </section>

        {/* Who is QuizForge for? */}
        <section className="border-y border-outline-variant bg-surface-container-lowest py-24">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-on-background">One Platform, Three Journeys</h2>
              <p className="mx-auto max-w-2xl text-base text-on-surface-variant">
                Whether you&apos;re building tests, taking them, or managing the platform — QuizForge has a purpose-built workflow for each role.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {roles.map((role) => (
                <div key={role.label} className="flex flex-col rounded-xl border border-outline-variant bg-surface p-stack-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md">
                  <div className={`mb-stack-md flex h-12 w-12 items-center justify-center rounded-lg ${role.iconBg}`}>
                    <MaterialIcon name={role.icon} className={`text-[24px] ${role.iconColor}`} />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-on-surface">{role.label}</h3>
                  <p className="mb-stack-sm text-sm font-medium text-on-surface-variant">{role.tagline}</p>
                  <p className="mb-stack-md text-sm leading-relaxed text-on-surface-variant">{role.desc}</p>
                  <ul className="mb-stack-lg flex flex-col gap-2">
                    {role.steps.map((step) => (
                      <li key={step} className="flex items-center gap-2 text-sm text-on-surface">
                        <MaterialIcon name="check_circle" className="text-[16px] text-primary" fill />
                        {step}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={role.href}
                    className={`mt-auto flex h-[40px] items-center justify-center gap-1 rounded-lg text-sm font-semibold transition-colors ${role.ctaClass}`}
                  >
                    {role.cta}
                    <MaterialIcon name="arrow_forward" className="text-[16px]" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-outline-variant bg-surface py-24">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-on-background">Engineered for Assessment Excellence</h2>
              <p className="mx-auto max-w-2xl text-base text-on-surface-variant">
                Tools designed specifically for rigorous testing environments, avoiding gamified distractions to focus on what matters: measuring understanding.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {([
                ['view_quilt', 'Custom Sections', 'Organize complex exams into logical sections. Group related questions, set distinct time limits, and control navigation flow for structured evaluations.', 'bg-primary-container/10 text-primary'],
                ['list_alt', '10+ Question Types', 'From basic multiple-choice to advanced matching and short-answer formats. Build comprehensive assessments that accurately gauge diverse skill sets.', 'bg-tertiary-container/10 text-tertiary'],
                ['analytics', 'Instant Analytics', 'Generate immediate, actionable insights. Analyze performance metrics, identify knowledge gaps, and export detailed reports for stakeholders.', 'bg-secondary-container text-on-secondary-container'],
              ] as const).map(([icon, title, text, tone]) => (
                <div key={title} className="rounded-xl border border-outline-variant bg-surface p-stack-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-md">
                  <div className={`mb-stack-md flex h-12 w-12 items-center justify-center rounded-lg ${tone}`}>
                    <MaterialIcon name={icon} className="text-[24px]" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-on-surface">{title}</h3>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam categories */}
        <section id="exams" className="border-b border-outline-variant bg-surface-container-lowest py-24">
          <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-on-background">Explore All Exam Categories</h2>
              <p className="mx-auto max-w-2xl text-base text-on-surface-variant">
                1,000+ mock tests across 6 major exam verticals. Find the exact test series you need.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
              {examCats.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/exams?category=${cat.id}`}
                  className={`group flex items-start gap-4 rounded-xl border p-stack-lg transition-all hover:shadow-md ${cat.bg} ${cat.border}`}
                >
                  <div className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-surface/60 ${cat.iconColor}`}>
                    <MaterialIcon name={cat.icon} className="text-[24px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-base font-semibold text-on-surface">{cat.label}</h3>
                    <p className="mb-2 text-xs leading-relaxed text-on-surface-variant">{cat.sub}</p>
                    <span className="inline-flex items-center rounded-full bg-surface/70 px-2 py-0.5 text-xs font-semibold text-on-surface-variant">
                      {cat.count}
                    </span>
                  </div>
                  <MaterialIcon name="arrow_forward" className={`mt-1 flex-none text-[18px] opacity-0 transition-opacity group-hover:opacity-100 ${cat.iconColor}`} />
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/exams" className="inline-flex h-[48px] items-center gap-2 rounded-lg border border-outline-variant bg-surface px-8 text-base font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary">
                View Full Exam Catalogue
                <MaterialIcon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Question formats */}
        <section className="overflow-hidden border-b border-outline-variant bg-surface py-16">
          <div className="mx-auto mb-stack-md flex max-w-container-max items-end justify-between px-margin-mobile md:px-margin-desktop">
            <div>
              <h3 className="text-2xl font-semibold text-on-background">Versatile Question Formats</h3>
              <p className="mt-1 text-sm text-on-surface-variant">Select the right tool for the exact measurement you need.</p>
            </div>
            <div className="hidden gap-2 md:flex">
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                <MaterialIcon name="chevron_left" className="text-[16px]" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                <MaterialIcon name="chevron_right" className="text-[16px]" />
              </button>
            </div>
          </div>
          <div className="hide-scrollbar flex gap-stack-md overflow-x-auto px-margin-mobile pb-stack-lg md:px-margin-desktop">
            {['Multiple Choice', 'Multiple Answer', 'Short Answer', 'Matching', 'Integer Type', 'True / False'].map((title) => (
              <div key={title} className="w-[280px] flex-none snap-start rounded-lg border border-outline-variant bg-surface-container-lowest p-stack-md shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <MaterialIcon
                    name={
                      title === 'Matching' ? 'drag_indicator'
                        : title === 'Short Answer' ? 'edit_note'
                        : title === 'Multiple Answer' ? 'check_box'
                        : title === 'Integer Type' ? 'pin'
                        : title === 'True / False' ? 'toggle_on'
                        : 'radio_button_checked'
                    }
                    className="text-[20px] text-primary"
                  />
                  <span className="rounded-full bg-surface-container px-2 py-1 text-xs font-bold uppercase text-on-surface-variant">{title}</span>
                </div>
                <div className="space-y-2">
                  <div className="mb-3 h-4 w-full rounded bg-surface-variant" />
                  <div className="h-3 w-2/3 rounded bg-surface-container-high" />
                  <div className="h-3 w-3/4 rounded bg-primary-container/10" />
                  <div className="h-3 w-1/2 rounded bg-surface-container-high" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-highest px-margin-mobile py-12 md:px-margin-desktop">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-stack-lg md:flex-row">
          <div className="flex items-center gap-2">
            <MaterialIcon name="quiz" className="text-[24px] text-on-surface-variant" />
            <span className="text-xl font-bold text-on-surface-variant">QuizForge</span>
          </div>
          <div className="flex gap-gutter text-sm text-on-surface-variant">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
            <span>Contact</span>
          </div>
          <div className="text-xs text-on-surface-variant">&copy; 2026 QuizForge. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
