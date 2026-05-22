import { StyleSheet } from 'react-native'
import { theme } from '@receiptly/shared'

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subheading: {
    fontSize: 14,
    color: theme.colors.muted,
  },
})
