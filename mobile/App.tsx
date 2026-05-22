import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import {
  createReceiptId,
  theme,
  type AISettings,
  type Receipt,
  type ReceiptDraft,
} from '@receiptly/shared'
import { ScanScreen } from './src/screens/ScanScreen'
import { ReceiptsScreen } from './src/screens/ReceiptsScreen'
import { SettingsScreen } from './src/screens/SettingsScreen'
import { loadReceipts, loadSettings, saveReceipts, saveSettings } from './src/storage'

const Tab = createBottomTabNavigator()

const createReceipt = (draft: ReceiptDraft): Receipt => ({
  ...draft,
  id: createReceiptId(),
  createdAt: new Date().toISOString(),
})

export default function App() {
  const [settings, setSettings] = useState<AISettings | null>(null)
  const [receipts, setReceipts] = useState<Receipt[]>([])

  useEffect(() => {
    const initialize = async () => {
      const [storedSettings, storedReceipts] = await Promise.all([
        loadSettings(),
        loadReceipts(),
      ])
      setSettings(storedSettings)
      setReceipts(storedReceipts)
    }
    void initialize()
  }, [])

  useEffect(() => {
    if (!settings) return
    void saveSettings(settings)
  }, [settings])

  useEffect(() => {
    if (!settings) return
    void saveReceipts(receipts)
  }, [receipts, settings])

  const navTheme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        primary: theme.colors.accent,
      },
    }),
    []
  )

  if (!settings) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    )
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.muted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
          },
        }}
      >
        <Tab.Screen name="Scan">
          {() => (
            <ScanScreen
              settings={settings}
              onReceipt={(draft) =>
                setReceipts((prev) => [createReceipt(draft), ...prev])
              }
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Receipts">
          {() => <ReceiptsScreen receipts={receipts} />}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {() => <SettingsScreen settings={settings} onChange={setSettings} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  )
}
