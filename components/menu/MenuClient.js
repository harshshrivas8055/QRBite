"use client"

import { useState } from "react"
import { Plus, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageHeader from "@/components/shared/PageHeader"
import EmptyState from "@/components/shared/EmptyState"
import CategoryForm from "./CategoryForm"
import MenuItemCard from "./MenuItemCard"
import MenuItemForm from "./MenuItemForm"
import toast from "react-hot-toast"

export default function MenuClient({ categories: initialCategories, items: initialItems }) {
  const [categories, setCategories] = useState(initialCategories)
  const [items, setItems] = useState(initialItems)
  const [activeTab, setActiveTab] = useState(initialCategories[0]?._id || "")
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [loading, setLoading] = useState(false)

  // Category handlers
  async function handleCreateCategory(data) {
    setLoading(true)
    try {
      const res = await fetch("/api/menu/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setCategories((prev) => [...prev, result.category])
      setActiveTab(result.category._id)
      setShowCategoryForm(false)
      toast.success("Category created!")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteCategory(categoryId) {
    try {
      const res = await fetch(`/api/menu/categories/${categoryId}`, {
        method: "DELETE",
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setCategories((prev) => prev.filter((c) => c._id !== categoryId))
      setItems((prev) => prev.filter((i) => i.categoryId !== categoryId))
      setActiveTab(categories[0]?._id || "")
      toast.success("Category deleted!")
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Item handlers
  async function handleSaveItem(data) {
    setLoading(true)
    try {
      const isEdit = !!editingItem
      const url = isEdit
        ? `/api/menu/items/${editingItem._id}`
        : "/api/menu/items"
      const method = isEdit ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, categoryId: activeTab }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      if (isEdit) {
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? result.item : i))
        )
        toast.success("Item updated!")
      } else {
        setItems((prev) => [...prev, result.item])
        toast.success("Item added!")
      }

      setShowItemForm(false)
      setEditingItem(null)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteItem(itemId) {
    try {
      const res = await fetch(`/api/menu/items/${itemId}`, {
        method: "DELETE",
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setItems((prev) => prev.filter((i) => i._id !== itemId))
      toast.success("Item deleted!")
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function handleToggleAvailable(itemId, isAvailable) {
    try {
      const res = await fetch(`/api/menu/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)
      setItems((prev) =>
        prev.map((i) => (i._id === itemId ? result.item : i))
      )
    } catch (error) {
      toast.error(error.message)
    }
  }

  const activeItems = items.filter((i) => i.categoryId === activeTab)

  return (
    <div>
      <PageHeader
        title="Menu Management"
        description="Manage your categories and menu items"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCategoryForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button
              onClick={() => {
                setEditingItem(null)
                setShowItemForm(true)
              }}
              disabled={categories.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        }
      />

      {/* Category Form */}
      {showCategoryForm && (
        <div className="mb-6">
          <CategoryForm
            onSubmit={handleCreateCategory}
            onCancel={() => setShowCategoryForm(false)}
            loading={loading}
          />
        </div>
      )}

      {/* Item Form */}
      {showItemForm && (
        <div className="mb-6">
          <MenuItemForm
            item={editingItem}
            onSubmit={handleSaveItem}
            onCancel={() => {
              setShowItemForm(false)
              setEditingItem(null)
            }}
            loading={loading}
          />
        </div>
      )}

      {categories.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No categories yet"
          description="Create a category first, then add menu items"
          action={
            <Button onClick={() => setShowCategoryForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          }
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="flex-wrap h-auto gap-1">
              {categories.map((cat) => (
                <TabsTrigger key={cat._id} value={cat._id}>
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-60">
                    ({items.filter((i) => i.categoryId === cat._id).length})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((cat) => (
            <TabsContent key={cat._id} value={cat._id}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {activeItems.length} items in {cat.name}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive text-xs"
                  onClick={() => handleDeleteCategory(cat._id)}
                >
                  Delete Category
                </Button>
              </div>

              {activeItems.length === 0 ? (
                <EmptyState
                  icon={UtensilsCrossed}
                  title="No items in this category"
                  description="Add your first menu item"
                  action={
                    <Button
                      onClick={() => {
                        setEditingItem(null)
                        setShowItemForm(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeItems.map((item) => (
                    <MenuItemCard
                      key={item._id}
                      item={item}
                      onEdit={() => {
                        setEditingItem(item)
                        setShowItemForm(true)
                      }}
                      onDelete={handleDeleteItem}
                      onToggleAvailable={handleToggleAvailable}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}