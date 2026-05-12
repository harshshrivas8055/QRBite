"use client"

import { useState } from "react"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/PageHeader"
import EmptyState from "@/components/shared/EmptyState"
import StaffCard from "./StaffCard"
import StaffForm from "./StaffForm"
import toast from "react-hot-toast"

export default function StaffClient({ staff: initialStaff }) {
  const [staff, setStaff] = useState(initialStaff)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCreate(data) {
    setLoading(true)
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setStaff((prev) => [result.staff, ...prev])
      setShowForm(false)
      toast.success("Staff member added!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(staffId) {
    try {
      const res = await fetch(`/api/staff/${staffId}`, { method: "DELETE" })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setStaff((prev) => prev.filter((s) => s._id !== staffId))
      toast.success("Staff member removed!")
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleToggleActive(staffId, isActive) {
    try {
      const res = await fetch(`/api/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setStaff((prev) =>
        prev.map((s) => (s._id === staffId ? result.staff : s))
      )
      toast.success(`Staff ${isActive ? "activated" : "deactivated"}`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Staff Management"
        description={`${staff.length} staff member${staff.length !== 1 ? "s" : ""}`}
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        }
      />

      {showForm && (
        <div className="mb-6">
          <StaffForm
            onSubmit={handleCreate}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        </div>
      )}

      {staff.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No staff members yet"
          description="Add staff who can manage the kitchen screen"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <StaffCard
              key={member._id}
              member={member}
              onDelete={handleDelete}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      )}
    </div>
  )
}