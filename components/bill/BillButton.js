"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function BillButton({
  order,
  restaurantId,
  variant = "outline",
  size = "sm",
  className = "",
}) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      // Fetch restaurant details for bill header
      const res = await fetch(`/api/restaurants/${restaurantId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Dynamic import to avoid SSR issues with jsPDF
      const { downloadBill } = await import("@/lib/bill")
      downloadBill({ order, restaurant: data.restaurant })

      toast.success("Bill downloaded!")
    } catch (error) {
      toast.error("Failed to generate bill")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileText className="h-4 w-4 mr-2" />
      )}
      {loading ? "Generating..." : "Download Bill"}
    </Button>
  )
}