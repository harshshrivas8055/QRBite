"use client"

import { useEffect, useRef } from "react"

export function useSSE(restaurantId, eventHandlers) {
  const eventSourceRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const handlersRef = useRef(eventHandlers)
  const MAX_RECONNECT_ATTEMPTS = 5

  // Keep handlers ref always up to date without causing reconnect
  useEffect(() => {
    handlersRef.current = eventHandlers
  })

  useEffect(() => {
    if (!restaurantId) return

    function connect() {
      const url = `/api/orders/stream?restaurantId=${restaurantId}`
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log("✅ SSE connected for restaurant:", restaurantId)
        reconnectAttempts.current = 0
      }

      // Fixed list of known event names — avoids dynamic addEventListener
      // which caused the "useEffect size changed" warning
      const knownEvents = ["new_order", "order_status_update", "connected", "ping",]

      knownEvents.forEach((eventName) => {
        eventSource.addEventListener(eventName, (e) => {
          try {
            const data = JSON.parse(e.data)
            // Always read from ref so we get latest handler
            const handler = handlersRef.current[eventName]
            if (handler) handler(data)
          } catch (err) {
            console.error("SSE parse error:", err)
          }
        })
      })

      eventSource.onerror = () => {
        console.log("SSE error — closing connection")
        eventSource.close()
        eventSourceRef.current = null

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current),
            30000
          )
          reconnectAttempts.current += 1
          console.log(
            `SSE reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`
          )
          reconnectTimeoutRef.current = setTimeout(connect, delay)
        } else {
          console.log("SSE max reconnect attempts reached")
        }
      }
    }

    connect()

    return () => {
      eventSourceRef.current?.close()
      clearTimeout(reconnectTimeoutRef.current)
    }
  }, [restaurantId]) // ← only restaurantId, never the handlers object
}