"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { getInitials, formatDate } from "@/lib/utils"

export default function StaffCard({ member, onDelete, onToggleActive }) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {getInitials(member.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {member.email}
            </p>
          </div>
          <Badge variant={member.isActive ? "default" : "secondary"}>
            {member.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          Joined {formatDate(member.createdAt)}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              checked={member.isActive}
              onCheckedChange={(v) => onToggleActive(member._id, v)}
            />
            <span className="text-xs text-muted-foreground">
              {member.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Remove Staff Member?"
        description={`${member.name} will lose access to the system.`}
        confirmText="Remove"
        onConfirm={() => {
          onDelete(member._id)
          setShowConfirm(false)
        }}
      />
    </>
  )
}