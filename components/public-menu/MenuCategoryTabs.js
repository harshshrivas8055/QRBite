"use client"

import { useRef } from "react"
import { cn } from "@/lib/utils"

export default function MenuCategoryTabs({
  categories,
  activeCategory,
  onSelect,
  theme,
}) {
  const scrollRef = useRef(null)

  return (
    <div
      className={`${theme.categoryBar} overflow-x-auto scrollbar-hide`}
      ref={scrollRef}
    >
      <div className="flex gap-2 px-4 py-3 min-w-max">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelect(cat._id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === cat._id
                ? theme.categoryActive
                : theme.categoryInactive
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}