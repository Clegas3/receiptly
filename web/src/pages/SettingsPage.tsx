import {
  DEFAULT_MODELS,
  PROVIDERS,
  type AIProvider,
  type AISettings,
} from '@receiptly/shared'

type SettingsPageProps = {
  settings: AISettings
  onChange: (settings: AISettings) => void
}

export const SettingsPage = ({ settings, onChange }: SettingsPageProps) => {
  const handleProviderChange = (value: AIProvider) => {
    onChange({
      ...settings,
      provider: value,
      model: DEFAULT_MODELS[value],
    })
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Configure your AI provider and API key.</p>
        </div>
      </header>
      <div className="settings-grid">
        <label>
          Provider
          <select
            value={settings.provider}
            onChange={(event) => handleProviderChange(event.target.value as AIProvider)}
          >
            {PROVIDERS.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Model
          <input
            type="text"
            value={settings.model}
            onChange={(event) => onChange({ ...settings, model: event.target.value })}
            placeholder={DEFAULT_MODELS[settings.provider]}
          />
        </label>
        <label>
          API key
          <input
            type="password"
            value={settings.apiKey}
            onChange={(event) => onChange({ ...settings, apiKey: event.target.value })}
            placeholder="sk-..."
          />
        </label>
      </div>
      <div className="settings-note">
        Credentials are stored locally in your browser for this device.
      </div>
    </div>
  )
}
