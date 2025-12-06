"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Minus, Trash2 } from "lucide-react"
import { MENU_ITEMS } from "@/lib/menu"
import type { OrderItem } from "@/lib/types"

interface MenuSectionProps {
  items: OrderItem[]
  onAddItem: (item: OrderItem) => void
  onUpdateQuantity: (menuItemId: string, quantity: number) => void
  onRemoveItem: (menuItemId: string) => void
}

export function MenuSection({ items, onAddItem, onUpdateQuantity, onRemoveItem }: MenuSectionProps) {
  const categories = Array.from(new Set(MENU_ITEMS.map((item) => item.category)))
  const getItemQuantity = (menuItemId: string) => {
    return items.find((item) => item.menuItemId === menuItemId)?.quantity || 0
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryItems = MENU_ITEMS.filter((item) => item.category === category)
        return (
          <div key={category}>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold text-foreground">{category}</h3>
              <div className="flex-1 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryItems.map((menuItem) => {
                const quantity = getItemQuantity(menuItem.id)
                return (
                  <Card
                    key={menuItem.id}
                    className="p-4 hover:shadow-lg transition-all hover:border-blue-300 dark:hover:border-blue-700 group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground text-base">{menuItem.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">€ {(menuItem.price * 0.012).toFixed(2)}</p>
                        {menuItem.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{menuItem.description}</p>
                        )}
                      </div>
                    </div>

                    {quantity === 0 ? (
                      <Button
                        onClick={() => {
                          const newItem: OrderItem = {
                            menuItemId: menuItem.id,
                            name: menuItem.name,
                            price: menuItem.price,
                            quantity: 1,
                          }
                          onAddItem(newItem)
                        }}
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Order
                      </Button>
                    ) : (
                      /* Enhanced quantity controls with delete button */
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (quantity === 1) {
                              onRemoveItem(menuItem.id)
                            } else {
                              onUpdateQuantity(menuItem.id, quantity - 1)
                            }
                          }}
                          className="flex-1"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-bold text-foreground bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded min-w-10 text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
                          className="flex-1"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(menuItem.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
