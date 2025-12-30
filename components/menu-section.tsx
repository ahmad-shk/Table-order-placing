"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Minus, Trash2, Loader2, UtensilsCrossed, AlertCircle } from "lucide-react"
import type { OrderItem } from "@/lib/types"
import { toast } from "sonner"

// API URL jo aapne provide ki
const API_URL = "https://resturant-managment-system-backend.vercel.app/api/products/all"

interface MenuSectionProps {
  items: OrderItem[]
  onAddItem: (item: OrderItem) => void
  onUpdateQuantity: (menuItemId: string, quantity: number) => void
  onRemoveItem: (menuItemId: string) => void
}

// Backend se aane wale data ki type definition
interface ApiProduct {
  _id: string
  name: string
  price: number
  category: string
  description?: string
  image?: string
  isAvailable: boolean
}

export function MenuSection({ items, onAddItem, onUpdateQuantity, onRemoveItem }: MenuSectionProps) {
  const [menuData, setMenuData] = useState<ApiProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 1. API se data fetch karne ka logic
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(API_URL)
        
        // Data format check: Array hai ya object ke andar data hai
        const fetchedData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || [])
        
        setMenuData(fetchedData)
      } catch (err: any) {
        console.error("Fetch Error:", err)
        setError("Failed to load menu items. Please check your connection.")
        toast.error("Could not load menu")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenu()
  }, [])

  // 2. Categories extract karna
  const categories = Array.from(new Set(menuData.map((item) => item.category)))

  // 3. Current quantity check karne ka helper
  const getItemQuantity = (menuItemId: string) => {
    return items.find((item) => item.menuItemId === menuItemId)?.quantity || 0
  }

  // --- UI States ---

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-muted-foreground animate-pulse">Fetching fresh menu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-foreground font-medium">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    )
  }

  if (menuData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <UtensilsCrossed className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground">No menu items available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {categories.map((category) => {
        const categoryItems = menuData.filter((item) => item.category === category)
        
        return (
          <div key={category} className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-bold text-foreground whitespace-nowrap">{category}</h3>
              <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categoryItems.map((menuItem) => {
                const quantity = getItemQuantity(menuItem._id) // MongoDB ID use ho rahi hai
                
                return (
                  <Card
                    key={menuItem._id}
                    className="flex flex-col overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300 group hover:border-blue-400/50 dark:hover:border-blue-500/30"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 w-full bg-muted overflow-hidden">
                      <img
                        src={menuItem.image || "/placeholder.svg"}
                        alt={menuItem.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image")}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-blue-600 shadow-sm">
                          € {menuItem.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1 space-y-3">
                      <div>
                        <h4 className="font-bold text-lg text-foreground group-hover:text-blue-600 transition-colors">
                          {menuItem.name}
                        </h4>
                        {menuItem.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 italic">
                            {menuItem.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto pt-4">
                        {quantity === 0 ? (
                          <Button
                            onClick={() => {
                              const newItem: OrderItem = {
                                menuItemId: menuItem._id,
                                name: menuItem.name,
                                price: menuItem.price,
                                quantity: 1,
                              }
                              onAddItem(newItem)
                              toast.success(`${menuItem.name} added`)
                            }}
                            disabled={!menuItem.isAvailable}
                            className="w-full shadow-md bg-blue-600 hover:bg-blue-700 text-white gap-2"
                          >
                            {menuItem.isAvailable ? (
                              <><Plus className="w-4 h-4" /> Add to Order</>
                            ) : (
                              "Not Available"
                            )}
                          </Button>
                        ) : (
                          <div className="flex items-center justify-between bg-muted/50 p-1 rounded-lg border border-border">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (quantity === 1) {
                                  onRemoveItem(menuItem._id)
                                } else {
                                  onUpdateQuantity(menuItem._id, quantity - 1)
                                }
                              }}
                              className="h-9 w-9 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            
                            <span className="font-bold text-lg w-8 text-center">
                              {quantity}
                            </span>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onUpdateQuantity(menuItem._id, quantity + 1)}
                              className="h-9 w-9 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>

                            <div className="w-[1px] h-6 bg-border mx-1" />

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveItem(menuItem._id)}
                              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
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