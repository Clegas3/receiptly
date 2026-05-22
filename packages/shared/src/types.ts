export type ReceiptItem = {
  name: string
  price: number
}

export type ReceiptCategory =
  | 'Food'
  | 'Travel'
  | 'Transport'
  | 'Office'
  | 'Entertainment'
  | 'Other'

export type ReceiptDraft = {
  merchant: string
  date: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  category: ReceiptCategory
}

export type Receipt = ReceiptDraft & {
  id: string
  createdAt: string
}

export type AIProvider = 'openai' | 'anthropic' | 'gemini'

export type AISettings = {
  provider: AIProvider
  apiKey: string
  model: string
}
