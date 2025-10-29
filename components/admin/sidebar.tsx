'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Dog,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  MessageSquare,
  FolderOpen,
  Tag
} from 'lucide-react'

interface SidebarProps {
  onLogout: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/admin/clients', icon: Users },
  { name: 'Pets', href: '/admin/pets', icon: Dog },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  {
    name: 'Content',
    icon: FileText,
    children: [
      { name: 'Blog Posts', href: '/admin/content/blog', icon: FileText },
      { name: 'Categories', href: '/admin/content/categories', icon: FolderOpen },
      { name: 'Tags', href: '/admin/content/tags', icon: Tag },
    ]
  },
  { name: 'Communications', href: '/admin/communications', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-border bg-card h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard" className="block">
          <h1 className="text-lg font-light">Continuum Clinic</h1>
          <p className="text-xs font-extralight text-muted-foreground mt-1">Admin Portal</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => {
          if (item.children) {
            return (
              <div key={item.name} className="mb-4">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-light text-muted-foreground">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                <div className="ml-7 space-y-1 mt-1">
                  {item.children.map((child) => {
                    const isActive = pathname === child.href
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-3 px-3 py-2 text-sm font-light rounded-md transition-colors ${
                          isActive
                            ? 'bg-foreground text-background'
                            : 'text-foreground hover:bg-muted/10'
                        }`}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          }

          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-light rounded-md transition-colors ${
                isActive
                  ? 'bg-foreground text-background'
                  : 'text-foreground hover:bg-muted/10'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm font-light rounded-md transition-colors text-foreground hover:bg-muted/10 w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
