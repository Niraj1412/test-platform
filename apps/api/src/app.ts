import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { adminRouter } from './routes/admin.routes.js'
import { attemptsRouter } from './routes/attempts.routes.js'
import { authRouter } from './routes/auth.routes.js'
import { questionBankRouter } from './routes/questionBank.routes.js'
import { questionsRouter } from './routes/questions.routes.js'
import { sectionsRouter } from './routes/sections.routes.js'
import { testsRouter } from './routes/tests.routes.js'
import { errorMiddleware } from './middleware/error.middleware.js'

export const app = express()

app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
  })
)
app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    credentials: true
  })
)
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

app.get('/.well-known/appspecific/com.chrome.devtools.json', (_req, res) => {
  res.json({})
})

app.use('/api/auth', authRouter)
app.use('/api/attempts', attemptsRouter)
app.use('/api/tests', testsRouter)
app.use('/api/question-bank', questionBankRouter)
app.use('/api/admin', adminRouter)
app.use('/api', sectionsRouter)
app.use('/api', questionsRouter)

app.use(errorMiddleware)
