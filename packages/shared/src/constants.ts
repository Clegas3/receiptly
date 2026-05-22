import type { AIProvider, ReceiptCategory } from './types'

export const RECEIPT_CATEGORIES: ReceiptCategory[] = [
  'Food',
  'Travel',
  'Transport',
  'Office',
  'Entertainment',
  'Other',
]

export const PROVIDERS: Array<{ value: AIProvider; label: string }> = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' },
  { value: 'gemini', label: 'Google Gemini' },
]

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-3-5-sonnet-20240620',
  gemini: 'gemini-1.5-flash',
}

export const STORAGE_KEYS = {
  settings: 'receiptly_settings',
  receipts: 'receiptly_receipts',
}
