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
import { Loader2, X, Plus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  isVeg: z.boolean().default(true),
  isAvailable: z.boolean().default(true),
  hasVariants: z.boolean().default(false),
})

export default function MenuItemForm({ item, onSubmit, onCancel, loading }) {
  const [image, setImage] = useState(item?.image || null)
  const [variants, setVariants] = useState(
    item?.variants?.length > 0
      ? item.variants
      : []
  )
  const [newVariantLabel, setNewVariantLabel] = useState("")
  const [newVariantPrice, setNewVariantPrice] = useState("")
  const [variantError, setVariantError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || "",
      isVeg: item?.isVeg !== undefined ? item.isVeg : true,
      isAvailable: item?.isAvailable !== undefined ? item.isAvailable : true,
      hasVariants: item?.hasVariants || false,
    },
  })

  const isVeg = watch("isVeg")
  const isAvailable = watch("isAvailable")
  const hasVariants = watch("hasVariants")

  function handleAddVariant() {
    setVariantError("")

    if (!newVariantLabel.trim()) {
      setVariantError("Variant name is required")
      return
    }

    const price = parseFloat(newVariantPrice)
    if (isNaN(price) || price < 0) {
      setVariantError("Valid price is required")
      return
    }

    const exists = variants.find(
      (v) => v.label.toLowerCase() === newVariantLabel.trim().toLowerCase()
    )
    if (exists) {
      setVariantError("Variant with this name already exists")
      return
    }

    setVariants((prev) => [
      ...prev,
      { label: newVariantLabel.trim(), price },
    ])
    setNewVariantLabel("")
    setNewVariantPrice("")
  }

  function handleRemoveVariant(label) {
    setVariants((prev) => prev.filter((v) => v.label !== label))
  }

  function handleFormSubmit(data) {
    // If hasVariants is on but no variants added, warn
    if (data.hasVariants && variants.length === 0) {
      setVariantError("Please add at least one variant or turn off variants")
      return
    }

    onSubmit({
      ...data,
      image,
      variants: data.hasVariants ? variants : [],
      hasVariants: data.hasVariants && variants.length > 0,
    })
  }

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {item ? "Edit Item" : "Add Menu Item"}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="flex gap-6">
          {/* Image Upload */}
          <ImageUpload value={image} onChange={setImage} />

          {/* Basic Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="e.g. Paneer Tikka"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>
                  Base Price (₹)
                  {hasVariants && (
                    <span className="text-xs text-muted-foreground ml-1">
                      (used when no variant selected)
                    </span>
                  )}
                </Label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="0"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                placeholder="Short description of the item"
                rows={2}
                {...register("description")}
              />
            </div>

            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isVeg}
                  onCheckedChange={(v) => setValue("isVeg", v)}
                />
                <Label className="text-sm">
                  {isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isAvailable}
                  onCheckedChange={(v) => setValue("isAvailable", v)}
                />
                <Label className="text-sm">Available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={hasVariants}
                  onCheckedChange={(v) => setValue("hasVariants", v)}
                />
                <Label className="text-sm">Has Variants</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        {hasVariants && (
          <div className="border rounded-xl p-4 space-y-4 bg-muted/30">
            <div>
              <p className="text-sm font-semibold mb-1">
                Variants (e.g. Half, Full, Quarter)
              </p>
              <p className="text-xs text-muted-foreground">
                Customer will choose one variant when ordering
              </p>
            </div>

            {/* Existing Variants */}
            {variants.length > 0 && (
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.label}
                    className="flex items-center justify-between bg-card rounded-lg px-3 py-2 border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {variant.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(variant.price)}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveVariant(variant.label)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Variant */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Variant Name</Label>
                <Input
                  placeholder="e.g. Half, Full, Large"
                  value={newVariantLabel}
                  onChange={(e) => setNewVariantLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddVariant()
                    }
                  }}
                />
              </div>
              <div className="w-32 space-y-1">
                <Label className="text-xs">Price (₹)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="0"
                  value={newVariantPrice}
                  onChange={(e) => setNewVariantPrice(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddVariant()
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddVariant}
                className="flex-shrink-0"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {variantError && (
              <p className="text-xs text-destructive">{variantError}</p>
            )}

            {/* Quick add common variants */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Quick add:</p>
              <div className="flex gap-2 flex-wrap">
                {["Half", "Full", "Quarter", "Regular", "Large", "Small"].map(
                  (label) => {
                    const exists = variants.find(
                      (v) => v.label.toLowerCase() === label.toLowerCase()
                    )
                    if (exists) return null
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setNewVariantLabel(label)}
                        className="text-xs px-2.5 py-1 rounded-full border border-dashed
                          text-muted-foreground hover:border-primary hover:text-primary
                          transition-colors"
                      >
                        + {label}
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {item ? "Update Item" : "Add Item"}
          </Button>
        </div>
      </form>
    </div>
  )
}