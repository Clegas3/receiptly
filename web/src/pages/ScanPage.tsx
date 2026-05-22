import { useRef, useState } from 'react'
import {
  analyzeReceipt,
  formatCurrency,
  formatDate,
  type AISettings,
  type ReceiptDraft,
} from '@receiptly/shared'

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      const base64 = result.split(',')[1]
      if (!base64) {
        reject(new Error('Unable to read the receipt image.'))
        return
      }
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Unable to read the receipt image.'))
    reader.readAsDataURL(file)
  })

type ScanPageProps = {
  settings: AISettings
  onReceipt: (receipt: ReceiptDraft) => void
}

export const ScanPage = ({ settings, onReceipt }: ScanPageProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastReceipt, setLastReceipt] = useState<ReceiptDraft | null>(null)

  const handleFile = async (file: File) => {
    if (!settings.apiKey) {
      setError('Add your API key in Settings before scanning.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const base64 = await fileToBase64(file)
      const draft = await analyzeReceipt({ base64, settings })
      onReceipt(draft)
      setLastReceipt(draft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed. Try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  const handleBrowse = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) void handleFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Scan</h2>
          <p>Drop a receipt image and let AI extract the details.</p>
        </div>
        <button type="button" onClick={() => inputRef.current?.click()}>
          Upload receipt
        </button>
      </header>
      <div
        className={`dropzone ${isProcessing ? 'busy' : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleBrowse}
          hidden
        />
        <div>
          <h3>Drag & drop</h3>
          <p>PNG or JPG receipt images work best.</p>
        </div>
        {isProcessing && <div className="processing">Reading receipt...</div>}
        {error && <div className="error">{error}</div>}
      </div>
      {lastReceipt && (
        <section className="summary-card">
          <div>
            <h3>Latest capture</h3>
            <p>{formatDate(lastReceipt.date)}</p>
          </div>
          <div className="summary-list">
            <div className="summary-row">
              <div>
                <strong>{lastReceipt.merchant}</strong>
                <span>{lastReceipt.items.length} line items</span>
              </div>
              <div className="summary-amount">{formatCurrency(lastReceipt.total)}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
