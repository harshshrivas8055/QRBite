"use client"

import { useState, useEffect } from "react"
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isWithinRadius } from "@/lib/geolocation"
import { cn } from "@/lib/utils"

export default function LocationGate({
  restaurant,
  onAllowed,
  onDenied,
}) {
  const [status, setStatus] = useState("idle")
  // idle | requesting | checking | allowed | denied | error | unsupported

  const { location } = restaurant
  const radiusMeters = location?.radius || 100

  useEffect(() => {
    // If restaurant doesn't enforce location, allow immediately
    if (!location?.enforceLocation) {
      onAllowed()
      return
    }

    // If no coordinates set, allow immediately
    if (!location?.latitude || !location?.longitude) {
      onAllowed()
      return
    }

    // Auto request on mount
    requestLocation()
  }, [])

  function requestLocation() {
    if (!navigator.geolocation) {
      setStatus("unsupported")
      onDenied()
      return
    }

    setStatus("requesting")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus("checking")
        const { latitude, longitude } = position.coords

        const { allowed, distance } = isWithinRadius(
          latitude,
          longitude,
          location.latitude,
          location.longitude,
          radiusMeters
        )

        if (allowed) {
          setStatus("allowed")
          setTimeout(() => onAllowed(), 800)
        } else {
          setStatus("denied")
          onDenied()
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setStatus("error")
        onDenied()
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }

  // Don't render if not enforcing
  if (!location?.enforceLocation) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm space-y-6 text-center">

        {/* Icon */}
        <div
          className={cn(
            "inline-flex h-20 w-20 items-center justify-center rounded-full mx-auto",
            status === "allowed" && "bg-green-100",
            status === "denied" && "bg-red-100",
            status === "error" && "bg-orange-100",
            status === "unsupported" && "bg-gray-100",
            ["idle", "requesting", "checking"].includes(status) && "bg-primary/10"
          )}
        >
          {status === "allowed" && (
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          )}
          {status === "denied" && (
            <AlertCircle className="h-10 w-10 text-red-500" />
          )}
          {status === "error" && (
            <AlertCircle className="h-10 w-10 text-orange-500" />
          )}
          {status === "unsupported" && (
            <AlertCircle className="h-10 w-10 text-gray-500" />
          )}
          {["idle", "requesting", "checking"].includes(status) && (
            status === "idle"
              ? <MapPin className="h-10 w-10 text-primary" />
              : <Loader2 className="h-10 w-10 text-primary animate-spin" />
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          {status === "idle" && (
            <>
              <h2 className="text-xl font-bold">Location Required</h2>
              <p className="text-sm text-muted-foreground">
                {restaurant.name} requires you to be inside
                the restaurant to place an order.
              </p>
            </>
          )}
          {status === "requesting" && (
            <>
              <h2 className="text-xl font-bold">Requesting Location</h2>
              <p className="text-sm text-muted-foreground">
                Please allow location access when your browser asks.
              </p>
            </>
          )}
          {status === "checking" && (
            <>
              <h2 className="text-xl font-bold">Verifying Location</h2>
              <p className="text-sm text-muted-foreground">
                Checking if you are inside the restaurant...
              </p>
            </>
          )}
          {status === "allowed" && (
            <>
              <h2 className="text-xl font-bold text-green-600">
                You are inside! ✅
              </h2>
              <p className="text-sm text-muted-foreground">
                Taking you to the menu...
              </p>
            </>
          )}
          {status === "denied" && (
            <>
              <h2 className="text-xl font-bold text-red-600">
                Outside Restaurant
              </h2>
              <p className="text-sm text-muted-foreground">
                You must be inside {restaurant.name} to place an order.
                Please visit us and try again!
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Allowed radius: {radiusMeters}m from restaurant
              </p>
            </>
          )}
          {status === "error" && (
            <>
              <h2 className="text-xl font-bold">Location Error</h2>
              <p className="text-sm text-muted-foreground">
                Could not get your location. Please enable location
                access in your browser settings and try again.
              </p>
            </>
          )}
          {status === "unsupported" && (
            <>
              <h2 className="text-xl font-bold">Not Supported</h2>
              <p className="text-sm text-muted-foreground">
                Your browser does not support location services.
                Please use a modern browser to order.
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        {status === "idle" && (
          <Button className="w-full" onClick={requestLocation}>
            <MapPin className="h-4 w-4 mr-2" />
            Allow Location Access
          </Button>
        )}
        {(status === "error" || status === "denied") && (
          <Button
            variant="outline"
            className="w-full"
            onClick={requestLocation}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}

        {/* Restaurant info */}
        <p className="text-xs text-muted-foreground">
          📍 {restaurant.name}
          {restaurant.address && ` • ${restaurant.address}`}
        </p>
      </div>
    </div>
  )
}