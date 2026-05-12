import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Safe number formatter — avoids NaN and undefined crashes
function fmt(value) {
  const num = Number(value)
  return isNaN(num) ? "0.00" : num.toFixed(2)
}

export function generateBillPDF({ order, restaurant }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 297], // 80mm wide thermal, tall enough for any order
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const cx = pageWidth / 2
  const lm = 6 // left margin
  const rm = pageWidth - 6 // right margin
  let y = 8

  // ─── Restaurant Name ──────────────────────────────
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text(restaurant?.name || "Restaurant", cx, y, { align: "center" })
  y += 6

  // Address
  if (restaurant?.address) {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(restaurant.address, pageWidth - 12)
    doc.text(lines, cx, y, { align: "center" })
    y += lines.length * 4
  }

  // Phone
  if (restaurant?.phone) {
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(80, 80, 80)
    doc.text(`Tel: ${restaurant.phone}`, cx, y, { align: "center" })
    y += 5
  }

  // ─── Divider ──────────────────────────────────────
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.3)
  doc.line(lm, y, rm, y)
  y += 4

  // ─── BILL / INVOICE Title ─────────────────────────
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("BILL / INVOICE", cx, y, { align: "center" })
  y += 5

  // ─── Order Details ────────────────────────────────
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0)

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN")
    : ""
  const orderTime = order?.createdAt
    ? new Date(order.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""

  doc.text(`Order No : ${order?.orderNumber || ""}`, lm, y)
  y += 4
  doc.text(`Table     : ${order?.tableNumber || ""}`, lm, y)
  y += 4
  doc.text(`Date      : ${orderDate}`, lm, y)
  y += 4
  doc.text(`Time      : ${orderTime}`, lm, y)
  y += 4

  // ─── Divider ──────────────────────────────────────
  doc.setDrawColor(180, 180, 180)
  doc.line(lm, y, rm, y)
  y += 2

  // ─── Items Table ──────────────────────────────────
  const tableBody = (order?.items || []).map((item) => {
    const itemName = item.variantLabel
      ? `${item.name}\n(${item.variantLabel})`
      : item.name
    return [
      itemName,
      String(item.quantity),
      `Rs. ${fmt(item.price)}`,
      `Rs. ${fmt(item.price * item.quantity)}`,
    ]
  })

  autoTable(doc, {
    startY: y,
    head: [["Item", "Qty", "Rate", "Amount"]],
    body: tableBody,
    theme: "plain",
    styles: {
      fontSize: 8,
      cellPadding: { top: 2, bottom: 2, left: 2, right: 2 },
      textColor: [0, 0, 0],
      font: "helvetica",
      overflow: "linebreak",
    },
    headStyles: {
      fontStyle: "bold",
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 28, halign: "left" },
      1: { cellWidth: 8, halign: "center" },
      2: { cellWidth: 20, halign: "right" },
      3: { cellWidth: 20, halign: "right" },
    },
    margin: { left: lm, right: lm },
  })

  y = doc.lastAutoTable.finalY + 3

  // ─── Divider ──────────────────────────────────────
  doc.setDrawColor(180, 180, 180)
  doc.line(lm, y, rm, y)
  y += 4

  // ─── Totals ───────────────────────────────────────
  function totalRow(label, amount, bold = false) {
    doc.setFont("helvetica", bold ? "bold" : "normal")
    doc.setFontSize(bold ? 9 : 8)
    doc.setTextColor(0, 0, 0)
    doc.text(label, lm, y)
    doc.text(`Rs. ${fmt(amount)}`, rm, y, { align: "right" })
    y += 5
  }

  totalRow("Subtotal", order?.subtotal)

  if (Number(order?.taxAmount) > 0) {
    totalRow("Tax", order.taxAmount)
  }

  if (Number(order?.serviceChargeAmount) > 0) {
    totalRow("Service Charge", order.serviceChargeAmount)
  }

  // Total divider
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(lm, y - 1, rm, y - 1)
  doc.setLineWidth(0.3)
  y += 1

  totalRow("TOTAL AMOUNT", order?.totalAmount, true)

  // ─── Customer Note ────────────────────────────────
  if (order?.customerNote) {
    y += 2
    doc.setFontSize(8)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(80, 80, 80)
    const noteLines = doc.splitTextToSize(
      `Note: ${order.customerNote}`,
      pageWidth - 12
    )
    doc.text(noteLines, lm, y)
    y += noteLines.length * 4 + 2
  }

  // ─── Divider ──────────────────────────────────────
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.3)
  doc.line(lm, y, rm, y)
  y += 5

  // ─── Footer ───────────────────────────────────────
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("Thank you for dining with us!", cx, y, { align: "center" })
  y += 4

  doc.setFontSize(7)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(120, 120, 120)
  doc.text("Please visit us again", cx, y, { align: "center" })
  y += 4

  doc.setFontSize(6)
  doc.text("Powered by QRBite", cx, y, { align: "center" })

  return doc
}

export function downloadBill({ order, restaurant }) {
  const doc = generateBillPDF({ order, restaurant })
  doc.save(`Bill-${order?.orderNumber || "receipt"}.pdf`)
}