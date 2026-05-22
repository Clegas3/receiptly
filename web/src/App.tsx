import { useEffect, useState } from 'react'
import {
  createReceiptId,
  type AISettings,
  type Receipt,
  type ReceiptDraft,
} from '@receiptly/shared'
import { Sidebar, type NavKey } from './components/Sidebar'
import { loadReceipts, loadSettings, saveReceipts, saveSettings } from './lib/storage'
import { DashboardPage } from './pages/DashboardPage'
import { ReceiptsPage } from './pages/ReceiptsPage'
import { ScanPage } from './pages/ScanPage'
import { SettingsPage } from './pages/SettingsPage'
import './App.css'

const createReceipt = (draft: ReceiptDraft): Receipt => ({
  ...draft,
  id: createReceiptId(),
  createdAt: new Date().toISOString(),
})

function App() {
  const [activePage, setActivePage] = useState<NavKey>('dashboard')
  const [receipts, setReceipts] = useState<Receipt[]>(() => loadReceipts())
  const [settings, setSettings] = useState<AISettings>(() => loadSettings())

  useEffect(() => {
    saveReceipts(receipts)
  }, [receipts])

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const handleReceipt = (draft: ReceiptDraft) => {
    setReceipts((prev) => [createReceipt(draft), ...prev])
    setActivePage('receipts')
  }

  return (
    <div className="app">
      <Sidebar active={activePage} onNavigate={setActivePage} />
      <main className="content">
        {activePage === 'dashboard' && <DashboardPage receipts={receipts} />}
        {activePage === 'receipts' && <ReceiptsPage receipts={receipts} />}
        {activePage === 'scan' && (
          <ScanPage settings={settings} onReceipt={handleReceipt} />
        )}
        {activePage === 'settings' && (
          <SettingsPage settings={settings} onChange={setSettings} />
        )}
      </main>
    </div>
  )
}

export default App
