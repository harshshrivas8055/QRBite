"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Store,
  LogOut,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils"

const navItems = [
  { href: "/super-admin", label: "Overview", icon: LayoutDashboard },
  { href: "/super-admin/restaurants", label: "Restaurants", icon: Store },
]

export default function SuperAdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold">{APP_NAME}</span>
          <p className="text-xs text-muted-foreground">Super Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/super-admin" && pathname.startsWith(href))
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

      {/* User */}
      <div className="border-t px-3 py-4 space-y-3">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 text-destructive text-xs font-bold">
            {getInitials(session?.user?.name || "SA")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name}
            </p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
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