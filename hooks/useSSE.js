"use client"

import { useEffect, useRef } from "react"

export function useSSE(restaurantId, eventHandlers) {
  const eventSourceRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const handlersRef = useRef(eventHandlers)
  const isMountedRef = useRef(true)
  const MAX_RECONNECT_ATTEMPTS = 5
  const BASE_DELAY = 3000 // start at 3 seconds not 1 second

  // Keep handlers ref always up to date
  useEffect(() => {
    handlersRef.current = eventHandlers
  })

  useEffect(() => {
    if (!restaurantId) return

    isMountedRef.current = true

    function connect() {
      // Stop if component unmounted
      if (!isMountedRef.current) return

      // Stop if max attempts reached
      if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
        console.log("SSE max reconnect attempts reached — stopped")
        return
      }

      // Close existing connection first
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }

      const url = `/api/orders/stream?restaurantId=${restaurantId}`

      let eventSource
      try {
        eventSource = new EventSource(url)
        eventSourceRef.current = eventSource
      } catch (err) {
        console.error("SSE failed to create EventSource:", err)
        return
      }

      eventSource.onopen = () => {
        if (!isMountedRef.current) return
        console.log("✅ SSE connected")
        reconnectAttempts.current = 0
      }

      const knownEvents = [
        "new_order",
        "order_status_update",
        "connected",
      ]

      knownEvents.forEach((eventName) => {
        eventSource.addEventListener(eventName, (e) => {
          if (!isMountedRef.current) return
          try {
            const data = JSON.parse(e.data)
            const handler = handlersRef.current[eventName]
            if (handler) handler(data)
          } catch (err) {
            console.error("SSE parse error:", err)
          }
        })
      })

      eventSource.onerror = () => {
        if (!isMountedRef.current) return

        eventSource.close()
        eventSourceRef.current = null

        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          // Exponential backoff starting at 3s
          // 3s, 6s, 12s, 24s, 48s
          const delay = Math.min(
            BASE_DELAY * Math.pow(2, reconnectAttempts.current),
            60000 // max 60 seconds
          )
          reconnectAttempts.current += 1
          console.log(
            `SSE reconnecting in ${delay / 1000}s ` +
            `(attempt ${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`
          )
          reconnectTimeoutRef.current = setTimeout(connect, delay)
        } else {
          console.log("SSE stopped — too many failures")
        }
      }
    }

    connect()

    return () => {
      isMountedRef.current = false
      eventSourceRef.current?.close()
      eventSourceRef.current = null
      clearTimeout(reconnectTimeoutRef.current)
    }
  }, [restaurantId])
}