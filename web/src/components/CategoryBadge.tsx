import { categoryColors } from '@receiptly/shared'
import type { ReceiptCategory } from '@receiptly/shared'

type CategoryBadgeProps = {
  category: ReceiptCategory
}

export const CategoryBadge = ({ category }: CategoryBadgeProps) => (
  <span
    className="category-badge"
    style={{ backgroundColor: categoryColors[category] }}
  >
    {category}
  </span>
)
