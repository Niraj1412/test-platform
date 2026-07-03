'use client'

import { BarChart3, Clock, Download, Eye, Users } from 'lucide-react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const attempts = [
  { id: 'attempt-1', name: 'Sam Taylor', score: '72%', status: 'GRADED', time: '42m 15s', started: 'Jun 22, 2026 10:12' },
  { id: 'attempt-2', name: 'Priya Shah', score: 'Pending', status: 'GRADING', time: '50m 02s', started: 'Jun 22, 2026 10:24' },
  { id: 'attempt-3', name: 'Noah Lee', score: '84%', status: 'GRADED', time: '38m 44s', started: 'Jun 22, 2026 11:02' }
]

export function CreatorResultsPage() {
  return (
    <DashboardLayout>
      <header className="flex min-h-[125px] items-center justify-between border-b border-slate-900/70 bg-[#fbfaff] px-8 lg:px-12">
        <div>
          <h1 className="text-3xl font-extrabold">Mid-Term Exam Results</h1>
          <p className="mt-2 text-lg text-muted-foreground">Summary, attempts, and manual grading queue.</p>
        </div>
        <Button variant="secondary" icon={<Download size={18} />}>
          Export CSV
        </Button>
      </header>
      <div className="px-8 py-10 lg:px-12">
        <div className="grid gap-5 lg:grid-cols-4">
          {[
            { label: 'Average score', value: '76%', icon: BarChart3 },
            { label: 'Pass rate', value: '81%', icon: BarChart3 },
            { label: 'Total attempts', value: '149', icon: Users },
            { label: 'Average time', value: '44m', icon: Clock }
          ].map((stat) => (
            <Card key={stat.label} className="p-6">
              <stat.icon className="text-primary" />
              <div className="mt-5 text-3xl font-extrabold">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 overflow-hidden">
          <div className="border-b border-border bg-[#f0f1ff] px-6 py-5">
            <h2 className="text-2xl font-extrabold">Taker Attempts</h2>
          </div>
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead className="text-sm uppercase">
              <tr className="border-b border-border">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Time Taken</th>
                <th className="px-6 py-4">Started At</th>
                <th className="px-6 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id} className="border-b border-border last:border-b-0">
                  <td className="px-6 py-4 font-semibold">{attempt.name}</td>
                  <td className="px-6 py-4">{attempt.score}</td>
                  <td className="px-6 py-4">
                    <Badge tone={attempt.status === 'GRADED' ? 'blue' : 'orange'}>{attempt.status}</Badge>
                  </td>
                  <td className="px-6 py-4">{attempt.time}</td>
                  <td className="px-6 py-4">{attempt.started}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="secondary" icon={<Eye size={16} />} disabled>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
