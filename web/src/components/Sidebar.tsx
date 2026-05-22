export type NavKey = 'dashboard' | 'receipts' | 'scan' | 'settings'

type SidebarProps = {
  active: NavKey
  onNavigate: (key: NavKey) => void
}

const navItems: Array<{ key: NavKey; label: string; description: string }> = [
  { key: 'dashboard', label: 'Dashboard', description: 'Spend overview' },
  { key: 'receipts', label: 'Receipts', description: 'Track every receipt' },
  { key: 'scan', label: 'Scan', description: 'Capture new receipt' },
  { key: 'settings', label: 'Settings', description: 'Provider setup' },
]

export const Sidebar = ({ active, onNavigate }: SidebarProps) => (
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-mark">R</div>
      <div>
        <h1>Receiptly</h1>
        <p>Receipt intelligence hub</p>
      </div>
    </div>
    <nav className="nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`nav-item ${active === item.key ? 'active' : ''}`}
          onClick={() => onNavigate(item.key)}
        >
          <div>
            <span>{item.label}</span>
            <small>{item.description}</small>
          </div>
        </button>
      ))}
    </nav>
    <div className="sidebar-footer">
      <span>Dark Navy • Warm Gold</span>
    </div>
  </aside>
)
