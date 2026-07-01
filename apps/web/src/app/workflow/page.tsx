'use client'

import { useState } from 'react'
import './workflow.css'
import { getPromptDetails, type PromptDetails } from '../../data/workflowPrompts'

type Tab = 'overview' | 'taker' | 'creator' | 'exams' | 'admin'

interface DrawerState {
  category: string
  title: string
  html: string
}

export default function WorkflowPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawer, setDrawer] = useState<DrawerState | null>(null)
  const [activePrompt, setActivePrompt] = useState('')
  const [toast, setToast] = useState(false)

  function sendPrompt(promptText: string) {
    setActivePrompt(promptText)
    const d: PromptDetails = getPromptDetails(promptText)
    let html = d.content
    if (d.techRef) {
      html += `<div class="tech-card" style="margin-top:16px"><h6>Monorepo Schema &amp; File Details:</h6><ul>
        <li><strong>File Reference:</strong> <a href="${d.techLink}">${d.techRef}</a></li>
        <li><strong>Database Schema:</strong> <code>${d.dbModel}</code></li>
      </ul></div>`
    }
    setDrawer({ category: d.category, title: d.title, html })
    setDrawerOpen(true)
  }

  function closeDrawer() { setDrawerOpen(false) }

  function triggerCopy() {
    if (!activePrompt) return
    navigator.clipboard.writeText(activePrompt).then(() => {
      setToast(true)
      setTimeout(() => setToast(false), 2500)
    }).catch(console.error)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Platform overview' },
    { id: 'taker',    label: 'Taker journey' },
    { id: 'creator',  label: 'Creator journey' },
    { id: 'exams',    label: 'Exam catalogue' },
    { id: 'admin',    label: 'Admin' },
  ]

  const p = (s: string) => () => sendPrompt(s)

  return (
    <div className="workflow-page">
      <div className="wf-root">

        {/* ── Header ─────────────────────────────── */}
        <header className="header-bar">
          <div className="brand-title">
            <i className="ti ti-layout-grid-add" aria-hidden="true" />
            <span>QuizForge Workflow Map</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            Interactive App Flow &amp; Curation
          </span>
        </header>

        {/* ── Tab bar ────────────────────────────── */}
        <div className="flow-tabs" role="tablist">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab${activeTab === t.id ? ' active' : ''}`}
              role="tab"
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ OVERVIEW PANEL ══════════════ */}
        <div className={`panel${activeTab === 'overview' ? ' active' : ''}`}>
          <div className="section-label">Platform architecture — who does what</div>
          <div className="row center" style={{ gap: '20px' }}>
            <div className="node accent brand" onClick={p('Explain the Creator role in detail')}>
              <i className="ti ti-pencil" aria-hidden="true" style={{ fontSize: '18px', color: 'var(--text-accent)' }} />
              <div className="nt" style={{ marginTop: '4px' }}>Creator</div>
              <div className="ns">Teacher / Examiner</div>
            </div>
            <div className="node accent brand" onClick={p('Explain the Test Taker role in detail')}>
              <i className="ti ti-user-check" aria-hidden="true" style={{ fontSize: '18px', color: 'var(--text-accent)' }} />
              <div className="nt" style={{ marginTop: '4px' }}>Test taker</div>
              <div className="ns">Student / Candidate</div>
            </div>
            <div className="node pro" onClick={p('Explain the Admin role in detail')}>
              <i className="ti ti-shield-check" aria-hidden="true" style={{ fontSize: '18px', color: 'var(--text-pro)' }} />
              <div className="nt" style={{ marginTop: '4px' }}>Admin</div>
              <div className="ns">Platform manager</div>
            </div>
          </div>

          <div className="connector" />
          <div className="section-label">Test categories on the platform</div>
          <div className="cat-grid">
            <div className="cat-card accent" onClick={p('Show all engineering entrance exams available on the platform')}>
              <div className="cc-icon"><i className="ti ti-tool" aria-hidden="true" /></div>
              <div className="cc-title">Engineering entrance</div>
              <div className="cc-sub">JEE Main · JEE Advanced · BITSAT · VITEEE</div>
            </div>
            <div className="cat-card success" onClick={p('Show all medical entrance exams available on the platform')}>
              <div className="cc-icon"><i className="ti ti-stethoscope" aria-hidden="true" /></div>
              <div className="cc-title">Medical entrance</div>
              <div className="cc-sub">NEET UG · AIIMS · JIPMER</div>
            </div>
            <div className="cat-card warn" onClick={p('Show all government and civil service exams on the platform')}>
              <div className="cc-icon"><i className="ti ti-building-bank" aria-hidden="true" /></div>
              <div className="cc-title">Government / Civil services</div>
              <div className="cc-sub">UPSC · SSC · IBPS · RRB</div>
            </div>
            <div className="cat-card pro" onClick={p('Show all management and MBA entrance exams on the platform')}>
              <div className="cc-icon"><i className="ti ti-chart-bar" aria-hidden="true" /></div>
              <div className="cc-title">Management entrance</div>
              <div className="cc-sub">CAT · MAT · SNAP · XAT · NMAT</div>
            </div>
            <div className="cat-card danger" onClick={p('Show all law and other professional entrance exams on the platform')}>
              <div className="cc-icon"><i className="ti ti-gavel" aria-hidden="true" /></div>
              <div className="cc-title">Law / Other professional</div>
              <div className="cc-sub">CLAT · AILET · NDA · CDS</div>
            </div>
            <div className="cat-card" onClick={p('Show all school board and Olympiad exams on the platform')}>
              <div className="cc-icon"><i className="ti ti-school" aria-hidden="true" /></div>
              <div className="cc-title">School &amp; Olympiads</div>
              <div className="cc-sub">CBSE · ICSE · State boards · NSO · IMO</div>
            </div>
          </div>

          <div className="connector" />
          <div className="section-label">Core product surfaces</div>
          <div className="row" style={{ gap: '8px' }}>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Home and Discovery screen in detail')}>
              <i className="ti ti-home" aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
              <div className="nt">Home &amp; discovery</div>
              <div className="ns">Browse, search, trending</div>
            </div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Test builder in detail')}>
              <i className="ti ti-layout-2" aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
              <div className="nt">Test builder</div>
              <div className="ns">Create + configure tests</div>
            </div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Mock test interface in detail')}>
              <i className="ti ti-pencil-check" aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
              <div className="nt">Mock test interface</div>
              <div className="ns">Full exam simulation</div>
            </div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Result and analytics screen in detail')}>
              <i className="ti ti-chart-dots" aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
              <div className="nt">Results &amp; analytics</div>
              <div className="ns">Scores, insights, rank</div>
            </div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Admin panel in detail')}>
              <i className="ti ti-settings" aria-hidden="true" style={{ color: 'var(--text-muted)' }} />
              <div className="nt">Admin panel</div>
              <div className="ns">Users, tests, config</div>
            </div>
          </div>
        </div>

        {/* ══════════════ TAKER PANEL ══════════════ */}
        <div className={`panel${activeTab === 'taker' ? ' active' : ''}`}>
          <div className="section-label">Entry points</div>
          <div className="row center" style={{ gap: '8px' }}>
            <div className="node accent" onClick={p('How does the direct URL or QR code entry work?')}><div className="nt">Direct URL / QR</div><div className="ns">Shared by creator</div></div>
            <div className="node accent" onClick={p('How does the access code entry work?')}><div className="nt">Access code</div><div className="ns">6-char code</div></div>
            <div className="node accent" onClick={p('How does discovery via exam catalogue work?')}><div className="nt">Exam catalogue</div><div className="ns">Browse &amp; enrol</div></div>
            <div className="node accent" onClick={p('How does email invitation entry work?')}><div className="nt">Email invite</div><div className="ns">Institutional invite</div></div>
          </div>

          <div className="section-label" style={{ marginTop: '20px' }}>Authentication gate</div>
          <div className="diamond-row">
            <div className="branch">
              <div className="node success" style={{ minWidth: '90px' }} onClick={p('What happens when a registered user logs in?')}><div className="nt">Registered user</div><div className="ns">Email / Google login</div></div>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>or</span>
            <div className="branch">
              <div className="node warn" style={{ minWidth: '90px' }} onClick={p('How does guest mode work for test takers?')}><div className="nt">Guest mode</div><div className="ns">Name + email only</div></div>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>or</span>
            <div className="branch">
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does SSO login work for institution students?')}><div className="nt">SSO / Institution</div><div className="ns">Organisation login</div></div>
            </div>
          </div>

          <div className="section-label" style={{ marginTop: '20px' }}>Pre-test gate screen</div>
          <div className="lane">
            <div className="lane-title">Gate screen — what the taker sees</div>
            <div className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
              <div className="node" style={{ minWidth: '100px' }} onClick={p('What information is shown in the test overview card?')}><div className="nt">Test overview card</div><div className="ns">Name, creator, sections</div></div>
              <div className="node" style={{ minWidth: '100px' }} onClick={p('What timing info is shown on the gate screen?')}><div className="nt">Timing info</div><div className="ns">Duration, window</div></div>
              <div className="node" style={{ minWidth: '100px' }} onClick={p('What marking scheme info is shown on the gate screen?')}><div className="nt">Marking scheme</div><div className="ns">Marks, cut-off</div></div>
              <div className="node" style={{ minWidth: '100px' }} onClick={p('What instructions are shown on the gate screen?')}><div className="nt">Instructions</div><div className="ns">Rules, guidelines</div></div>
              <div className="node success" style={{ minWidth: '100px' }} onClick={p('What does the Start Test button do?')}><div className="nt">Start test CTA</div><div className="ns">Launches interface</div></div>
            </div>
          </div>

          <div className="section-label" style={{ marginTop: '4px' }}>Test-taking interface</div>
          <div className="screen-mock">
            <div className="screen-topbar">
              <div className="dot" /><div className="dot" /><div className="dot" />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '6px' }}>Mock test interface</span>
            </div>
            <div className="screen-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>QUESTION AREA</div>
                  <div className="row" style={{ gap: '6px', marginBottom: '8px' }}>
                    <div className="node" style={{ padding: '6px 10px', minWidth: 0 }} onClick={p('How does section navigation work mid-test?')}><div className="nt" style={{ fontSize: '10px' }}>Section 2 of 3</div></div>
                    <div className="node warn" style={{ padding: '6px 10px', minWidth: 0 }}><div className="nt" style={{ fontSize: '10px' }}>⏱ 28:45</div></div>
                    <div className="node danger" style={{ padding: '6px 10px', minWidth: 0 }} onClick={p('How does the submit button work during a test?')}><div className="nt" style={{ fontSize: '10px' }}>Submit</div></div>
                  </div>
                  <div style={{ border: '0.5px solid var(--border)', borderRadius: '6px', padding: '8px', background: 'var(--surface-2)', fontSize: '10px', color: 'var(--text-secondary)', minHeight: '70px', marginBottom: '6px' }}>
                    Q5 of 20 &nbsp;<span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>[MCQ Single]</span><br />
                    <br />
                    <strong style={{ color: 'var(--text-primary)', fontSize: '10px' }}>Which of the following is the correct formula for kinetic energy?</strong>
                  </div>
                  <div className="row" style={{ gap: '4px' }}>
                    <div className="node" style={{ padding: '5px 8px', minWidth: 0, flex: 1 }} onClick={p('How do MCQ options work in the test interface?')}><div className="ns">A. mv</div></div>
                    <div className="node accent" style={{ padding: '5px 8px', minWidth: 0, flex: 1 }}><div className="ns" style={{ color: 'var(--text-accent)' }}>B. ½mv² ✓</div></div>
                    <div className="node" style={{ padding: '5px 8px', minWidth: 0, flex: 1 }}><div className="ns">C. mv²</div></div>
                    <div className="node" style={{ padding: '5px 8px', minWidth: 0, flex: 1 }}><div className="ns">D. 2mv</div></div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>NAVIGATOR</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '3px', marginBottom: '8px' }}>
                    {[1,2,3].map(n => (
                      <div key={n} style={{ background: 'var(--fill-accent)', color: 'white', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px' }}>{n}</div>
                    ))}
                    <div style={{ background: 'var(--bg-warning)', border: '0.5px solid var(--border-warning)', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'var(--text-warning)' }}>4</div>
                    <div style={{ background: 'var(--fill-accent)', border: '2px solid #1d4ed8', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white' }}>5</div>
                    {[6,7].map(n => (
                      <div key={n} style={{ background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '4px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>{n}</div>
                    ))}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--fill-accent)', borderRadius: '1px', marginRight: '3px' }} />Answered<br />
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--bg-warning)', border: '0.5px solid var(--border-warning)', borderRadius: '1px', marginRight: '3px' }} />Flagged<br />
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', background: 'var(--surface-2)', border: '0.5px solid var(--border)', borderRadius: '1px', marginRight: '3px' }} />Not visited
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-label">Question types the taker encounters</div>
          <div className="pill-list">
            <span className="pill accent" onClick={p('How does MCQ single render for the taker?')}>MCQ single</span>
            <span className="pill accent" onClick={p('How does MCQ multiple render for the taker?')}>MCQ multiple</span>
            <span className="pill success" onClick={p('How does True / False render for the taker?')}>True / False</span>
            <span className="pill success" onClick={p('How does Fill in the Blank render for the taker?')}>Fill in blank</span>
            <span className="pill warn" onClick={p('How does Matching render for the taker?')}>Matching</span>
            <span className="pill warn" onClick={p('How does Ordering / Sequence render for the taker?')}>Ordering</span>
            <span className="pill pro" onClick={p('How does Numerical input render for the taker?')}>Numerical</span>
            <span className="pill pro" onClick={p('How does Short Answer render for the taker?')}>Short answer</span>
            <span className="pill danger" onClick={p('How does Long Answer / Essay render for the taker?')}>Essay</span>
            <span className="pill danger" onClick={p('How does File Upload render for the taker?')}>File upload</span>
          </div>

          <div className="section-label" style={{ marginTop: '20px' }}>Post-submission flow</div>
          <div className="row center" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <div className="node" onClick={p('What is the auto-submit flow on timer expiry?')}><div className="nt">Timer expires</div><div className="ns">Auto-submit triggered</div></div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>or</span>
            <div className="node" onClick={p('What happens when a taker clicks Submit manually?')}><div className="nt">Manual submit</div><div className="ns">Confirmation modal</div></div>
          </div>
          <div style={{ height: '10px' }} />
          <div className="row center" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <div className="node success" onClick={p('Describe the instant results screen in detail')}><div className="nt">Instant results screen</div><div className="ns">Score, %, pass/fail, sections</div></div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>or</span>
            <div className="node warn" onClick={p('What does the taker see when results are pending?')}><div className="nt">Results pending</div><div className="ns">Awaiting creator release</div></div>
          </div>
          <div style={{ height: '10px' }} />
          <div className="row center" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <div className="node" onClick={p('Describe the answer sheet review screen')}><div className="nt">Answer sheet review</div><div className="ns">If creator enabled</div></div>
            <div className="node" onClick={p('Describe the performance analysis screen for the taker')}><div className="nt">Performance analysis</div><div className="ns">Section-wise, topic-wise</div></div>
            <div className="node" onClick={p('How does the All India Rank feature work?')}><div className="nt">All India Rank</div><div className="ns">vs other takers</div></div>
            <div className="node" onClick={p('How does the retake test feature work?')}><div className="nt">Retake</div><div className="ns">If multiple attempts</div></div>
          </div>
        </div>

        {/* ══════════════ CREATOR PANEL ══════════════ */}
        <div className={`panel${activeTab === 'creator' ? ' active' : ''}`}>
          <div className="section-label">Creator onboarding</div>
          <div className="steps" role="list">
            <div className="step done" role="listitem"><div className="step-circle"><i className="ti ti-check" style={{ fontSize: '11px' }} aria-hidden="true" /></div><div className="step-label">Register &amp; verify email</div></div>
            <div className="step-line" />
            <div className="step done" role="listitem"><div className="step-circle"><i className="ti ti-check" style={{ fontSize: '11px' }} aria-hidden="true" /></div><div className="step-label">Set up profile &amp; institution</div></div>
            <div className="step-line" />
            <div className="step active" role="listitem"><div className="step-circle">3</div><div className="step-label">Creator dashboard</div></div>
            <div className="step-line" />
            <div className="step pending" role="listitem"><div className="step-circle">4</div><div className="step-label">Create first test</div></div>
            <div className="step-line" />
            <div className="step pending" role="listitem"><div className="step-circle">5</div><div className="step-label">Publish &amp; share</div></div>
            <div className="step-line" />
            <div className="step pending" role="listitem"><div className="step-circle">6</div><div className="step-label">Review results</div></div>
          </div>

          <div className="section-label" style={{ marginTop: '20px' }}>Creator dashboard</div>
          <div className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the My Tests section on the creator dashboard')}><div className="nt">My tests</div><div className="ns">Draft · Published · Closed</div></div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Question Bank on the creator dashboard')}><div className="nt">Question bank</div><div className="ns">Saved reusable Qs</div></div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Results and analytics section on the creator dashboard')}><div className="nt">Results &amp; analytics</div><div className="ns">All attempts overview</div></div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the Grading queue on the creator dashboard')}><div className="nt">Grading queue</div><div className="ns">Pending manual reviews</div></div>
          </div>

          <div className="section-label" style={{ marginTop: '8px' }}>Test builder — step by step</div>

          <div className="lane">
            <div className="lane-title">Step 1 — Test configuration</div>
            <div className="row" style={{ gap: '6px', flexWrap: 'wrap' }}>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('What fields are in the test configuration step?')}><div className="nt">Title + description</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does the timing setup work in the test builder?')}><div className="nt">Timing mode</div><div className="ns">Global or per-section</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does the test window configuration work?')}><div className="nt">Test window</div><div className="ns">Start / end datetime</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does pass/fail and scoring configuration work?')}><div className="nt">Scoring &amp; cut-off</div><div className="ns">Pass %, neg marking</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('What behaviour toggles are available in test configuration?')}><div className="nt">Behaviour toggles</div><div className="ns">Shuffle, backtrack…</div></div>
            </div>
          </div>

          <div className="lane">
            <div className="lane-title">Step 2 — Section builder</div>
            <div className="row" style={{ gap: '6px', flexWrap: 'wrap' }}>
              <div className="node accent" style={{ minWidth: '90px' }} onClick={p('How do you add a new section in the test builder?')}><div className="nt">+ Add section</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does section drag-to-reorder work?')}><div className="nt">Drag to reorder</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does per-section timing work?')}><div className="nt">Section timer</div><div className="ns">If per-section mode</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('What is the question pool feature in sections?')}><div className="nt">Question pool</div><div className="ns">Show N of M randomly</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does section instructions setup work?')}><div className="nt">Section instructions</div></div>
            </div>
          </div>

          <div className="lane">
            <div className="lane-title">Step 3 — Question editor (10 types)</div>
            <div className="pill-list">
              <span className="pill accent" onClick={p('How does the MCQ Single question editor work?')}>MCQ single</span>
              <span className="pill accent" onClick={p('How does the MCQ Multiple question editor work?')}>MCQ multiple</span>
              <span className="pill success" onClick={p('How does the True / False question editor work?')}>True / False</span>
              <span className="pill success" onClick={p('How does the Fill in the Blank question editor work?')}>Fill in blank</span>
              <span className="pill warn" onClick={p('How does the Matching question editor work?')}>Matching</span>
              <span className="pill warn" onClick={p('How does the Ordering question editor work?')}>Ordering</span>
              <span className="pill pro" onClick={p('How does the Numerical question editor work?')}>Numerical</span>
              <span className="pill pro" onClick={p('How does the Short Answer question editor work?')}>Short answer</span>
              <span className="pill danger" onClick={p('How does the Long Answer / Essay question editor work?')}>Essay</span>
              <span className="pill danger" onClick={p('How does the File Upload question editor work?')}>File upload</span>
            </div>
            <div className="info-box" style={{ marginTop: '10px' }}>
              Each question has: <strong>body (rich text + image)</strong> · <strong>marks</strong> · <strong>negative marks</strong> · <strong>difficulty tag</strong> · <strong>topic tag</strong> · optional <strong>save to bank</strong>
            </div>
          </div>

          <div className="lane">
            <div className="lane-title">Step 4 — Publish &amp; distribute</div>
            <div className="row" style={{ gap: '6px', flexWrap: 'wrap' }}>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('What does the pre-publish checklist validate?')}><div className="nt">Pre-publish checklist</div></div>
              <div className="node success" style={{ minWidth: '90px' }} onClick={p('How does publishing a test work?')}><div className="nt">Confirm &amp; publish</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does the access code sharing work?')}><div className="nt">Share via code</div><div className="ns">6-char code</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does direct link sharing work?')}><div className="nt">Share via link</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does email invite distribution work?')}><div className="nt">Email invites</div><div className="ns">Bulk or individual</div></div>
              <div className="node" style={{ minWidth: '90px' }} onClick={p('How does listing a test on the exam catalogue work?')}><div className="nt">List on catalogue</div><div className="ns">Public / institution</div></div>
            </div>
          </div>

          <div className="section-label">Results &amp; grading flow</div>
          <div className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the results dashboard for creators')}><div className="nt">Results dashboard</div><div className="ns">Avg score, pass rate</div></div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the attempt detail view for creators')}><div className="nt">Per-taker view</div><div className="ns">Full answer sheet</div></div>
            <div className="node warn" style={{ flex: 1 }} onClick={p('Describe the manual grading interface for subjective answers')}><div className="nt">Manual grading</div><div className="ns">Essay, short answer, upload</div></div>
            <div className="node" style={{ flex: 1 }} onClick={p('Describe the analytics features for creators')}><div className="nt">Analytics</div><div className="ns">Q-wise accuracy, time</div></div>
            <div className="node success" style={{ flex: 1 }} onClick={p('How does CSV export of results work?')}><div className="nt">Export CSV</div></div>
          </div>
        </div>

        {/* ══════════════ EXAMS PANEL ══════════════ */}
        <div className={`panel${activeTab === 'exams' ? ' active' : ''}`}>

          <div className="section-label">Engineering entrance exams <span className="badge accent">JEE, BITSAT, VITEEE…</span></div>
          <div className="cat-grid">
            {[
              { name: 'JEE Main',     sub: 'Physics · Chemistry · Maths\n3 hrs · 90 Qs · 300 marks' },
              { name: 'JEE Advanced', sub: 'Paper 1 + Paper 2\n3 hrs each · Multi-type Qs' },
              { name: 'BITSAT',       sub: 'PCM + English + Logic\n3 hrs · 150 Qs' },
              { name: 'VITEEE',       sub: 'PCM/PCB + Aptitude + English\n2.5 hrs · 125 Qs' },
            ].map(e => (
              <div key={e.name} className="cat-card accent" onClick={p(`Show the ${e.name} mock test structure and sections`)}>
                <div className="cc-title">{e.name}</div>
                <div className="cc-sub">{e.sub.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="section-label">Medical entrance exams <span className="badge success">NEET, AIIMS…</span></div>
          <div className="cat-grid">
            {[
              { name: 'NEET UG',    sub: 'Physics · Chemistry · Biology\n3 hrs 20 min · 200 Qs · 720 marks' },
              { name: 'AIIMS MBBS', sub: 'PCB + GK + Aptitude\n3.5 hrs · 200 Qs' },
              { name: 'JIPMER',     sub: 'PCB + English + Logic\n2.5 hrs · 200 Qs' },
            ].map(e => (
              <div key={e.name} className="cat-card success" onClick={p(`Show the ${e.name} mock test structure`)}>
                <div className="cc-title">{e.name}</div>
                <div className="cc-sub">{e.sub.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="section-label">Government &amp; civil services <span className="badge warn">UPSC, SSC, IBPS, RRB…</span></div>
          <div className="cat-grid">
            {[
              { name: 'UPSC CSE Prelims', sub: 'GS Paper 1 + CSAT\n2 hrs each · 100 Qs each' },
              { name: 'SSC CGL',          sub: 'Tier 1: Reasoning, GK, Quant, English\n60 min · 100 Qs' },
              { name: 'IBPS PO',          sub: 'Reasoning · English · Quant\n1 hr · 100 Qs' },
              { name: 'RRB NTPC',         sub: 'Maths · Reasoning · GK\n90 min · 100 Qs' },
              { name: 'SBI PO',           sub: 'Reasoning · English · DI\n60 min · 100 Qs' },
              { name: 'IBPS Clerk',       sub: 'Reasoning · English · Numerical\n60 min · 100 Qs' },
            ].map(e => (
              <div key={e.name} className="cat-card warn" onClick={p(`Show the ${e.name} mock test structure`)}>
                <div className="cc-title">{e.name}</div>
                <div className="cc-sub">{e.sub.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="section-label">Management entrance <span className="badge pro">CAT, MAT, XAT, SNAP…</span></div>
          <div className="cat-grid">
            {[
              { name: 'CAT',  sub: 'VARC · DILR · QA\n2 hrs · 66 Qs' },
              { name: 'XAT',  sub: 'Decision Making · VALR · QA + GK\n3 hrs · 101 Qs' },
              { name: 'SNAP', sub: 'English · Analytical · QA\n60 min · 60 Qs' },
              { name: 'NMAT', sub: 'Language · QS · Logical\n2 hrs · 108 Qs' },
              { name: 'MAT',  sub: 'Language · Maths · DI · Reasoning · GK\n150 min · 200 Qs' },
            ].map(e => (
              <div key={e.name} className="cat-card pro" onClick={p(`Show the ${e.name} mock test structure`)}>
                <div className="cc-title">{e.name}</div>
                <div className="cc-sub">{e.sub.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="section-label">Law &amp; defence <span className="badge danger">CLAT, NDA, CDS, AILET…</span></div>
          <div className="cat-grid">
            {[
              { name: 'CLAT',  sub: 'English · CR · Maths · GK · Legal\n2 hrs · 150 Qs' },
              { name: 'NDA',   sub: 'Mathematics + General Ability\n2.5 hrs each · 120 / 150 Qs' },
              { name: 'CDS',   sub: 'English · GK · Maths\n2 hrs each · 100 Qs' },
              { name: 'AILET', sub: 'English · GK · Reasoning · Legal\n90 min · 150 Qs' },
            ].map(e => (
              <div key={e.name} className="cat-card danger" onClick={p(`Show the ${e.name} mock test structure`)}>
                <div className="cc-title">{e.name}</div>
                <div className="cc-sub">{e.sub.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</div>
              </div>
            ))}
          </div>

          <div className="section-label">School &amp; Olympiads</div>
          <div className="cat-grid">
            {[
              { name: 'CBSE board — Class 10 / 12', prompt: 'Show CBSE board mock test structure for Class 10 and 12', sub: 'All subjects · MCQ + subjective\n3 hrs per paper' },
              { name: 'ICSE / ISC',    prompt: 'Show ICSE board mock test structure',            sub: 'Class 10 & 12 · All subjects\n2-3 hrs per paper' },
              { name: 'State boards',  prompt: 'Show state board mock test structure',            sub: 'UP · Maharashtra · TN · Karnataka…\nAll subjects' },
              { name: 'NSO (Science Olympiad)', prompt: 'Show NSO and Science Olympiad mock test structure', sub: 'Class 1-12 · Science\n60 min · 35–50 Qs' },
              { name: 'IMO (Maths Olympiad)', prompt: 'Show IMO and Maths Olympiad mock test structure', sub: 'Class 1-12 · Mathematics\n60 min · 35–50 Qs' },
              { name: 'NTSE', prompt: 'Show NTSE mock test structure', sub: 'MAT + SAT\n2 hrs each · 100 Qs' },
              { name: 'KVPY', prompt: 'Show KVPY mock test structure', sub: 'SA / SX / SB streams\n3 hrs · Mixed Qs' },
            ].map(e => (
              <div key={e.name} className="cat-card" onClick={p(e.prompt ?? `Show ${e.name} mock test structure`)}>
                <div className="cc-title">{e.name}</div>
                <div className="cc-sub">{e.sub.split('\n').map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════ ADMIN PANEL ══════════════ */}
        <div className={`panel${activeTab === 'admin' ? ' active' : ''}`}>
          <div className="section-label">Admin panel — platform control</div>
          <div className="row" style={{ gap: '8px', flexWrap: 'wrap' }}>
            <div className="node pro" style={{ flex: 1 }} onClick={p('Describe the User Management section of the admin panel')}>
              <i className="ti ti-users" aria-hidden="true" style={{ fontSize: '16px', color: 'var(--text-pro)' }} />
              <div className="nt">User management</div>
              <div className="ns">Create, suspend, role assign</div>
            </div>
            <div className="node pro" style={{ flex: 1 }} onClick={p('Describe the Test Management section of the admin panel')}>
              <i className="ti ti-file-check" aria-hidden="true" style={{ fontSize: '16px', color: 'var(--text-pro)' }} />
              <div className="nt">Test management</div>
              <div className="ns">All tests, flag, archive</div>
            </div>
            <div className="node pro" style={{ flex: 1 }} onClick={p('Describe the Exam Catalogue management in the admin panel')}>
              <i className="ti ti-book" aria-hidden="true" style={{ fontSize: '16px', color: 'var(--text-pro)' }} />
              <div className="nt">Exam catalogue</div>
              <div className="ns">Curate public exams</div>
            </div>
            <div className="node pro" style={{ flex: 1 }} onClick={p('Describe the System Settings in the admin panel')}>
              <i className="ti ti-settings-2" aria-hidden="true" style={{ fontSize: '16px', color: 'var(--text-pro)' }} />
              <div className="nt">System settings</div>
              <div className="ns">Limits, maintenance, config</div>
            </div>
          </div>

          <div className="section-label" style={{ marginTop: '4px' }}>Platform-level settings</div>
          <div className="cat-grid">
            <div className="cat-card" onClick={p('What does max questions per test setting control?')}><div className="cc-title">Max questions / test</div><div className="cc-sub">Global cap enforced on creation</div></div>
            <div className="cat-card" onClick={p('What does max duration setting control?')}><div className="cc-title">Max test duration</div><div className="cc-sub">Cap in minutes per test</div></div>
            <div className="cat-card" onClick={p('What file types are configurable in admin settings?')}><div className="cc-title">Allowed file types</div><div className="cc-sub">PDF, images for uploads</div></div>
            <div className="cat-card" onClick={p('How does maintenance mode work in the admin panel?')}><div className="cc-title">Maintenance mode</div><div className="cc-sub">Take platform offline safely</div></div>
            <div className="cat-card" onClick={p('How does institution / org management work in admin?')}><div className="cc-title">Institution management</div><div className="cc-sub">Create org accounts, SSO</div></div>
            <div className="cat-card" onClick={p('How does the platform-wide analytics dashboard work in admin?')}><div className="cc-title">Platform analytics</div><div className="cc-sub">MAU, tests/day, top exams</div></div>
          </div>

          <div className="section-label">Catalogue curation workflow</div>
          <div className="steps" role="list">
            <div className="step done" role="listitem"><div className="step-circle"><i className="ti ti-check" style={{ fontSize: '11px' }} aria-hidden="true" /></div><div className="step-label">Creator submits for listing</div></div>
            <div className="step-line" />
            <div className="step active" role="listitem"><div className="step-circle">2</div><div className="step-label">Admin reviews quality</div></div>
            <div className="step-line" />
            <div className="step pending" role="listitem"><div className="step-circle">3</div><div className="step-label">Admin approves / rejects</div></div>
            <div className="step-line" />
            <div className="step pending" role="listitem"><div className="step-circle">4</div><div className="step-label">Listed in exam catalogue</div></div>
            <div className="step-line" />
            <div className="step pending" role="listitem"><div className="step-circle">5</div><div className="step-label">Takers can discover &amp; enrol</div></div>
          </div>

          <div className="info-box" style={{ marginTop: '16px' }}>
            <strong>Institution / School accounts:</strong> Admins can create org-level accounts that grant batch creator access to all teachers in a school, coaching centre, or organisation. Students join via org invite code or SSO. Results roll up to institution-level dashboards for principals and administrators.
          </div>
        </div>

      </div>{/* /wf-root */}

      {/* ── Drawer overlay ─────────────────────── */}
      <div
        className={`drawer-overlay${drawerOpen ? ' active' : ''}`}
        onClick={closeDrawer}
      />

      {/* ── Sliding drawer ─────────────────────── */}
      <div className={`drawer${drawerOpen ? ' active' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title-area">
            <span className="drawer-category">{drawer?.category}</span>
            <h3 className="drawer-title">{drawer?.title}</h3>
          </div>
          <button className="drawer-close" onClick={closeDrawer} aria-label="Close details">
            <i className="ti ti-x" />
          </button>
        </div>
        <div
          className="drawer-content"
          dangerouslySetInnerHTML={{ __html: drawer?.html ?? '' }}
        />
        <div className="drawer-footer">
          <button className="btn btn-primary" onClick={triggerCopy}>
            <i className="ti ti-copy" />
            Copy Prompt Text
          </button>
        </div>
      </div>

      {/* ── Toast ──────────────────────────────── */}
      <div className={`toast${toast ? ' active' : ''}`}>
        <i className="ti ti-check" />
        <span>Prompt copied to clipboard!</span>
      </div>
    </div>
  )
}
