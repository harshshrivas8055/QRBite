"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageHeader from "@/components/shared/PageHeader"
import {
  FileText,
  Mail,
  Loader2,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import toast from "react-hot-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
]

export default function ReportClient({ restaurant, userEmail }) {
  const currentDate = new Date()
  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const [year, setYear] = useState(currentDate.getFullYear())
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailTo, setEmailTo] = useState(userEmail)
  const [pdfLoading, setPdfLoading] = useState(false)

  async function fetchReport() {
    setLoading(true)
    setStats(null)
    try {
      const res = await fetch(
        `/api/reports/monthly?month=${month}&year=${year}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStats(data.stats)
      toast.success("Report generated!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadPDF() {
    if (!stats) return
    setPdfLoading(true)
    try {
      const { downloadMonthlyReport } = await import("@/lib/report")
      downloadMonthlyReport({ stats, restaurant, month, year })
      toast.success("Report downloaded!")
    } catch (error) {
      toast.error("Failed to generate PDF")
    } finally {
      setPdfLoading(false)
    }
  }

  async function handleEmailReport() {
    if (!stats || !emailTo) return
    setEmailLoading(true)
    try {
      const res = await fetch("/api/reports/monthly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, year, email: emailTo }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Report notification sent to ${emailTo}!`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setEmailLoading(false)
    }
  }

  const years = Array.from(
    { length: 3 },
    (_, i) => currentDate.getFullYear() - i
  )

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Monthly Report"
        description="Generate and download your monthly performance report"
      />

      {/* Month / Year Selector */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Select Period</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Month</Label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Year</Label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={fetchReport}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Report for {MONTHS[month - 1]} {year}
            </>
          )}
        </Button>
      </div>

      {/* Report Results */}
      {stats && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Orders",
                value: stats.totalOrders,
                icon: ShoppingBag,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Total Revenue",
                value: formatCurrency(stats.totalRevenue),
                icon: DollarSign,
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                label: "Avg Order Value",
                value: formatCurrency(stats.avgOrderValue),
                icon: TrendingUp,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Items Sold",
                value: stats.totalItemsSold,
                icon: Package,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border bg-card p-5 space-y-3"
              >
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Revenue Chart */}
          {stats.dailyData.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Daily Revenue</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v) => v.split(" ")[0]}
                  />
                  <YAxis
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(v) => [formatCurrency(v), "Revenue"]}
                    contentStyle={{
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Daily Orders Chart */}
          {stats.dailyData.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Daily Orders</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9 }}
                    tickFormatter={(v) => v.split(" ")[0]}
                  />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip
                    formatter={(v) => [v, "Orders"]}
                    contentStyle={{
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Items */}
          {stats.topItems.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Top Selling Items</h3>
              <div className="space-y-3">
                {stats.topItems.map((item, i) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3"
                  >
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                          <span className="text-xs text-muted-foreground">
                            {item.quantity} sold
                          </span>
                          <span className="text-sm font-semibold">
                            {formatCurrency(item.revenue)}
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${(item.quantity / stats.topItems[0].quantity) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Breakdown */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="font-semibold mb-4">Order Status Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stats.statusBreakdown.map((s) => (
                <div
                  key={s.status}
                  className="bg-muted rounded-xl p-3 text-center"
                >
                  <p className="text-xl font-bold">{s.count}</p>
                  <p className="text-xs text-muted-foreground">{s.status}</p>
                  <p className="text-xs font-medium text-primary mt-0.5">
                    {s.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions — Download + Email */}
          <div className="rounded-xl border bg-card p-5 space-y-4">
            <h3 className="font-semibold">Export Report</h3>

            {/* Download PDF */}
            <Button
              className="w-full"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF Report
                </>
              )}
            </Button>

            {/* Email Report */}
            <div className="space-y-2">
              <Label>Email Report To</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@restaurant.com"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleEmailReport}
                  disabled={emailLoading || !emailTo}
                  className="flex-shrink-0"
                >
                  {emailLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Sends a notification email with a link to download the report
              </p>
            </div>
          </div>

          {stats.totalOrders === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No orders found for {MONTHS[month - 1]} {year}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}