"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Minus } from "lucide-react"
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
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryItems = MENU_ITEMS.filter((item) => item.category === category)
        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-foreground mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryItems.map((menuItem) => {
                const quantity = getItemQuantity(menuItem.id)
                return (
                  <Card key={menuItem.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{menuItem.name}</p>
                        <p className="text-sm text-muted-foreground">€ {(menuItem.price * 0.012).toFixed(2)}</p>
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
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    ) : (
                      <div className="flex items-center justify-between">
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
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold text-foreground">{quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}>
                          <Plus className="w-4 h-4" />
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
