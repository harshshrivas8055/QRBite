"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"

export default function QRCodeModal({ table, restaurant, open, onClose }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  const menuUrl = `${appUrl}/menu/${table.restaurantId}/${table.tableNumber}`

  async function handleDownload() {
    // Create a canvas to compose the full PNG with logo + details
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const padding = 40
    const qrSize = 300
    const logoSize = 80
    const canvasWidth = qrSize + padding * 2
    const canvasHeight = 560

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // White background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    let currentY = padding

    // Draw restaurant logo if available
    if (restaurant?.logo) {
      await new Promise((resolve) => {
        const logoImg = new Image()
        logoImg.crossOrigin = "anonymous"
        logoImg.onload = () => {
          // Draw circular logo
          ctx.save()
          ctx.beginPath()
          ctx.arc(
            canvasWidth / 2,
            currentY + logoSize / 2,
            logoSize / 2,
            0,
            Math.PI * 2
          )
          ctx.clip()
          ctx.drawImage(
            logoImg,
            canvasWidth / 2 - logoSize / 2,
            currentY,
            logoSize,
            logoSize
          )
          ctx.restore()
          resolve()
        }
        logoImg.onerror = resolve // skip logo if fails
        logoImg.src = restaurant.logo
      })
      currentY += logoSize + 16
    }

    // Restaurant name
    ctx.fillStyle = "#111111"
    ctx.font = "bold 20px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(restaurant?.name || "Restaurant", canvasWidth / 2, currentY)
    currentY += 32

    // Divider line
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, currentY)
    ctx.lineTo(canvasWidth - padding, currentY)
    ctx.stroke()
    currentY += 24

    // Draw QR code
    await new Promise((resolve) => {
      const qrImg = new Image()
      qrImg.onload = () => {
        ctx.drawImage(
          qrImg,
          padding,
          currentY,
          qrSize,
          qrSize
        )
        resolve()
      }
      qrImg.src = table.qrCode
    })
    currentY += qrSize + 24

    // Divider line
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, currentY)
    ctx.lineTo(canvasWidth - padding, currentY)
    ctx.stroke()
    currentY += 20

    // Table label
    ctx.fillStyle = "#111111"
    ctx.font = "bold 18px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`Table ${table.tableNumber}`, canvasWidth / 2, currentY)
    currentY += 28

    // Menu URL — wrap if too long
    ctx.fillStyle = "#6b7280"
    ctx.font = "11px sans-serif"
    ctx.textAlign = "center"

    const maxWidth = canvasWidth - padding * 2
    const words = menuUrl.split("/")
    let line = ""
    const lines = []

    for (let i = 0; i < words.length; i++) {
      const testLine = line + (line ? "/" : "") + words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line !== "") {
        lines.push(line)
        line = words[i]
      } else {
        line = testLine
      }
    }
    lines.push(line)

    lines.forEach((l) => {
      ctx.fillText(l, canvasWidth / 2, currentY)
      currentY += 16
    })

    // Download the canvas as PNG
    const link = document.createElement("a")
    link.download = `Table-${table.tableNumber}-QR.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Table {table.tableNumber} — QR Code
          </DialogTitle>
          <DialogDescription>
            Scan or preview the public menu link for this table.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">

          {/* Restaurant logo */}
          {restaurant?.logo && (
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="h-14 w-14 rounded-full object-cover border"
            />
          )}

          {/* Restaurant name */}
          {restaurant?.name && (
            <p className="text-sm font-semibold text-muted-foreground">
              {restaurant.name}
            </p>
          )}

          {/* QR Code */}
          <div className="rounded-xl border p-4 bg-white">
            <img
              src={table.qrCode}
              alt={`QR Code for Table ${table.tableNumber}`}
              className="h-48 w-48"
            />
          </div>

          {/* Table info */}
          <div className="text-center space-y-1 w-full">
            <p className="font-semibold">Table {table.tableNumber}</p>
            <p className="text-xs text-muted-foreground break-all">{menuUrl}</p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full">
            <Button className="flex-1" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(menuUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}