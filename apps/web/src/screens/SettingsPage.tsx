'use client'

import { Save } from 'lucide-react'
import { useState } from 'react'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Toast } from '../components/ui/Toast'

export function SettingsPage() {
  const [passPercentage, setPassPercentage] = useState('40')
  const [showResults, setShowResults] = useState(true)
  const [requireFullscreen, setRequireFullscreen] = useState(false)
  const [toast, setToast] = useState('')

  return (
    <DashboardLayout>
      <header className="min-h-[125px] border-b border-slate-900/70 bg-[#fbfaff] px-8 py-9 lg:px-12">
        <h1 className="text-3xl font-extrabold">Settings</h1>
        <p className="mt-2 text-lg text-muted-foreground">Default controls for creator workflows.</p>
      </header>
      <div className="max-w-3xl px-8 py-10 lg:px-12">
        {toast && (
          <div className="fixed right-6 top-6 z-40">
            <Toast message={toast} tone="success" />
          </div>
        )}

        <Card className="space-y-5 p-6">
          <label className="block text-sm font-bold">
            Default pass percentage
            <Input
              className="mt-2"
              type="number"
              value={passPercentage}
              onChange={(event) => setPassPercentage(event.target.value)}
            />
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={showResults}
              onChange={(event) => setShowResults(event.target.checked)}
              className="accent-primary"
            />
            Show taker results instantly by default
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={requireFullscreen}
              onChange={(event) => setRequireFullscreen(event.target.checked)}
              className="accent-primary"
            />
            Require fullscreen for published tests
          </label>
          <div className="flex justify-end">
            <Button icon={<Save size={18} />} onClick={() => setToast('Settings saved locally for the demo.')}>
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
