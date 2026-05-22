import { DEFAULT_MODELS, RECEIPT_CATEGORIES } from './constants'
import type { AISettings, ReceiptCategory, ReceiptDraft } from './types'

const buildReceiptPrompt = () => `You are a receipt parsing assistant.\n\nReturn ONLY raw JSON with no markdown or backticks in this exact shape:\n{\n  \"merchant\": string,\n  \"date\": string,\n  \"items\": [{ \"name\": string, \"price\": number }],\n  \"subtotal\": number,\n  \"tax\": number,\n  \"total\": number,\n  \"category\": string\n}\n\nRules:\n- Use numbers for prices and totals (no currency symbols).\n- If an item price is missing, set it to 0.\n- Category must be one of: ${RECEIPT_CATEGORIES.join(', ')}.\n- Do not include any additional keys or commentary.\n`

type AnalyzeArgs = {
  base64: string
  settings: AISettings
}

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]+/g, '')
    const parsed = Number.parseFloat(cleaned)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const parseJsonFromText = (text: string) => {
  const cleaned = text.replace(/```(?:json)?/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('Unable to parse JSON response from AI provider.')
    return JSON.parse(match[0])
  }
}

const normalizeReceipt = (payload: Record<string, unknown>): ReceiptDraft => {
  const rawItems = Array.isArray(payload.items) ? payload.items : []
  const items = rawItems.map((item) => {
    if (item && typeof item === 'object') {
      const name = 'name' in item ? String(item.name ?? 'Item') : 'Item'
      const price = parseNumber('price' in item ? item.price : 0) ?? 0
      return { name, price }
    }
    return { name: 'Item', price: 0 }
  })

  const subtotalFromItems = items.reduce((sum, item) => sum + item.price, 0)
  const subtotalValue = parseNumber(payload.subtotal)
  const taxValue = parseNumber(payload.tax)
  const totalValue = parseNumber(payload.total)

  const subtotal = subtotalValue ?? subtotalFromItems
  const tax = taxValue ?? 0
  const total = totalValue ?? subtotal + tax

  const rawCategory = typeof payload.category === 'string' ? payload.category.trim() : ''
  const category = RECEIPT_CATEGORIES.includes(rawCategory as ReceiptCategory)
    ? (rawCategory as ReceiptCategory)
    : 'Other'

  return {
    merchant: typeof payload.merchant === 'string' ? payload.merchant : 'Unknown Merchant',
    date: typeof payload.date === 'string' ? payload.date : '',
    items,
    subtotal,
    tax,
    total,
    category,
  }
}

const requestOpenAI = async ({ base64, settings }: AnalyzeArgs) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model || DEFAULT_MODELS.openai,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: buildReceiptPrompt() },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
              },
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`OpenAI request failed: ${response.status} ${errorBody}`)
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenAI response did not include content.')
  return content
}

const requestAnthropic = async ({ base64, settings }: AnalyzeArgs) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': settings.apiKey,
    },
    body: JSON.stringify({
      model: settings.model || DEFAULT_MODELS.anthropic,
      max_tokens: 1024,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64,
              },
            },
            { type: 'text', text: buildReceiptPrompt() },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Anthropic request failed: ${response.status} ${errorBody}`)
  }

  const data = (await response.json()) as { content?: Array<{ text?: string }> }
  const content = data.content?.[0]?.text
  if (!content) throw new Error('Anthropic response did not include content.')
  return content
}

const requestGemini = async ({ base64, settings }: AnalyzeArgs) => {
  const model = settings.model || DEFAULT_MODELS.gemini
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: buildReceiptPrompt() },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    }
  )

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Gemini request failed: ${response.status} ${errorBody}`)
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) throw new Error('Gemini response did not include content.')
  return content
}

export const analyzeReceipt = async ({ base64, settings }: AnalyzeArgs) => {
  if (!settings.apiKey) throw new Error('Missing API key for receipt processing.')

  let rawText = ''
  if (settings.provider === 'openai') {
    rawText = await requestOpenAI({ base64, settings })
  } else if (settings.provider === 'anthropic') {
    rawText = await requestAnthropic({ base64, settings })
  } else {
    rawText = await requestGemini({ base64, settings })
  }

  const parsed = parseJsonFromText(rawText)
  return normalizeReceipt(parsed as Record<string, unknown>)
}
