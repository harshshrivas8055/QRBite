import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Safe number formatter
function fmt(value) {
  const num = Number(value)
  return isNaN(num) ? "0.00" : num.toFixed(2)
}

function getMonthName(month) {
  return new Date(2000, month - 1, 1).toLocaleString("en-IN", {
    month: "long",
  })
}

export function generateMonthlyReportPDF({ stats, restaurant, month, year }) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  let y = 0

  // ─── Header Bar ───────────────────────────────────
  doc.setFillColor(20, 20, 20)
  doc.rect(0, 0, pageWidth, 42, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(restaurant?.name || "Restaurant", margin, 16)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(200, 200, 200)
  doc.text("Monthly Performance Report", margin, 26)
  doc.text(
    `${getMonthName(month)} ${year}`,
    pageWidth - margin,
    16,
    { align: "right" }
  )
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-IN")}`,
    pageWidth - margin,
    26,
    { align: "right" }
  )

  y = 52

  // ─── Overview Section Title ───────────────────────
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Overview", margin, y)
  y += 7

  // ─── Summary Boxes (2x2 grid) ─────────────────────
  const boxW = (pageWidth - margin * 2 - 10) / 2
  const boxH = 20
  const summaryItems = [
    {
      label: "Total Orders",
      value: String(stats?.totalOrders ?? 0),
      color: [37, 99, 235],
    },
    {
      label: "Total Revenue",
      value: `Rs. ${fmt(stats?.totalRevenue)}`,
      color: [5, 150, 105],
    },
    {
      label: "Average Order Value",
      value: `Rs. ${fmt(stats?.avgOrderValue)}`,
      color: [217, 119, 6],
    },
    {
      label: "Total Items Sold",
      value: String(stats?.totalItemsSold ?? 0),
      color: [109, 40, 217],
    },
  ]

  summaryItems.forEach((item, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = margin + col * (boxW + 10)
    const boxY = y + row * (boxH + 6)

    // Box background
    doc.setFillColor(...item.color)
    doc.roundedRect(x, boxY, boxW, boxH, 3, 3, "F")

    // Label
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.text(item.label, x + 8, boxY + 7)

    // Value
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(item.value, x + 8, boxY + 15)
  })

  y += 2 * (boxH + 6) + 8

  // ─── Daily Breakdown ──────────────────────────────
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Daily Breakdown", margin, y)
  y += 4

  const dailyBody = (stats?.dailyData || []).map((d) => [
    d.date,
    String(d.orders),
    `Rs. ${fmt(d.revenue)}`,
    `Rs. ${d.orders > 0 ? fmt(d.revenue / d.orders) : "0.00"}`,
  ])

  autoTable(doc, {
    startY: y,
    head: [["Date", "Orders", "Revenue", "Avg Order Value"]],
    body: dailyBody.length > 0
      ? dailyBody
      : [["No data", "-", "-", "-"]],
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [0, 0, 0],
      font: "helvetica",
    },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 45, halign: "left" },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 55, halign: "right" },
      3: { cellWidth: 55, halign: "right" },
    },
    margin: { left: margin, right: margin },
  })

  y = doc.lastAutoTable.finalY + 10

  // ─── Top Selling Items ────────────────────────────
  if (y > pageHeight - 80) {
    doc.addPage()
    y = margin + 10
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Top Selling Items", margin, y)
  y += 4

  const topBody = (stats?.topItems || []).map((item, i) => [
    `${i + 1}`,
    item.name,
    String(item.quantity),
    `Rs. ${fmt(item.revenue)}`,
  ])

  autoTable(doc, {
    startY: y,
    head: [["#", "Item Name", "Qty Sold", "Revenue"]],
    body: topBody.length > 0
      ? topBody
      : [["", "No items sold this month", "", ""]],
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [0, 0, 0],
      font: "helvetica",
    },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 95, halign: "left" },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 40, halign: "right" },
    },
    margin: { left: margin, right: margin },
  })

  y = doc.lastAutoTable.finalY + 10

  // ─── Order Status Breakdown ───────────────────────
  if (y > pageHeight - 60) {
    doc.addPage()
    y = margin + 10
  }

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text("Order Status Breakdown", margin, y)
  y += 4

  const statusBody = (stats?.statusBreakdown || []).map((s) => [
    s.status,
    String(s.count),
    `${s.percentage}%`,
  ])

  autoTable(doc, {
    startY: y,
    head: [["Status", "Count", "Percentage"]],
    body: statusBody.length > 0
      ? statusBody
      : [["No data", "-", "-"]],
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: [0, 0, 0],
      font: "helvetica",
    },
    headStyles: {
      fillColor: [30, 30, 30],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 80, halign: "left" },
      1: { cellWidth: 50, halign: "center" },
      2: { cellWidth: 50, halign: "center" },
    },
    margin: { left: margin, right: margin },
  })

  // ─── Summary Footer Line ──────────────────────────
  y = doc.lastAutoTable.finalY + 10

  if (y < pageHeight - 30) {
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageWidth - margin, y)
    y += 5

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(100, 100, 100)
    doc.text(
      `Report Period: ${getMonthName(month)} ${year}  |  ` +
      `Total Orders: ${stats?.totalOrders ?? 0}  |  ` +
      `Total Revenue: Rs. ${fmt(stats?.totalRevenue)}`,
      pageWidth / 2,
      y,
      { align: "center" }
    )
  }

  // ─── Page Footer on every page ────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(160, 160, 160)
    doc.text(
      `Page ${i} of ${totalPages}   |   Powered by QRBite   |   ${restaurant?.name || ""}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    )
  }

  return doc
}

export function downloadMonthlyReport({ stats, restaurant, month, year }) {
  const doc = generateMonthlyReportPDF({ stats, restaurant, month, year })
  const name = (restaurant?.name || "Restaurant").replace(/\s+/g, "-")
  doc.save(`${name}-Report-${getMonthName(month)}-${year}.pdf`)
}
