// App Info
export const runtime = "nodejs"
export const APP_NAME = "QRBite"
export const APP_DESCRIPTION = "QR Menu Ordering System for Restaurants"


// User Roles
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
}

// Order Statuses
export const ORDER_STATUS = {
  PLACED: "PLACED",
  ACCEPTED: "ACCEPTED",
  PREPARING: "PREPARING",
  READY: "READY",
  SERVED: "SERVED",
  CANCELLED: "CANCELLED",
}

// Order status flow (in order)
export const ORDER_STATUS_FLOW = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "SERVED",
]

// Order status colors (for badges)
export const ORDER_STATUS_COLORS = {
  PLACED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-yellow-100 text-yellow-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY: "bg-green-100 text-green-700",
  SERVED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
}

// Order status labels
export const ORDER_STATUS_LABELS = {
  PLACED: "Order Placed",
  ACCEPTED: "Accepted",
  PREPARING: "Preparing",
  READY: "Ready to Serve",
  SERVED: "Served",
  CANCELLED: "Cancelled",
}

// SSE Event Types
export const SSE_EVENTS = {
  NEW_ORDER: "new_order",
  ORDER_STATUS_UPDATE: "order_status_update",
  PING: "ping",
}

// Pagination
export const DEFAULT_PAGE_SIZE = 10

// Table status
export const TABLE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
}

// Max file upload size (2MB)
export const MAX_FILE_SIZE = 2 * 1024 * 1024