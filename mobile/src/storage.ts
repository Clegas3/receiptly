import AsyncStorage from '@react-native-async-storage/async-storage'
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

export const loadSettings = async (): Promise<AISettings> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.settings)
    if (!stored) return defaultSettings
    return normalizeSettings(JSON.parse(stored) as Partial<AISettings>)
  } catch {
    return defaultSettings
  }
}

export const saveSettings = async (settings: AISettings) => {
  await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings))
}

export const loadReceipts = async (): Promise<Receipt[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.receipts)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as Receipt[]) : []
  } catch {
    return []
  }
}

export const saveReceipts = async (receipts: Receipt[]) => {
  await AsyncStorage.setItem(STORAGE_KEYS.receipts, JSON.stringify(receipts))
}
