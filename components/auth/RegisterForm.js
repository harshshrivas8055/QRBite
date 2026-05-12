"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Mail } from "lucide-react"
import toast from "react-hot-toast"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  restaurantName: z.string().min(2, "Restaurant name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    setLoading(true)
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      // Show verify email screen instead of redirecting to login
      setRegisteredEmail(data.email)
      setRegistered(true)
    } catch (error) {
      toast.error(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  // Show success state after registration
  if (registered) {
    return (
      <div className="text-center space-y-4 py-2">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Check your email!</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent a verification link to
          </p>
          <p className="font-semibold text-sm">{registeredEmail}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Click the link in the email to verify your account
            and activate your restaurant.
          </p>
        </div>
        <div className="bg-muted rounded-xl p-3 text-xs text-muted-foreground space-y-1">
          <p>⏱ Link expires in 24 hours</p>
          <p>📁 Check your spam folder if you don't see it</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Your Name</Label>
          <Input placeholder="John Doe" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Restaurant Name</Label>
          <Input
            placeholder="My Restaurant"
            {...register("restaurantName")}
          />
          {errors.restaurantName && (
            <p className="text-xs text-destructive">
              {errors.restaurantName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="you@restaurant.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Phone (optional)</Label>
        <Input placeholder="+91 98765 43210" {...register("phone")} />
      </div>

      <div className="space-y-2">
        <Label>Address (optional)</Label>
        <Input placeholder="Restaurant address" {...register("address")} />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Create Restaurant
      </Button>
    </form>
  )
}