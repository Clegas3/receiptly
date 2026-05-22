import { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { analyzeReceipt, theme, type AISettings, type ReceiptDraft } from '@receiptly/shared'
import { commonStyles } from '../styles'

type ScanScreenProps = {
  settings: AISettings
  onReceipt: (receipt: ReceiptDraft) => void
}

export const ScanScreen = ({ settings, onReceipt }: ScanScreenProps) => {
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUri, setPreviewUri] = useState<string | null>(null)
  const focusGuard = useRef(false)

  const openCamera = useCallback(async () => {
    if (processing) return
    setError(null)

    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      setError('Camera permission is required to scan receipts.')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.8,
    })

    if (result.canceled) return

    const asset = result.assets?.[0]
    if (!asset?.base64) {
      setError('Unable to read the receipt image.')
      return
    }

    setPreviewUri(asset.uri)

    if (!settings.apiKey) {
      setError('Add your API key in Settings before scanning.')
      return
    }

    setProcessing(true)
    try {
      const draft = await analyzeReceipt({ base64: asset.base64, settings })
      onReceipt(draft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed. Try again.')
    } finally {
      setProcessing(false)
    }
  }, [onReceipt, processing, settings])

  useFocusEffect(
    useCallback(() => {
      if (!focusGuard.current) {
        focusGuard.current = true
        void openCamera()
      }
      return () => {
        focusGuard.current = false
      }
    }, [openCamera])
  )

  return (
    <View style={commonStyles.screen}>
      <Text style={commonStyles.heading}>Scan</Text>
      <Text style={[commonStyles.subheading, styles.subtitle]}>
        Capture a receipt and let AI extract the details.
      </Text>
      <View style={styles.card}>
        {previewUri ? (
          <Image source={{ uri: previewUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Camera preview</Text>
          </View>
        )}
        {processing && <ActivityIndicator color={theme.colors.accent} size="large" />}
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable style={styles.button} onPress={() => void openCamera()}>
          <Text style={styles.buttonText}>Scan another receipt</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: 16,
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: 220,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  placeholder: {
    width: '100%',
    height: 220,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: theme.colors.muted,
  },
  error: {
    color: theme.colors.danger,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: '600',
  },
})
