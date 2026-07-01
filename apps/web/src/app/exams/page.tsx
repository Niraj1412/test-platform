import { Suspense } from 'react'
import { ExamCataloguePage } from '../../screens/ExamCataloguePage'

export const metadata = {
  title: 'Exam Catalogue — QuizForge',
  description: '1000+ mock tests across Engineering, Medical, Government, Management, Law and School categories.',
}

export default function ExamsPage() {
  return (
    <Suspense>
      <ExamCataloguePage />
    </Suspense>
  )
}
