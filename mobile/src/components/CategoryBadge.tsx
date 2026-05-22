import { StyleSheet, Text, View } from 'react-native'
import { categoryColors, theme, type ReceiptCategory } from '@receiptly/shared'

type CategoryBadgeProps = {
  category: ReceiptCategory
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => (
  <View style={[styles.badge, { backgroundColor: categoryColors[category] }]}>
    <Text style={styles.text}>{category}</Text>
  </View>
)

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    color: theme.colors.background,
    fontWeight: '600',
    fontSize: 12,
  },
})
