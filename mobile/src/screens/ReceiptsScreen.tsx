import { useState } from 'react'
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { formatCurrency, formatDate, theme, type Receipt } from '@receiptly/shared'
import { CategoryBadge } from '../components/CategoryBadge'
import { commonStyles } from '../styles'

type ReceiptsScreenProps = {
  receipts: Receipt[]
}

export const ReceiptsScreen = ({ receipts }: ReceiptsScreenProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <View style={commonStyles.screen}>
      <Text style={commonStyles.heading}>Receipts</Text>
      <Text style={[commonStyles.subheading, styles.subtitle]}>
        Review your captured receipts and line items.
      </Text>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No receipts captured yet.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const expanded = expandedId === item.id
          return (
            <Pressable
              style={styles.card}
              onPress={() => setExpandedId(expanded ? null : item.id)}
            >
              <View style={styles.rowHeader}>
                <View>
                  <Text style={styles.merchant}>{item.merchant}</Text>
                  <Text style={styles.date}>{formatDate(item.date || item.createdAt)}</Text>
                </View>
                <View style={styles.rightMeta}>
                  <CategoryBadge category={item.category} />
                  <Text style={styles.total}>{formatCurrency(item.total)}</Text>
                </View>
              </View>
              {expanded && (
                <View style={styles.detail}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Subtotal</Text>
                    <Text style={styles.detailValue}>{formatCurrency(item.subtotal)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tax</Text>
                    <Text style={styles.detailValue}>{formatCurrency(item.tax)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total</Text>
                    <Text style={styles.detailValue}>{formatCurrency(item.total)}</Text>
                  </View>
                  <View style={styles.itemsList}>
                    {item.items.map((line, index) => (
                      <View key={`${line.name}-${index}`} style={styles.itemRow}>
                        <Text style={styles.itemName}>{line.name}</Text>
                        <Text style={styles.itemPrice}>{formatCurrency(line.price)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </Pressable>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  merchant: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  date: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  rightMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  total: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  detail: {
    marginTop: 14,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: theme.colors.muted,
  },
  detailValue: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  itemsList: {
    marginTop: 6,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius.sm,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.sm,
  },
  itemName: {
    color: theme.colors.text,
  },
  itemPrice: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  emptyState: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.muted,
  },
})
