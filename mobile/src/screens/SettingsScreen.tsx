import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import {
  DEFAULT_MODELS,
  PROVIDERS,
  theme,
  type AIProvider,
  type AISettings,
} from '@receiptly/shared'
import { commonStyles } from '../styles'

type SettingsScreenProps = {
  settings: AISettings
  onChange: (settings: AISettings) => void
}

export const SettingsScreen = ({ settings, onChange }: SettingsScreenProps) => {
  const handleProviderChange = (value: AIProvider) => {
    onChange({
      ...settings,
      provider: value,
      model: DEFAULT_MODELS[value],
    })
  }

  return (
    <ScrollView style={commonStyles.screen} contentContainerStyle={styles.content}>
      <Text style={commonStyles.heading}>Settings</Text>
      <Text style={[commonStyles.subheading, styles.subtitle]}>
        Configure the AI provider and credentials used for scans.
      </Text>
      <View style={styles.field}>
        <Text style={styles.label}>Provider</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={settings.provider}
            onValueChange={(value) => handleProviderChange(value as AIProvider)}
            dropdownIconColor={theme.colors.text}
            style={styles.picker}
          >
            {PROVIDERS.map((provider) => (
              <Picker.Item
                key={provider.value}
                label={provider.label}
                value={provider.value}
                color={theme.colors.text}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          value={settings.model}
          onChangeText={(value) => onChange({ ...settings, model: value })}
          placeholder={DEFAULT_MODELS[settings.provider]}
          placeholderTextColor={theme.colors.muted}
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>API Key</Text>
        <TextInput
          style={styles.input}
          value={settings.apiKey}
          onChangeText={(value) => onChange({ ...settings, apiKey: value })}
          placeholder="sk-..."
          placeholderTextColor={theme.colors.muted}
          secureTextEntry
        />
      </View>
      <Text style={styles.note}>Credentials are stored locally on this device.</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    color: theme.colors.text,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.text,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 12,
  },
})
