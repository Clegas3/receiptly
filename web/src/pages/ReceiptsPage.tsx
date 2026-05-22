import { useMemo, useState } from 'react'
import {
  RECEIPT_CATEGORIES,
  formatCurrency,
  formatDate,
  type Receipt,
  type ReceiptCategory,
} from '@receiptly/shared'
import { CategoryBadge } from '../components/CategoryBadge'

const FILTER_OPTIONS: Array<'All' | ReceiptCategory> = ['All', ...RECEIPT_CATEGORIES]

type ReceiptsPageProps = {
  receipts: Receipt[]
}

export const ReceiptsPage = ({ receipts }: ReceiptsPageProps) => {
  const [filter, setFilter] = useState<'All' | ReceiptCategory>('All')
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null)

  const filteredReceipts = useMemo(() => {
    if (filter === 'All') return receipts
    return receipts.filter((receipt) => receipt.category === filter)
  }, [filter, receipts])

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Receipts</h2>
          <p>Review and drill into each receipt.</p>
        </div>
        <div className="filter">
          <label htmlFor="category-filter">Filter</label>
          <select
            id="category-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value as 'All' | ReceiptCategory)}
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="receipt-list">
        {filteredReceipts.length === 0 ? (
          <div className="empty-state">No receipts match this filter yet.</div>
        ) : (
          filteredReceipts.map((receipt) => (
            <button
              key={receipt.id}
              type="button"
              className="receipt-row"
              onClick={() => setSelectedReceipt(receipt)}
            >
              <div>
                <strong>{receipt.merchant}</strong>
                <span>{formatDate(receipt.date || receipt.createdAt)}</span>
              </div>
              <div className="receipt-meta">
                <CategoryBadge category={receipt.category} />
                <span>{formatCurrency(receipt.total)}</span>
              </div>
            </button>
          ))
        )}
      </div>

      <div className={`detail-panel ${selectedReceipt ? 'open' : ''}`}>
        {selectedReceipt && (
          <>
            <div className="detail-header">
              <div>
                <h3>{selectedReceipt.merchant}</h3>
                <p>{formatDate(selectedReceipt.date || selectedReceipt.createdAt)}</p>
              </div>
              <button type="button" onClick={() => setSelectedReceipt(null)}>
                Close
              </button>
            </div>
            <div className="detail-section">
              <CategoryBadge category={selectedReceipt.category} />
              <div className="detail-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(selectedReceipt.subtotal)}</strong>
                </div>
                <div>
                  <span>Tax</span>
                  <strong>{formatCurrency(selectedReceipt.tax)}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{formatCurrency(selectedReceipt.total)}</strong>
                </div>
              </div>
            </div>
            <div className="detail-section">
              <h4>Line items</h4>
              <ul>
                {selectedReceipt.items.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    <span>{item.name}</span>
                    <strong>{formatCurrency(item.price)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      {selectedReceipt && (
        <button
          type="button"
          className="detail-overlay"
          onClick={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  )
}
