"use client"

import { useState, useEffect } from "react"

export function useRestaurant() {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await window.fetch("/api/restaurants")
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setRestaurant(data.restaurant)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const updateRestaurant = (data) => {
    setRestaurant((prev) => ({ ...prev, ...data }))
  }

  return { restaurant, loading, error, updateRestaurant }
}