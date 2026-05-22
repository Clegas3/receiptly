import {
  DEFAULT_MODELS,
  PROVIDERS,
  STORAGE_KEYS,
  type AIProvider,
  type AISettings,
  type Receipt,
} from '@receiptly/shared'

const defaultSettings: AISettings = {
  provider: 'openai',
  apiKey: '',
  model: DEFAULT_MODELS.openai,
}

const isProvider = (value: unknown): value is AIProvider =>
  PROVIDERS.some((provider) => provider.value === value)

const normalizeSettings = (value: Partial<AISettings>): AISettings => {
  const provider = isProvider(value.provider) ? value.provider : defaultSettings.provider
  return {
    provider,
    apiKey: value.apiKey ?? '',
    model: value.model || DEFAULT_MODELS[provider],
  }
}

const canUseStorage = () => typeof window !== 'undefined' && !!window.localStorage

export const loadSettings = (): AISettings => {
  if (!canUseStorage()) return defaultSettings
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.settings)
    if (!stored) return defaultSettings
    return normalizeSettings(JSON.parse(stored) as Partial<AISettings>)
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings: AISettings) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
}

export const loadReceipts = (): Receipt[] => {
  if (!canUseStorage()) return []
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.receipts)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as Receipt[]) : []
  } catch {
    return []
  }
}

export const saveReceipts = (receipts: Receipt[]) => {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEYS.receipts, JSON.stringify(receipts))
}
