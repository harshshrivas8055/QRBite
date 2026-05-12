"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  UtensilsCrossed,
  QrCode,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  LogOut,
  ChefHat,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/tables", label: "Tables & QR", icon: QrCode },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/stats", label: "Statistics", icon: BarChart3 },
  { href: "/stats/report", label: "Monthly Report", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
]

// Check if a nav item is active
// Uses exact match for parent routes that have children
// to prevent /stats matching when /stats/report is active
function isNavActive(href, pathname) {
  // Exact match always works
  if (pathname === href) return true

  // For /stats specifically — only active on exact /stats
  // NOT when /stats/report is open
  if (href === "/stats") {
    return pathname === "/stats"
  }

  // For all other routes — active if pathname starts with href
  return pathname.startsWith(href + "/")
}

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <ChefHat className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">{APP_NAME}</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = isNavActive(href, pathname)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t px-3 py-4 space-y-3">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            {getInitials(session?.user?.name || "U")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}