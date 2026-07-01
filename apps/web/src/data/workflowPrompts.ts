export interface PromptDetails {
  category: string
  title: string
  techRef: string
  techLink: string
  dbModel: string
  content: string
}

const BASE = 'file:///c:/Users/14nir/Testing%20platform/quizforge/'

function ref(path: string) {
  return `${BASE}${path}`
}

export const workflowPrompts: Record<string, PromptDetails> = {
  'Explain the Creator role in detail': {
    category: 'User Roles', title: 'Creator (Examiner/Teacher)',
    techRef: 'apps/api/src/services/auth.service.ts', techLink: ref('apps/api/src/services/auth.service.ts'),
    dbModel: 'User (role: CREATOR), Test, Section, Question',
    content: `<p>Creators are the orchestrators of exams, quizzes, and sections on the QuizForge platform.</p>
<div class="tech-card"><h6>Code References:</h6><ul>
<li><strong>Auth Handler:</strong> <code>AuthService.register</code> generates creator accounts.</li>
<li><strong>Prisma Schema:</strong> <code>model User</code> with relation <code>createdTests</code>.</li>
</ul></div>
<h5>Key Features:</h5><ul>
<li>Test construction with granular parameters (timers, backtrack controls, pool sizing).</li>
<li>Question repository bank creation and lookup.</li>
<li>Manual evaluation dashboard for essay submissions and uploads.</li>
</ul>`,
  },
  'Explain the Test Taker role in detail': {
    category: 'User Roles', title: 'Test Taker (Candidate)',
    techRef: 'apps/api/src/services/attempt.service.ts', techLink: ref('apps/api/src/services/attempt.service.ts'),
    dbModel: 'User (role: TAKER), Attempt, Answer',
    content: `<p>Candidates taking tests under structured time limits and security constraints (such as fullscreen protection).</p>
<div class="tech-card"><h6>Code References:</h6><ul>
<li><strong>Attempt Controller:</strong> <code>AttemptService.startAttempt</code> initializes taker sessions.</li>
<li><strong>Prisma Schema:</strong> <code>model Attempt</code> handles score logging, timers, and submission logs.</li>
</ul></div>
<h5>Key Features:</h5><ul>
<li>Secure exam workspace interface with auto-save to Redis.</li>
<li>Grid-based question navigator showing answered, pending, and flagged questions.</li>
<li>Real-time score calculation and detailed section-wise review sheets.</li>
</ul>`,
  },
  'Explain the Admin role in detail': {
    category: 'User Roles', title: 'Admin (Platform Manager)',
    techRef: 'apps/api/src/services/admin.service.ts', techLink: ref('apps/api/src/services/admin.service.ts'),
    dbModel: 'User (role: ADMIN), global config database settings',
    content: `<p>Admins manage system parameters, review public exam catalog listings, and handle billing and institutional orgs.</p>
<div class="tech-card"><h6>Code References:</h6><ul>
<li><strong>Admin Service:</strong> <a href="${ref('apps/api/src/services/admin.service.ts')}">admin.service.ts</a></li>
<li><strong>Telemetry:</strong> Tracks platform metrics like active takers, tests completed, and server loads.</li>
</ul></div>
<h5>Key Features:</h5><ul>
<li>Tenant &amp; organization provisioning for SSO integrations.</li>
<li>System toggle switches for Maintenance Mode and global constraints.</li>
<li>Listing curation queue for public mock exams.</li>
</ul>`,
  },
  'Describe the Home and Discovery screen in detail': {
    category: 'Core Surfaces', title: 'Home & Discovery Dashboard',
    techRef: 'apps/web/src/screens/DashboardPage.tsx', techLink: ref('apps/web/src/screens/DashboardPage.tsx'),
    dbModel: 'Test, Attempt, User',
    content: `<p>The main landing interface for authenticated students and creators. Displays registered courses, public exam shortcuts, search filters, and active timer reminders.</p>
<div class="tech-card"><h6>Key References:</h6><ul>
<li><strong>Frontend view:</strong> <a href="${ref('apps/web/src/screens/DashboardPage.tsx')}">DashboardPage.tsx</a></li>
<li><strong>Join endpoint:</strong> Handles validation of access code strings.</li>
</ul></div>
<h5>Highlights:</h5><ul>
<li>Responsive test catalog browser with real-time text query filters.</li>
<li>"Resume Attempt" cards containing direct hooks to in-progress Redis sessions.</li>
<li>Alphanumeric access code input element triggering test invitation gates.</li>
</ul>`,
  },
  'Describe the Test builder in detail': {
    category: 'Core Surfaces', title: 'Dynamic Test Builder wizard',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test, Section, Question',
    content: `<p>A multi-step setup flow for instructors to write questions, sequence sections, and tweak scoring behaviors.</p>
<div class="tech-card"><h6>Key References:</h6><ul>
<li><strong>UI Component:</strong> <a href="${ref('apps/web/src/screens/TestBuilderPage.tsx')}">TestBuilderPage.tsx</a></li>
<li><strong>Backend Service:</strong> <code>test.service.ts</code> validates structure rules.</li>
</ul></div>
<h5>Builder Steps:</h5><ol>
<li><strong>Configuration:</strong> Global titles, availability dates, negative score factors.</li>
<li><strong>Sections:</strong> Subjects reordering, custom time limits, random pooling parameters.</li>
<li><strong>Editor:</strong> Fenced input forms for MCQ, essay, matching, ordering types.</li>
<li><strong>Distribution:</strong> Access checklist, QR codes, direct URL, invitation grids.</li>
</ol>`,
  },
  'Describe the Mock test interface in detail': {
    category: 'Core Surfaces', title: 'Locked Mock Test taker View',
    techRef: 'apps/web/src/screens/ExamPage.tsx', techLink: ref('apps/web/src/screens/ExamPage.tsx'),
    dbModel: 'Attempt, Answer',
    content: `<p>The proctored candidate interface designed for security, responsiveness, and offline resilience.</p>
<div class="tech-card"><h6>Key References:</h6><ul>
<li><strong>UI Screen:</strong> <a href="${ref('apps/web/src/screens/ExamPage.tsx')}">ExamPage.tsx</a></li>
<li><strong>Zustand Store:</strong> Syncs responses in client cache, posting to Redis periodically.</li>
</ul></div>
<h5>UI Components:</h5><ul>
<li><strong>Left Area:</strong> Interactive question card showing marks, description text, options.</li>
<li><strong>Right Sidebar:</strong> Grid tracking status (Answered, Flagged for Review, Not Visited).</li>
<li><strong>Toolbar:</strong> Subtitle indicators, timer countdown, manual submit gate.</li>
</ul>`,
  },
  'Describe the Result and analytics screen in detail': {
    category: 'Core Surfaces', title: 'Taker Performance Results',
    techRef: 'apps/web/src/screens/ResultsPage.tsx', techLink: ref('apps/web/src/screens/ResultsPage.tsx'),
    dbModel: 'Attempt, Answer',
    content: `<p>Visual feedback panels for takers showing scores, pass/fail metrics, and detailed correct answer keys.</p>
<div class="tech-card"><h6>Key References:</h6><ul>
<li><strong>Frontend UI:</strong> <a href="${ref('apps/web/src/screens/ResultsPage.tsx')}">ResultsPage.tsx</a></li>
<li><strong>Metrics Engine:</strong> <code>AttemptService.getAttemptResults</code> evaluates percentile.</li>
</ul></div>
<h5>Details Renders:</h5><ul>
<li><strong>Stats Cards:</strong> Score values, accuracy percentage, time spent, ranking position.</li>
<li><strong>Performance Charts:</strong> Average points by subject or question tags.</li>
<li><strong>Review Grid:</strong> Color-coded answers (Green = correct, Red = incorrect) with explanation notes.</li>
</ul>`,
  },
  'Describe the Admin panel in detail': {
    category: 'Core Surfaces', title: 'System Admin Control Panel',
    techRef: 'apps/web/src/screens/AdminDashboardPage.tsx', techLink: ref('apps/web/src/screens/AdminDashboardPage.tsx'),
    dbModel: 'Global settings models',
    content: `<p>Central management dashboard for super-users to configure tenant organizations, view usage telemetry, and audit tests.</p>
<div class="tech-card"><h6>Key References:</h6><ul>
<li><strong>Admin Frontend:</strong> <a href="${ref('apps/web/src/screens/AdminDashboardPage.tsx')}">AdminDashboardPage.tsx</a></li>
<li><strong>Admin Service:</strong> <a href="${ref('apps/api/src/services/admin.service.ts')}">admin.service.ts</a></li>
</ul></div>
<h5>Management Utilities:</h5><ul>
<li><strong>Users Grid:</strong> Role adjustment (promotions to CREATOR or ADMIN) and access bans.</li>
<li><strong>Tests Queue:</strong> System-wide listings flagging tool.</li>
<li><strong>System Stats:</strong> Charts tracking MAU counts and API endpoints speed.</li>
</ul>`,
  },
  'How does the direct URL or QR code entry work?': {
    category: 'Taker Entry', title: 'Quick Link & QR Entry',
    techRef: 'apps/web/src/screens/TestGatePage.tsx', techLink: ref('apps/web/src/screens/TestGatePage.tsx'),
    dbModel: 'Test.accessLink',
    content: `<p>Direct entry bypassing the main portal catalog. Enables examiners to share access codes in printed handouts or direct messages.</p>
<div class="tech-card"><h6>Link Format:</h6><ul>
<li><strong>Path:</strong> <code>/t/[accessCode]</code></li>
<li><strong>Controller:</strong> Validates code constraints inside <code>test.service.ts</code>.</li>
</ul></div>
<h5>Interaction:</h5><p>Clicking link or scanning QR loads the instructions checklist on the gate page immediately, bypassing catalog discovery steps.</p>`,
  },
  'How does the access code entry work?': {
    category: 'Taker Entry', title: 'Alphanumeric Access Code Gate',
    techRef: 'apps/web/src/screens/DashboardPage.tsx', techLink: ref('apps/web/src/screens/DashboardPage.tsx'),
    dbModel: 'Test.accessCode',
    content: `<p>Allows takers to join specific mock exams by submitting short code tokens on their main dashboards.</p>
<div class="tech-card"><h6>Technical Stack:</h6><ul>
<li><strong>API Route:</strong> <code>GET /api/tests/join/:code</code> in <code>tests.routes.ts</code></li>
<li><strong>Database Schema:</strong> Matches input code with indexed column <code>Test.accessCode</code>.</li>
</ul></div>`,
  },
  'How does discovery via exam catalogue work?': {
    category: 'Taker Entry', title: 'Exam Catalogue Discovery',
    techRef: 'apps/web/src/screens/DashboardPage.tsx', techLink: ref('apps/web/src/screens/DashboardPage.tsx'),
    dbModel: 'Test (status: PUBLISHED)',
    content: `<p>Takers browse available public exams curated by admins or creator institutions, filtering by exam category groups.</p>
<div class="tech-card"><h6>Database query:</h6><ul>
<li>Fetches records where <code>Test.status == TestStatus.PUBLISHED</code>.</li>
<li>Sorts results based on difficulty levels, creation date, or search matches.</li>
</ul></div>`,
  },
  'How does email invitation entry work?': {
    category: 'Taker Entry', title: 'Targeted Email Invitations',
    techRef: 'apps/api/src/services/test.service.ts', techLink: ref('apps/api/src/services/test.service.ts'),
    dbModel: 'Attempt, User',
    content: `<p>Generates pre-authenticated attempt invitation tokens sent to candidates' emails, locking test access to specific users.</p>
<div class="tech-card"><h6>Technical Process:</h6><ul>
<li><strong>Service:</strong> <code>test.service.ts</code> maps recipient list.</li>
<li><strong>Constraints:</strong> Generates unique records associated with taker emails, blocking other account claims.</li>
</ul></div>`,
  },
  'What happens when a registered user logs in?': {
    category: 'Taker Authentication', title: 'Registered User Authentication Session',
    techRef: 'apps/web/src/screens/LoginPage.tsx', techLink: ref('apps/web/src/screens/LoginPage.tsx'),
    dbModel: 'User, RefreshToken',
    content: `<p>Verifies user credentials, sets cookies, and redirects users to dashboard views matching their specific account roles.</p>
<div class="tech-card"><h6>Backend Process:</h6><ul>
<li><strong>Auth Service:</strong> <code>AuthService.login</code> handles password match.</li>
<li><strong>JWT Generation:</strong> Returns access tokens and signs <code>RefreshToken</code> records.</li>
</ul></div>`,
  },
  'How does guest mode work for test takers?': {
    category: 'Taker Authentication', title: 'Guest / Anonymous Attempts',
    techRef: 'apps/api/prisma/schema.prisma', techLink: ref('apps/api/prisma/schema.prisma'),
    dbModel: 'Attempt (guestName, guestEmail, guestSessionId)',
    content: `<p>Allows guest candidates to write public assessments without requiring accounts. Prompts for profile data before launching.</p>
<div class="tech-card"><h6>Database Columns:</h6><ul>
<li><code>Attempt.takerId</code> remains <code>null</code>.</li>
<li><code>Attempt.guestName</code> and <code>Attempt.guestEmail</code> are filled directly from inputs.</li>
<li><code>Attempt.guestSessionId</code> is stored in cookie state to track the session.</li>
</ul></div>`,
  },
  'How does SSO login work for institution students?': {
    category: 'Taker Authentication', title: 'Single Sign-On (SAML / OAuth)',
    techRef: 'apps/api/src/services/auth.service.ts', techLink: ref('apps/api/src/services/auth.service.ts'),
    dbModel: 'User (role: TAKER)',
    content: `<p>Federated identity solution mapping organizational credentials to platform student accounts.</p>
<div class="tech-card"><h6>Technical Stack:</h6><ul>
<li><strong>Service:</strong> Authenticates via SAML or Google Workspace triggers.</li>
<li><strong>Mapping:</strong> Syncs name, email, and registers students under the organization tenant account.</li>
</ul></div>`,
  },
  'What information is shown in the test overview card?': {
    category: 'Gate Screen', title: 'Test overview details card',
    techRef: 'apps/web/src/screens/TestGatePage.tsx', techLink: ref('apps/web/src/screens/TestGatePage.tsx'),
    dbModel: 'Test metadata',
    content: `<p>A summary block rendering title descriptions, author names, total questions, and maximum marks to candidates.</p>
<div class="tech-card"><h6>Gate View:</h6><ul>
<li><strong>Screen:</strong> <a href="${ref('apps/web/src/screens/TestGatePage.tsx')}">TestGatePage.tsx</a></li>
<li><strong>Database mapping:</strong> Displays <code>Test.title</code>, <code>Test.description</code>, and section counts.</li>
</ul></div>`,
  },
  'What timing info is shown on the gate screen?': {
    category: 'Gate Screen', title: 'Timing and Availability Bounds',
    techRef: 'apps/web/src/screens/TestGatePage.tsx', techLink: ref('apps/web/src/screens/TestGatePage.tsx'),
    dbModel: 'Test (startsAt, endsAt, durationMins)',
    content: `<p>Guides candidate timing bounds: renders global exam durations or schedules availability dates.</p>
<div class="tech-card"><h6>Logic:</h6><ul>
<li>Displays values from <code>startsAt</code> and <code>endsAt</code> timestamps.</li>
<li>Enforces clock bounds: blocks attempt initialization button if outside active dates.</li>
</ul></div>`,
  },
  'What marking scheme info is shown on the gate screen?': {
    category: 'Gate Screen', title: 'Evaluation scoring rules',
    techRef: 'apps/web/src/screens/TestGatePage.tsx', techLink: ref('apps/web/src/screens/TestGatePage.tsx'),
    dbModel: 'Test (passingScore, negativeMarkingGlobal)',
    content: `<p>Explains passing percentage constraints and checks if negative scores apply to wrong attempts.</p>
<div class="tech-card"><h6>Scoring references:</h6><ul>
<li><strong>Passing threshold:</strong> Rendered from <code>passingScore</code> (e.g. 40%).</li>
<li><strong>Negative mark check:</strong> Highlights if wrong options incur scoring penalties.</li>
</ul></div>`,
  },
  'What instructions are shown on the gate screen?': {
    category: 'Gate Screen', title: 'Test instructions text',
    techRef: 'apps/web/src/screens/TestGatePage.tsx', techLink: ref('apps/web/src/screens/TestGatePage.tsx'),
    dbModel: 'Test.instructions',
    content: `<p>Rich-text description configured by examiners outlining rules, tools allowed, and focus policies.</p>
<div class="tech-card"><h6>Technical parameters:</h6><ul>
<li><strong>Field:</strong> Renders <code>Test.instructions</code> text block.</li>
<li><strong>Anti-cheat highlight:</strong> Warns students if <code>requireFullscreen</code> toggle is enabled.</li>
</ul></div>`,
  },
  'What does the Start Test button do?': {
    category: 'Gate Screen', title: 'Start Attempt Process',
    techRef: 'apps/api/src/services/attempt.service.ts', techLink: ref('apps/api/src/services/attempt.service.ts'),
    dbModel: 'Attempt (status: IN_PROGRESS)',
    content: `<p>Locks state and creates the active attempt record, assigning randomized questions if requested.</p>
<div class="tech-card"><h6>Process Details:</h6><ul>
<li><strong>Database:</strong> Inserts new <code>Attempt</code> row with <code>startedAt = now()</code>.</li>
<li><strong>Question Sorter:</strong> Generates question indices sequences for <code>assignedQuestions</code> payload.</li>
</ul></div>`,
  },
  'How does section navigation work mid-test?': {
    category: 'Test Taking', title: 'Section navigation tabs',
    techRef: 'apps/web/src/screens/ExamPage.tsx', techLink: ref('apps/web/src/screens/ExamPage.tsx'),
    dbModel: 'Section, Test.allowSectionBacktrack',
    content: `<p>Allows takers to switch between subjects (Physics, Chemistry, Maths tabs) in the taking interface.</p>
<div class="tech-card"><h6>Navigation rules:</h6><ul>
<li><strong>Backtrack restriction:</strong> Blocks clicking previous tabs if <code>allowSectionBacktrack = false</code>.</li>
<li><strong>Timer limits:</strong> Automatically forwards taker to next tab if section timer runs out.</li>
</ul></div>`,
  },
  'How does the submit button work during a test?': {
    category: 'Test Taking', title: 'Manual submit action',
    techRef: 'apps/api/src/services/grading.service.ts', techLink: ref('apps/api/src/services/grading.service.ts'),
    dbModel: 'Attempt (status: SUBMITTED)',
    content: `<p>Takers manually push submission button. Prompts confirmation modal before triggering backend evaluation code.</p>
<div class="tech-card"><h6>Backend Process:</h6><ul>
<li><strong>Route:</strong> <code>POST /api/attempts/:id/submit</code></li>
<li><strong>Grader:</strong> Compares choice responses with database keys for auto-gradable types.</li>
</ul></div>`,
  },
  'How do MCQ options work in the test interface?': {
    category: 'Test Taking', title: 'MCQ Options Interaction',
    techRef: 'apps/web/src/screens/ExamPage.tsx', techLink: ref('apps/web/src/screens/ExamPage.tsx'),
    dbModel: 'Answer.responseData',
    content: `<p>Takers select radio controls (Single Choice) or checkbox grids (Multiple Choice) to mark their answers.</p>
<div class="tech-card"><h6>State Flow:</h6><ul>
<li>Updates Zustand client store to reflect choice indices.</li>
<li>Triggers a debounced request saving answer schema parameters to the server database.</li>
</ul></div>`,
  },
  'What is the auto-submit flow on timer expiry?': {
    category: 'Post-Submission Flow', title: 'Automatic Timer Expiry submission',
    techRef: 'apps/api/src/services/attempt.service.ts', techLink: ref('apps/api/src/services/attempt.service.ts'),
    dbModel: 'Attempt (status: EXPIRED)',
    content: `<p>Automatically triggers attempt finalization if candidate duration clocks hit zero, locking input boxes immediately.</p>
<div class="tech-card"><h6>Process Detail:</h6><ul>
<li><strong>Client clock:</strong> Hits 00:00, calling backend submit function.</li>
<li><strong>Server verification:</strong> Rejects edits if current time exceeds <code>startedAt + duration</code>.</li>
</ul></div>`,
  },
  'What happens when a taker clicks Submit manually?': {
    category: 'Post-Submission Flow', title: 'Manual Submit Confirmation Dialog',
    techRef: 'apps/web/src/screens/ExamPage.tsx', techLink: ref('apps/web/src/screens/ExamPage.tsx'),
    dbModel: 'Attempt',
    content: `<p>Opens a confirmation modal reminding candidates of unanswered, skipped, or review-flagged questions.</p>
<div class="tech-card"><h6>Flow checks:</h6><ul>
<li>Aggregates count of unanswered items in candidate response store.</li>
<li>Sends confirmation request to final submission endpoint.</li>
</ul></div>`,
  },
  'Describe the instant results screen in detail': {
    category: 'Post-Submission Flow', title: 'Instant Results report Card',
    techRef: 'apps/web/src/screens/ResultsPage.tsx', techLink: ref('apps/web/src/screens/ResultsPage.tsx'),
    dbModel: 'Attempt, Answer',
    content: `<p>Displayed immediately after submission if <code>showResultsInstantly</code> is enabled on the Test record.</p>
<div class="tech-card"><h6>Report data:</h6><ul>
<li><strong>Marks:</strong> Earned score compared against total test marks.</li>
<li><strong>Ratios:</strong> Pass/Fail banners and color indicators.</li>
</ul></div>`,
  },
  'What does the taker see when results are pending?': {
    category: 'Post-Submission Flow', title: 'Grading Pending Interface',
    techRef: 'apps/web/src/screens/ResultsPage.tsx', techLink: ref('apps/web/src/screens/ResultsPage.tsx'),
    dbModel: 'Attempt (status: GRADING)',
    content: `<p>Takers land on a confirmation screen indicating their answers are locked and awaiting grading review.</p>
<div class="tech-card"><h6>Conditions:</h6><ul>
<li>Active when <code>Test.showResultsInstantly = false</code>.</li>
<li>Active when attempt contains <code>LONG_ANSWER</code> or <code>FILE_UPLOAD</code> questions.</li>
</ul></div>`,
  },
  'Describe the answer sheet review screen': {
    category: 'Post-Submission Flow', title: 'Answer Review Panel',
    techRef: 'apps/web/src/screens/ResultsPage.tsx', techLink: ref('apps/web/src/screens/ResultsPage.tsx'),
    dbModel: 'Answer (relations)',
    content: `<p>Lists questions with taker response text side-by-side with correct alternatives and detailed creator solution notes.</p>
<div class="tech-card"><h6>Visibility Controls:</h6><ul>
<li>Access depends on the <code>Test.showCorrectAnswers</code> database toggle.</li>
<li>Includes details on marking deductions if negative grading was applied.</li>
</ul></div>`,
  },
  'Describe the performance analysis screen for the taker': {
    category: 'Post-Submission Flow', title: 'Taker performance analytics',
    techRef: 'apps/web/src/screens/ResultsPage.tsx', techLink: ref('apps/web/src/screens/ResultsPage.tsx'),
    dbModel: 'Attempt, Answer',
    content: `<p>Graphs and charts compiling accuracy by tags, subjects, section weight, and average answer speed.</p>
<div class="tech-card"><h6>Analytics Data:</h6><ul>
<li>Tracks section-wise points allocation.</li>
<li>Renders difficulty level success rates (Easy, Medium, Hard).</li>
</ul></div>`,
  },
  'How does the All India Rank feature work?': {
    category: 'Post-Submission Flow', title: 'Global Ranking Calculation',
    techRef: 'apps/api/src/services/attempt.service.ts', techLink: ref('apps/api/src/services/attempt.service.ts'),
    dbModel: 'Attempt',
    content: `<p>Computes candidate ranking percentile by querying score lists for all takers who completed the same test.</p>
<div class="tech-card"><h6>Database calculation:</h6><ul>
<li><strong>Query:</strong> Aggregates scores where <code>Attempt.testId = id</code> and status is <code>SUBMITTED</code> or <code>GRADED</code>.</li>
<li><strong>Rank:</strong> Outputs position sorting by highest raw score.</li>
</ul></div>`,
  },
  'How does the retake test feature work?': {
    category: 'Post-Submission Flow', title: 'Retake Attempt Logic',
    techRef: 'apps/api/src/services/attempt.service.ts', techLink: ref('apps/api/src/services/attempt.service.ts'),
    dbModel: 'Test (allowMultipleAttempts, maxAttempts)',
    content: `<p>Controls if candidates are permitted to attempt the test again. Resets attempt context.</p>
<div class="tech-card"><h6>Verification:</h6><ul>
<li><strong>Service:</strong> Checks if <code>allowMultipleAttempts</code> is true and user attempt count is below <code>maxAttempts</code>.</li>
<li><strong>Data isolation:</strong> Creates a completely new <code>Attempt</code> record without inheriting past selections.</li>
</ul></div>`,
  },
  'Describe the My Tests section on the creator dashboard': {
    category: 'Creator Dashboard', title: 'My Tests Manager',
    techRef: 'apps/web/src/screens/DashboardPage.tsx', techLink: ref('apps/web/src/screens/DashboardPage.tsx'),
    dbModel: 'Test',
    content: `<p>Dashboard screen for instructors to organize their created exams, monitor drafts, and audit active tests.</p>
<div class="tech-card"><h6>Data source:</h6><ul>
<li>Queries <code>Test</code> where <code>creatorId = userId</code>.</li>
<li>Groups rows into tabbed folders: Drafts, Published, Closed, Archived.</li>
</ul></div>`,
  },
  'Describe the Question Bank on the creator dashboard': {
    category: 'Creator Dashboard', title: 'Shared Question Bank library',
    techRef: 'apps/web/src/screens/QuestionBankPage.tsx', techLink: ref('apps/web/src/screens/QuestionBankPage.tsx'),
    dbModel: 'QuestionBank',
    content: `<p>An indexed repository where instructors store reusable questions, allowing quick search and import into new sections.</p>
<div class="tech-card"><h6>Prisma model:</h6><ul>
<li><strong>Table:</strong> <code>QuestionBank</code>.</li>
<li><strong>Fields:</strong> Type, body text, marks, tags, difficulty, and questionData schema JSON.</li>
</ul></div>`,
  },
  'Describe the Results and analytics section on the creator dashboard': {
    category: 'Creator Dashboard', title: 'Instructor Analytics dashboard',
    techRef: 'apps/web/src/screens/CreatorResultsPage.tsx', techLink: ref('apps/web/src/screens/CreatorResultsPage.tsx'),
    dbModel: 'Attempt, Test',
    content: `<p>Visual summary of candidate performance. Helps instructors identify syllabus bottlenecks and check grade curves.</p>
<div class="tech-card"><h6>Key Statistics:</h6><ul>
<li><strong>Stats:</strong> Average score, highest marks, pass rate percentage.</li>
<li><strong>Graphs:</strong> Score histograms and answer accuracy index lists.</li>
</ul></div>`,
  },
  'Describe the Grading queue on the creator dashboard': {
    category: 'Creator Dashboard', title: 'Manual Grading Review Queue',
    techRef: 'apps/api/src/services/grading.service.ts', techLink: ref('apps/api/src/services/grading.service.ts'),
    dbModel: 'Attempt (status: GRADING), Answer',
    content: `<p>Instructor workflow containing all submitted student papers that contain subjective or file upload questions.</p>
<div class="tech-card"><h6>Grading process:</h6><ul>
<li>Filters list of attempts with status <code>GRADING</code>.</li>
<li>Highlights specific questions requiring points and feedback notes inputs.</li>
</ul></div>`,
  },
  'What fields are in the test configuration step?': {
    category: 'Test Builder', title: 'Step 1: Test configuration fields',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test schema',
    content: `<p>Basic profile details of the exam. Configured at the start of the builder wizard.</p>
<div class="tech-card"><h6>Prisma mapping:</h6><ul>
<li><code>title</code>, <code>description</code>, <code>instructions</code> fields.</li>
<li><code>timingMode</code> toggle (Global vs Per-Section).</li>
<li><code>passingScore</code> (Percentage target).</li>
</ul></div>`,
  },
  'How does the timing setup work in the test builder?': {
    category: 'Test Builder', title: 'Timer Modes setup',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test.timingMode',
    content: `<p>Determines how the count-down timer behaves during the attempt.</p>
<div class="tech-card"><h6>Modes:</h6><ul>
<li><strong>GLOBAL:</strong> A single timer for the whole exam (e.g. 180 mins).</li>
<li><strong>PER_SECTION:</strong> Separate duration bounds for each section tab.</li>
</ul></div>`,
  },
  'How does the test window configuration work?': {
    category: 'Test Builder', title: 'Test window limits',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test (startsAt, endsAt)',
    content: `<p>Specifies the dates during which candidates can launch attempts. Enforces availability gates.</p>
<div class="tech-card"><h6>Parameters:</h6><ul>
<li><strong>startsAt:</strong> ISO timestamp opening test access.</li>
<li><strong>endsAt:</strong> ISO timestamp closing access bounds.</li>
</ul></div>`,
  },
  'How does pass/fail and scoring configuration work?': {
    category: 'Test Builder', title: 'Scoring configurations',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test (passingScore, negativeMarkingGlobal)',
    content: `<p>Adjusts passing criteria, global default negative scores, and correct choice weight values.</p>
<div class="tech-card"><h6>Scoring Logic:</h6><ul>
<li><strong>passingScore:</strong> Integer score target (e.g., 50%).</li>
<li><strong>negativeMarkingGlobal:</strong> Deducts marks for incorrect selections.</li>
</ul></div>`,
  },
  'What behaviour toggles are available in test configuration?': {
    category: 'Test Builder', title: 'Security and Behavior flags',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test (flags)',
    content: `<p>Boolean switches adjusting anti-cheat triggers and navigation permissions.</p>
<div class="tech-card"><h6>Toggles:</h6><ul>
<li><code>requireFullscreen</code>: Triggers locks if user switches tabs.</li>
<li><code>shuffleQuestions</code>: Randomizes order of questions per attempt.</li>
<li><code>allowSectionBacktrack</code>: Restricts returning to previous tabs.</li>
</ul></div>`,
  },
  'How do you add a new section in the test builder?': {
    category: 'Section Builder', title: 'Section Provisioning',
    techRef: 'apps/api/src/services/section.service.ts', techLink: ref('apps/api/src/services/section.service.ts'),
    dbModel: 'Section',
    content: `<p>Adds a new subject tab (e.g. "Physics", "Verbal Logic") grouping specific lists of questions.</p>
<div class="tech-card"><h6>Backend Process:</h6><ul>
<li><strong>API Route:</strong> <code>POST /api/sections</code></li>
<li><strong>Service:</strong> <code>SectionService.createSection</code> creates Section db records.</li>
</ul></div>`,
  },
  'How does section drag-to-reorder work?': {
    category: 'Section Builder', title: 'Drag Section Sorting',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Section.order',
    content: `<p>Drag-and-drop section headers visuals. Reordering updates order index values in database.</p>
<div class="tech-card"><h6>Technical process:</h6><ul>
<li>Client recalculates indices sequence on drop event.</li>
<li>Pushes updated order list to <code>PUT /api/sections/reorder</code>.</li>
</ul></div>`,
  },
  'How does per-section timing work?': {
    category: 'Section Builder', title: 'Per-Section Duration limits',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Section.durationMins',
    content: `<p>Specifies how many minutes a candidate can spend on a particular section tab before lockouts occur.</p>
<div class="tech-card"><h6>Timing Rules:</h6><ul>
<li>Enabled only if <code>Test.timingMode = PER_SECTION</code>.</li>
<li>Timer resets when candidate changes tabs. Timer expiry locks section responses.</li>
</ul></div>`,
  },
  'What is the question pool feature in sections?': {
    category: 'Section Builder', title: 'Dynamic Question pool',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Section (questionsToDisplay, totalQuestionsInPool)',
    content: `<p>Creates dynamic exams by drawing random subsets of questions for each attempt sheet.</p>
<div class="tech-card"><h6>Pooling Parameters:</h6><ul>
<li><strong>totalQuestionsInPool:</strong> Count of questions added to section.</li>
<li><strong>questionsToDisplay:</strong> Subset size shown to candidates.</li>
</ul></div>`,
  },
  'How does section instructions setup work?': {
    category: 'Section Builder', title: 'Section-specific instructions',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Section.instructions',
    content: `<p>Text blocks shown above questions inside a section outlining equations, read passages, or subject constraints.</p>
<div class="tech-card"><h6>Database Column:</h6><ul>
<li>Stores instruction markdown inside <code>Section.instructions</code> database column.</li>
</ul></div>`,
  },
  'What does the pre-publish checklist validate?': {
    category: 'Test Builder', title: 'Pre-publish validation checklist',
    techRef: 'apps/api/src/services/test.service.ts', techLink: ref('apps/api/src/services/test.service.ts'),
    dbModel: 'Test, Section, Question',
    content: `<p>A gate that runs structural checks before allowing a test to be published and made accessible to candidates.</p>
<div class="tech-card"><h6>Validation Rules:</h6><ul>
<li><strong>Minimum questions:</strong> Each section must contain at least one question.</li>
<li><strong>Title required:</strong> <code>Test.title</code> must be non-empty.</li>
<li><strong>Duration set:</strong> <code>durationMins</code> must be greater than zero.</li>
<li><strong>Dates valid:</strong> <code>startsAt</code> must be before <code>endsAt</code> if both are set.</li>
</ul></div>
<h5>Outcome:</h5><p>Checklist shows green check marks for passing conditions and red warnings for missing items, blocking publish until all are resolved.</p>`,
  },
  'How does publishing a test work?': {
    category: 'Test Builder', title: 'Test publish flow',
    techRef: 'apps/api/src/services/test.service.ts', techLink: ref('apps/api/src/services/test.service.ts'),
    dbModel: 'Test (status: PUBLISHED)',
    content: `<p>Transitions a draft test to live status, making it joinable via access code, direct link, or catalogue if listed.</p>
<div class="tech-card"><h6>Backend Process:</h6><ul>
<li><strong>Route:</strong> <code>PUT /api/tests/:id/publish</code></li>
<li><strong>Service:</strong> <code>TestService.publishTest</code> sets <code>Test.status = PUBLISHED</code>.</li>
<li><strong>Access code:</strong> Auto-generates a unique 6-char code if not already set.</li>
</ul></div>
<h5>After publish:</h5><ul>
<li>Takers can join via the generated access code or direct link immediately.</li>
<li>Creator can no longer edit questions — only configuration toggles remain editable.</li>
<li>Test appears in the creator's Published tab on the dashboard.</li>
</ul>`,
  },
  'How does the access code sharing work?': {
    category: 'Publishing Tools', title: 'Access Code generation',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test.accessCode',
    content: `<p>Displays copyable 6-digit access code upon publishing (e.g. <code>JEE2026</code>) that students type to join.</p>
<div class="tech-card"><h6>Technical parameters:</h6><ul>
<li><strong>Database:</strong> Checks unique constraints on <code>accessCode</code> strings.</li>
</ul></div>`,
  },
  'How does direct link sharing work?': {
    category: 'Publishing Tools', title: 'Direct link generation',
    techRef: 'apps/web/src/screens/TestBuilderPage.tsx', techLink: ref('apps/web/src/screens/TestBuilderPage.tsx'),
    dbModel: 'Test.accessLink',
    content: `<p>Instructors copy direct links pointing to candidate test overview gate views.</p>
<div class="tech-card"><h6>Format:</h6><ul>
<li>URL contains access code path: <code>/t/ABCDEF</code>.</li>
</ul></div>`,
  },
  'How does email invite distribution work?': {
    category: 'Publishing Tools', title: 'Email list invites',
    techRef: 'apps/api/src/services/test.service.ts', techLink: ref('apps/api/src/services/test.service.ts'),
    dbModel: 'Attempt, User',
    content: `<p>Pushes exam invitation emails to batch lists. Creates pre-allocated token rows for candidates.</p>
<div class="tech-card"><h6>Mailing Stack:</h6><ul>
<li><strong>Mailer:</strong> Pushes notifications via Nodemailer utility class.</li>
<li><strong>Verification:</strong> Restricts test gate entry to email lists.</li>
</ul></div>`,
  },
  'How does listing a test on the exam catalogue work?': {
    category: 'Publishing Tools', title: 'Curated Catalogue list',
    techRef: 'apps/api/src/services/test.service.ts', techLink: ref('apps/api/src/services/test.service.ts'),
    dbModel: 'Test (status: PUBLISHED)',
    content: `<p>Submits request flags to catalog index, making tests searchable by all visitors in public dashboard feeds.</p>
<div class="tech-card"><h6>Properties:</h6><ul>
<li>Updates visibility flags. Admins audit quality before catalog activation.</li>
</ul></div>`,
  },
  'Describe the results dashboard for creators': {
    category: 'Grading & Analytics', title: 'Creator Analytics Summary',
    techRef: 'apps/web/src/screens/CreatorResultsPage.tsx', techLink: ref('apps/web/src/screens/CreatorResultsPage.tsx'),
    dbModel: 'Attempt, Test',
    content: `<p>Visual summary charts illustrating score histograms, pass rate curves, and taker participation logs.</p>
<div class="tech-card"><h6>UI View:</h6><ul>
<li><strong>File:</strong> <a href="${ref('apps/web/src/screens/CreatorResultsPage.tsx')}">CreatorResultsPage.tsx</a></li>
</ul></div>`,
  },
  'Describe the attempt detail view for creators': {
    category: 'Grading & Analytics', title: 'Student Answer Sheet audit',
    techRef: 'apps/web/src/screens/AttemptDetailPage.tsx', techLink: ref('apps/web/src/screens/AttemptDetailPage.tsx'),
    dbModel: 'Attempt, Answer',
    content: `<p>Displays exact candidate answers, markings, time taken per question, and correct alternative tags.</p>
<div class="tech-card"><h6>UI Component:</h6><ul>
<li><strong>File:</strong> <a href="${ref('apps/web/src/screens/AttemptDetailPage.tsx')}">AttemptDetailPage.tsx</a></li>
</ul></div>`,
  },
  'Describe the manual grading interface for subjective answers': {
    category: 'Grading & Analytics', title: 'Manual Grading interface',
    techRef: 'apps/api/src/services/grading.service.ts', techLink: ref('apps/api/src/services/grading.service.ts'),
    dbModel: 'Answer (earnedMarks, graderNotes)',
    content: `<p>Allows examiners to view subjective essay text or S3-uploaded files, assign score numbers, and add notes.</p>
<div class="tech-card"><h6>Service Logic:</h6><ul>
<li><strong>Endpoint:</strong> <code>POST /api/grading/grade-answer</code></li>
<li><strong>Logic:</strong> Updates points and transitions attempt status once complete.</li>
</ul></div>`,
  },
  'Describe the analytics features for creators': {
    category: 'Grading & Analytics', title: 'Creator Exam Analytics',
    techRef: 'apps/web/src/screens/CreatorResultsPage.tsx', techLink: ref('apps/web/src/screens/CreatorResultsPage.tsx'),
    dbModel: 'Attempt',
    content: `<p>Identifies hardest questions, section-wise success ratios, and compiles timing telemetry stats.</p>
<div class="tech-card"><h6>Features:</h6><ul>
<li>Item difficulty statistics tables.</li>
<li>Averages score calculations per section tab.</li>
</ul></div>`,
  },
  'How does CSV export of results work?': {
    category: 'Grading & Analytics', title: 'CSV Export of Test Grades',
    techRef: 'apps/api/src/routes/tests.routes.ts', techLink: ref('apps/api/src/routes/tests.routes.ts'),
    dbModel: 'Attempt, User',
    content: `<p>Generates spreadsheet tables containing student emails, scores, durations, and pass/fail states.</p>
<div class="tech-card"><h6>API endpoint:</h6><ul>
<li><strong>Route:</strong> <code>GET /api/tests/:id/export</code></li>
<li><strong>Processor:</strong> Stream-pipes database queries directly to CSV response headers.</li>
</ul></div>`,
  },
  'Describe the User Management section of the admin panel': {
    category: 'Admin Console', title: 'User Registry Control',
    techRef: 'apps/web/src/screens/AdminUsersPage.tsx', techLink: ref('apps/web/src/screens/AdminUsersPage.tsx'),
    dbModel: 'User',
    content: `<p>Admin panel listing registered profiles with options to adjust user roles or toggle suspension flags.</p>
<div class="tech-card"><h6>UI View:</h6><ul>
<li><strong>Screen:</strong> <a href="${ref('apps/web/src/screens/AdminUsersPage.tsx')}">AdminUsersPage.tsx</a></li>
</ul></div>`,
  },
  'Describe the Test Management section of the admin panel': {
    category: 'Admin Console', title: 'Platform-Wide Test Audit',
    techRef: 'apps/web/src/screens/AdminTestsPage.tsx', techLink: ref('apps/web/src/screens/AdminTestsPage.tsx'),
    dbModel: 'Test',
    content: `<p>Allows system admins to inspect, search, flag, or force-archive tests uploaded by any creator account.</p>
<div class="tech-card"><h6>UI View:</h6><ul>
<li><strong>Screen:</strong> <a href="${ref('apps/web/src/screens/AdminTestsPage.tsx')}">AdminTestsPage.tsx</a></li>
</ul></div>`,
  },
  'Describe the Exam Catalogue management in the admin panel': {
    category: 'Admin Console', title: 'Catalogue Curation Queue',
    techRef: 'apps/web/src/screens/AdminDashboardPage.tsx', techLink: ref('apps/web/src/screens/AdminDashboardPage.tsx'),
    dbModel: 'Test, Catalog Listings',
    content: `<p>Moderation layout for review requests. Admin examines tests submitted for public catalog listings, approving or rejecting with remarks.</p>
<div class="tech-card"><h6>Technical process:</h6><ul>
<li>Lists tests requesting visibility promotion. Updates status triggers.</li>
</ul></div>`,
  },
  'Describe the System Settings in the admin panel': {
    category: 'Admin Console', title: 'System settings panel',
    techRef: 'apps/web/src/screens/AdminDashboardPage.tsx', techLink: ref('apps/web/src/screens/AdminDashboardPage.tsx'),
    dbModel: 'Global configurations schema',
    content: `<p>Configures global system properties such as size limits, maintenance indicators, and API rate thresholds.</p>
<div class="tech-card"><h6>References:</h6><ul>
<li><strong>Service:</strong> Calls admin service file endpoints updating process settings.</li>
</ul></div>`,
  },
}

export function getPromptDetails(promptText: string): PromptDetails {
  const found = workflowPrompts[promptText]
  if (found) return found

  // Dynamic fallback
  const api = ref('apps/api/src')

  if (promptText.includes('mock test')) {
    const exam = promptText
      .replace('Show the', '').replace('mock test structure and sections', '')
      .replace('mock test structure', '').trim()
    return {
      category: 'Exam Catalogue', title: `${exam} Pattern`,
      techRef: 'apps/api/prisma/seed.ts', techLink: ref('apps/api/prisma/seed.ts'),
      dbModel: 'Test, Section, Question',
      content: `<p>This layout outlines the official structure of the <strong>${exam}</strong> examination inside the database.</p>
<div class="tech-card"><h6>Prisma Configuration:</h6><ul>
<li><strong>Model:</strong> <code>Test.accessCode</code> and <code>Test.accessLink</code> generated upon publishing.</li>
<li><strong>Structure:</strong> Multiple child <code>Section</code> records containing ordered <code>Question</code> nodes.</li>
</ul></div>
<h5>Official Mapping Parameters:</h5><ul>
<li>Correctly maps section counts, durations, and total marking values.</li>
<li>Allows creators to toggle global or per-section time limits.</li>
<li>Features option shuffling and negative score clamping.</li>
</ul>`,
    }
  }

  if (promptText.includes('editor work')) {
    const type = promptText.replace('How does the', '').replace('question editor work?', '').trim()
    return {
      category: 'Creator Tools', title: `${type} Question Editor`,
      techRef: 'packages/shared/src/schemas/question.schema.ts',
      techLink: ref('packages/shared/src/schemas/question.schema.ts'),
      dbModel: 'Question.questionData (JSON Schema)',
      content: `<p>Enables creators to configure <strong>${type}</strong> questions with customized evaluation rules.</p>
<div class="tech-card"><h6>Zod Validation:</h6><ul>
<li><strong>Schema:</strong> <code>QuestionDataSchema</code> validates payload structure.</li>
<li><strong>API:</strong> Verified on endpoints via <code>validate(CreateQuestionInput)</code> middleware.</li>
</ul></div>
<h5>Editor Configuration:</h5><ul>
<li>Rich text body input support with HTML sanitization.</li>
<li>AWS S3 integration for attaching diagram images and files.</li>
<li>Score values, difficulty tags, and option definitions.</li>
</ul>`,
    }
  }

  if (promptText.includes('render for the taker')) {
    const type = promptText.replace('How does', '').replace('render for the taker?', '').trim()
    return {
      category: 'Taker Experience', title: `${type} Render View`,
      techRef: 'apps/web/src/screens/ExamPage.tsx', techLink: ref('apps/web/src/screens/ExamPage.tsx'),
      dbModel: 'Answer.responseData (JSON Schema)',
      content: `<p>Defines how the candidate interacts with <strong>${type}</strong> questions in the Next.js frontend.</p>
<div class="tech-card"><h6>Frontend Component:</h6><ul>
<li><strong>View:</strong> <a href="${ref('apps/web/src/screens/ExamPage.tsx')}">ExamPage.tsx</a></li>
<li><strong>State:</strong> Monitored using Zustand store hooks for offline resiliency.</li>
</ul></div>
<h5>User Experience:</h5><ul>
<li>Responsive and clear interface designed to prevent cognitive load.</li>
<li>Integrates key options and input controls directly into the question pane.</li>
<li>Automatic autosave payload generation sent to the Express API.</li>
</ul>`,
    }
  }

  if (
    promptText.includes('exams available') ||
    promptText.includes('exams on the platform') ||
    promptText.includes('Olympiad exams')
  ) {
    const title =
      promptText.replace('Show all', '').replace('available on the platform', '')
        .replace('on the platform', '').trim()
    return {
      category: 'Exam Catalogue',
      title: title.charAt(0).toUpperCase() + title.slice(1) + ' Categories',
      techRef: 'apps/api/prisma/seed.ts', techLink: ref('apps/api/prisma/seed.ts'),
      dbModel: 'Test, Catalog Groups',
      content: `<p>Dynamic catalog group rendering registered courses and exams matching <strong>${title}</strong>.</p>
<div class="tech-card"><h6>Prisma Seeding:</h6><ul>
<li><strong>Source:</strong> <a href="${ref('apps/api/prisma/seed.ts')}">seed.ts</a> populates default mock parameters.</li>
<li><strong>Model:</strong> Catalog links categorized by dynamic tags.</li>
</ul></div>
<h5>Catalogue features:</h5><ul>
<li>Enables self-enrollment gates for takers.</li>
<li>Interactive searches and tag filters grouping.</li>
</ul>`,
    }
  }

  if (
    promptText.includes('setting control') || promptText.includes('duration setting') ||
    promptText.includes('file types') || promptText.includes('maintenance mode') ||
    promptText.includes('institution management') || promptText.includes('platform-wide analytics')
  ) {
    const title = promptText.replace('What does', '').replace('setting control?', '')
      .replace('How does', '').replace('work in the admin panel?', '').replace('work in admin?', '').trim()
    return {
      category: 'Admin Settings',
      title: title.charAt(0).toUpperCase() + title.slice(1),
      techRef: 'apps/api/src/services/admin.service.ts', techLink: ref('apps/api/src/services/admin.service.ts'),
      dbModel: 'Global Config Properties',
      content: `<p>This parameter defines platform limits or behaviors controlled by administrators to manage resources, billing levels, or security constraints.</p>
<div class="tech-card"><h6>Admin Reference:</h6><ul>
<li><strong>Service:</strong> <a href="${ref('apps/api/src/services/admin.service.ts')}">admin.service.ts</a></li>
<li><strong>Prisma Model:</strong> Global system options stored in key-value config records.</li>
</ul></div>
<h5>Configuration details:</h5><p>Enforced across endpoints to maintain platform reliability, regulate API usage, and control file upload sizes.</p>`,
    }
  }

  if (
    promptText.includes('information is shown') || promptText.includes('marking scheme') ||
    promptText.includes('instructions are shown')
  ) {
    const title = promptText.replace('What', '').replace('info is shown on the gate screen?', '')
      .replace('information is shown in the', '').replace('info is shown?', '').trim()
    return {
      category: 'Gate Screen Details',
      title: title.charAt(0).toUpperCase() + title.slice(1),
      techRef: 'apps/web/src/screens/TestGatePage.tsx', techLink: ref('apps/web/src/screens/TestGatePage.tsx'),
      dbModel: 'Test Metadata Fields',
      content: `<p>Defines how the information is retrieved from the backend <code>Test</code> record and rendered on the gate instructions screen.</p>
<div class="tech-card"><h6>Frontend View:</h6><ul>
<li><strong>File:</strong> <a href="${ref('apps/web/src/screens/TestGatePage.tsx')}">TestGatePage.tsx</a></li>
<li><strong>Verification:</strong> Enforces startsAt/endsAt ranges and checks if user is logged in before revealing start controls.</li>
</ul></div>`,
    }
  }

  // Generic fallback
  const title = promptText.replace('Describe the', '').replace('in detail', '')
    .replace('How does', '').trim()
  return {
    category: 'App Journey',
    title: title.charAt(0).toUpperCase() + title.slice(1),
    techRef: 'apps/api/src', techLink: api,
    dbModel: 'QuizForge Models',
    content: `<p>This flow maps directly to the QuizForge product surface for: <strong>"${title}"</strong>.</p>
<div class="tech-card"><h6>Technical Framework:</h6><ul>
<li><strong>Routes:</strong> Registered inside the Express API routes directory.</li>
<li><strong>Client:</strong> Handled by matching views in the Next.js router.</li>
</ul></div>
<h5>Description:</h5><p>Provides critical support to ensure smooth data transitions across takers, creators, and platform managers.</p>`,
  }
}
