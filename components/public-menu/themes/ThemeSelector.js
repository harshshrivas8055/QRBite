"use client"

import { THEMES } from "./index"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export default function ThemeSelector({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(THEMES).map(([key, theme]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={cn(
            "relative rounded-xl border-2 p-3 text-left transition-all hover:scale-105",
            value === key
              ? "border-primary ring-2 ring-primary/30"
              : "border-muted hover:border-muted-foreground/30"
          )}
        >
          <div className={cn("h-10 rounded-lg mb-2 border", theme.preview)} />
          <p className="text-xs font-semibold truncate">{theme.name}</p>
          {value === key && (
            <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}