"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

export default function ImageUpload({ value, onChange, className }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    setUploading(true)
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onChange(data.url)
      toast.success("Image uploaded!")
    } catch (error) {
      toast.error(error.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div
        className="relative h-32 w-32 rounded-xl border-2 border-dashed border-muted-foreground/30 
        flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 
        transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 
              transition-opacity flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-primary" />
            ) : (
              <>
                <ImageIcon className="h-8 w-8" />
                <span className="text-xs">Click to upload</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(null)}
          className="text-destructive hover:text-destructive"
        >
          <X className="h-4 w-4 mr-1" />
          Remove
        </Button>
      )}
    </div>
  )
}