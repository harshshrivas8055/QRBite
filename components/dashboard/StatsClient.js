"use client"

import Link from "next/link"
import PageHeader from "@/components/shared/PageHeader"
import { Button } from "@/components/ui/button"
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
import { formatCurrency } from "@/lib/utils"
import { FileText, TrendingUp } from "lucide-react"

export default function StatsClient({
  chartData,
  totalOrders,
  totalRevenue,
  topItems,
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistics"
        description="Last 7 days performance overview"
        action={
          <Button asChild>
            <Link href="/stats/report">
              <FileText className="h-4 w-4 mr-2" />
              Monthly Report
            </Link>
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Orders (7 days)</p>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="rounded-xl border bg-card p-5 space-y-1">
          <p className="text-sm text-muted-foreground">Revenue (7 days)</p>
          <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No data available for the last 7 days
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Orders will appear here once customers start ordering
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Chart */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Daily Orders</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [value, "Orders"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Chart */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">Daily Revenue</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Items */}
          {topItems?.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-4">
                Top Selling Items (Last 7 Days)
              </h3>
              <div className="space-y-3">
                {topItems.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
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
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{
                            width: `${
                              (item.quantity / topItems[0].quantity) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Monthly Report CTA */}
      <div className="rounded-xl border bg-card p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Monthly Report</p>
          <p className="text-sm text-muted-foreground">
            Generate a full PDF report with revenue, top items and daily
            breakdown for any month
          </p>
        </div>
        <Button asChild className="flex-shrink-0">
          <Link href="/stats/report">
            <FileText className="h-4 w-4 mr-2" />
            Generate
          </Link>
        </Button>
      </div>
    </div>
  )
}