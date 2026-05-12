"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import ImageUpload from "@/components/shared/ImageUpload"
import PageHeader from "@/components/shared/PageHeader"
import ThemeSelector from "@/components/public-menu/themes/ThemeSelector"
import { Loader2, MapPin, Navigation, CheckCircle2, Palette } from "lucide-react"
import toast from "react-hot-toast"

const schema = z.object({
  name: z.string().min(2, "Restaurant name is required"),
  description: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  currency: z.string().default("INR"),
  theme: z.string().default("classic"),
  settings: z.object({
    acceptingOrders: z.boolean().default(true),
    taxPercentage: z.coerce.number().min(0).max(100).default(0),
    serviceCharge: z.coerce.number().min(0).max(100).default(0),
  }),
  location: z.object({
    enforceLocation: z.boolean().default(false),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),
    radius: z.coerce.number().min(10).max(5000).default(100),
  }),
})

export default function SettingsClient({ restaurant }) {
  const [logo, setLogo] = useState(restaurant.logo || null)
  const [loading, setLoading] = useState(false)
  const [detectingLocation, setDetectingLocation] = useState(false)
  const [locationDetected, setLocationDetected] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description || "",
      phone: restaurant.phone || "",
      address: restaurant.address || "",
      currency: restaurant.currency || "INR",
      theme: restaurant.theme || "classic",
      settings: {
        acceptingOrders: restaurant.settings?.acceptingOrders ?? true,
        taxPercentage: restaurant.settings?.taxPercentage ?? 0,
        serviceCharge: restaurant.settings?.serviceCharge ?? 0,
      },
      location: {
        enforceLocation: restaurant.location?.enforceLocation ?? false,
        latitude: restaurant.location?.latitude ?? null,
        longitude: restaurant.location?.longitude ?? null,
        radius: restaurant.location?.radius ?? 100,
      },
    },
  })

  const acceptingOrders = watch("settings.acceptingOrders")
  const enforceLocation = watch("location.enforceLocation")
  const latitude = watch("location.latitude")
  const longitude = watch("location.longitude")
  const currentTheme = watch("theme")

  function handleDetectLocation() {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setDetectingLocation(true)
    setLocationDetected(false)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setValue("location.latitude", parseFloat(latitude.toFixed(6)))
        setValue("location.longitude", parseFloat(longitude.toFixed(6)))
        setDetectingLocation(false)
        setLocationDetected(true)
        toast.success("Location detected successfully!")
      },
      (error) => {
        setDetectingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied.")
            break
          case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable. Try again.")
            break
          case error.TIMEOUT:
            toast.error("Location request timed out.")
            break
          default:
            toast.error("Could not detect location.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  async function onSubmit(data) {
    setLoading(true)
    try {
      const res = await fetch(`/api/restaurants/${restaurant._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, logo }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      toast.success("Settings saved!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Restaurant Settings"
        description="Manage your restaurant details and preferences"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Logo */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="font-semibold">Restaurant Logo</h3>
          <ImageUpload value={logo} onChange={setLogo} />
        </div>

        {/* Basic Info */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="font-semibold">Basic Information</h3>
          <div className="space-y-2">
            <Label>Restaurant Name</Label>
            <Input {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea rows={3} {...register("description")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+91 98765 43210" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input placeholder="INR" {...register("currency")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea rows={2} {...register("address")} />
          </div>
        </div>

        {/* Menu Theme */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Menu Theme</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Choose a theme for your public menu page that customers will see.
          </p>
          <ThemeSelector
            value={currentTheme}
            onChange={(theme) => setValue("theme", theme)}
          />
        </div>

        {/* Order Settings */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="font-semibold">Order Settings</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Accepting Orders</p>
              <p className="text-xs text-muted-foreground">
                Turn off to pause all incoming orders
              </p>
            </div>
            <Switch
              checked={acceptingOrders}
              onCheckedChange={(v) => setValue("settings.acceptingOrders", v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tax Percentage (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...register("settings.taxPercentage")}
              />
            </div>
            <div className="space-y-2">
              <Label>Service Charge (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...register("settings.serviceCharge")}
              />
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Location-Based Ordering</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enforce Location</p>
              <p className="text-xs text-muted-foreground">
                Customers must be inside your restaurant to place orders
              </p>
            </div>
            <Switch
              checked={enforceLocation}
              onCheckedChange={(v) => setValue("location.enforceLocation", v)}
            />
          </div>

          {enforceLocation && (
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-2">
                <Label>Restaurant GPS Coordinates</Label>
                <p className="text-xs text-muted-foreground">
                  Click while inside your restaurant to set location.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                >
                  {detectingLocation ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Detecting...
                    </>
                  ) : locationDetected || (latitude && longitude) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      Location Set — Click to Update
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4 mr-2" />
                      Detect My Location
                    </>
                  )}
                </Button>
              </div>

              {latitude && longitude && (
                <div className="bg-muted rounded-xl p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Current Coordinates
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Latitude</Label>
                      <Input
                        type="number"
                        step="any"
                        className="text-xs h-8"
                        {...register("location.latitude")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Longitude</Label>
                      <Input
                        type="number"
                        step="any"
                        className="text-xs h-8"
                        {...register("location.longitude")}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Allowed Radius</Label>
                  <span className="text-xs text-muted-foreground">
                    {watch("location.radius")}m
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  step={10}
                  className="w-full accent-primary"
                  {...register("location.radius")}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10m (strict)</span>
                  <span>100m (recommended)</span>
                  <span>500m (loose)</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  💡 Customers outside the allowed radius cannot place orders.
                  Set <strong>50-100m</strong> for best indoor results.
                </p>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Settings
        </Button>
      </form>
    </div>
  )
}