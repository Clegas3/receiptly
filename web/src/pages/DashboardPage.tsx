import { formatCurrency, formatDate } from '@receiptly/shared'
import type { Receipt } from '@receiptly/shared'

const getReceiptDate = (receipt: Receipt) => {
  const parsed = new Date(receipt.date)
  return Number.isNaN(parsed.valueOf()) ? new Date(receipt.createdAt) : parsed
}

const getTopCategory = (receipts: Receipt[]) => {
  const totals = receipts.reduce<Record<string, number>>((acc, receipt) => {
    acc[receipt.category] = (acc[receipt.category] || 0) + receipt.total
    return acc
  }, {})

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1])
  return sorted.length ? sorted[0][0] : '—'
}

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="stat-card">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
)

type DashboardPageProps = {
  receipts: Receipt[]
}

export const DashboardPage = ({ receipts }: DashboardPageProps) => {
  const totalSpend = receipts.reduce((sum, receipt) => sum + receipt.total, 0)
  const receiptCount = receipts.length
  const now = new Date()
  const monthSpend = receipts
    .filter((receipt) => {
      const date = getReceiptDate(receipt)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })
    .reduce((sum, receipt) => sum + receipt.total, 0)
  const topCategory = getTopCategory(receipts)

  const latest = receipts.slice(0, 3)

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Your receipt intelligence overview.</p>
        </div>
        <div className="pill">Updated {formatDate(new Date().toISOString())}</div>
      </header>
      <div className="stats-grid">
        <StatCard label="Total spend" value={formatCurrency(totalSpend)} />
        <StatCard label="This month" value={formatCurrency(monthSpend)} />
        <StatCard label="Receipt count" value={`${receiptCount}`} />
        <StatCard label="Top category" value={topCategory} />
      </div>
      <section className="summary-card">
        <div>
          <h3>Recent receipts</h3>
          <p>Latest captures across your workspace.</p>
        </div>
        <div className="summary-list">
          {latest.length === 0 ? (
            <span className="muted">No receipts captured yet.</span>
          ) : (
            latest.map((receipt) => (
              <div key={receipt.id} className="summary-row">
                <div>
                  <strong>{receipt.merchant}</strong>
                  <span>{formatDate(receipt.date || receipt.createdAt)}</span>
                </div>
                <div className="summary-amount">{formatCurrency(receipt.total)}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
