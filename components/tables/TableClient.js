"use client"

import { useState } from "react"
import { Plus, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/PageHeader"
import EmptyState from "@/components/shared/EmptyState"
import TableCard from "./TableCard"
import TableForm from "./TableForm"
import QRCodeModal from "./QRCodeModal"
import toast from "react-hot-toast"

export default function TablesClient({ tables: initialTables, restaurantId, restaurant }) {
  const [tables, setTables] = useState(initialTables)
  const [showForm, setShowForm] = useState(false)
  const [selectedQR, setSelectedQR] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate(data) {
    setLoading(true)
    try {
      const res = await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setTables((prev) => [...prev, result.table])
      setShowForm(false)
      toast.success("Table created successfully!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(tableId) {
    try {
      const res = await fetch(`/api/tables/${tableId}`, {
        method: "DELETE",
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setTables((prev) => prev.filter((t) => t._id !== tableId))
      toast.success("Table deleted!")
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleToggleActive(tableId, isActive) {
    try {
      const res = await fetch(`/api/tables/${tableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      setTables((prev) =>
        prev.map((t) => (t._id === tableId ? result.table : t))
      )
      toast.success(`Table ${isActive ? "activated" : "deactivated"}`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Tables & QR Codes"
        description={`${tables.length} table${tables.length !== 1 ? "s" : ""} total`}
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Table
          </Button>
        }
      />

      {/* Table Form */}
      {showForm && (
        <div className="mb-6">
          <TableForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        </div>
      )}

      {/* Tables Grid */}
      {tables.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title="No tables yet"
          description="Add your first table to generate a QR code"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Table
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.map((table) => (
            <TableCard
              key={table._id}
              table={table}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
              onViewQR={() => setSelectedQR(table)}
            />
          ))}
        </div>
      )}

      {/* QR Modal */}
       {selectedQR && (
      <QRCodeModal
        table={{ ...selectedQR, restaurantId }}
        restaurant={restaurant}
        open={!!selectedQR}
        onClose={() => setSelectedQR(null)}
      />
    )}
 
    </div>
  )
}