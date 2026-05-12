"use client"

import { useState } from "react"
import { QrCode, Trash2, Users, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { cn } from "@/lib/utils"

export default function TableCard({
  table,
  onDelete,
  onToggleActive,
  onViewQR,
}) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <>
      <div
        className={cn(
          "rounded-xl border bg-card p-5 space-y-4 transition-all",
          !table.isActive && "opacity-60"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">
              {table.tableNumber}
            </span>
          </div>
          <Badge variant={table.isActive ? "default" : "secondary"}>
            {table.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Info */}
        <div>
          <p className="font-semibold">Table {table.tableNumber}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <Users className="h-3.5 w-3.5" />
            <span>Capacity: {table.capacity}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={onViewQR}
          >
            <QrCode className="h-3.5 w-3.5 mr-1.5" />
            View QR
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onToggleActive(table._id, !table.isActive)}
          >
            {table.isActive ? (
              <ToggleRight className="h-4 w-4" />
            ) : (
              <ToggleLeft className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowConfirm(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete Table?"
        description={`This will permanently delete Table ${table.tableNumber} and its QR code.`}
        confirmText="Delete"
        onConfirm={() => {
          onDelete(table._id)
          setShowConfirm(false)
        }}
      />
    </>
  )
}