"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"

const schema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  capacity: z.coerce.number().min(1, "Minimum capacity is 1").max(20),
})

export default function TableForm({ onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { capacity: 4 },
  })

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Add New Table</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Table Number</Label>
            <Input placeholder="e.g. 1, A1, T01" {...register("tableNumber")} />
            {errors.tableNumber && (
              <p className="text-xs text-destructive">
                {errors.tableNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Capacity</Label>
            <Input
              type="number"
              min={1}
              max={20}
              {...register("capacity")}
            />
            {errors.capacity && (
              <p className="text-xs text-destructive">
                {errors.capacity.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Table & QR
          </Button>
        </div>
      </form>
    </div>
  )
}