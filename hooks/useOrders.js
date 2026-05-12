"use client"

import { useState, useEffect, useCallback } from "react"

export function useOrders(filters = {}) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filters.status) params.set("status", filters.status)
      if (filters.limit) params.set("limit", filters.limit)

      const res = await fetch(`/api/orders?${params.toString()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setOrders(data.orders)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.limit])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status } : o))
    )
  }, [])

  const addOrder = useCallback((order) => {
    setOrders((prev) => {
      const exists = prev.find((o) => o._id === order._id)
      if (exists) return prev
      return [order, ...prev]
    })
  }, [])

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
    addOrder,
  }
}