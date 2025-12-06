"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"
import { addOrder } from "@/lib/firestore"
import { MenuSection } from "@/components/menu-section"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { OrderItem } from "@/lib/types"

const RUPEE_TO_EURO = 0.012

export default function OrderPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const tableNumber = Number.parseInt(searchParams.get("table") || "0")

  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tableNumber === 0) {
      router.push("/")
    }
  }, [tableNumber, router])

  const handleAddItem = (item: OrderItem) => {
    const existingItem = items.find((i) => i.menuItemId === item.menuItemId)
    if (existingItem) {
      setItems(items.map((i) => (i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i)))
    } else {
      setItems([...items, item])
    }
  }

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    setItems(items.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item)))
  }

  const handleRemoveItem = (menuItemId: string) => {
    setItems(items.filter((item) => item.menuItemId !== menuItemId))
  }

  const placeOrder = async () => {
    if (items.length === 0) return

    setLoading(true)
    try {
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

      console.log("[v0] Placing order with items:", items)
      console.log("[v0] Table number:", tableNumber)
      console.log("[v0] Total amount:", totalAmount)

      const orderId = await addOrder({
        tableNumber,
        items,
        status: "pending",
        totalAmount,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      console.log("[v0] Order placed successfully with ID:", orderId)

      sessionStorage.setItem(
        "lastOrder",
        JSON.stringify({
          orderId,
          tableNumber,
          items,
          totalAmount,
        }),
      )

      toast({
        title: "✅ Order Placed Successfully",
        description: `Your order for table ${tableNumber} has been sent to the kitchen.`,
      })

      setItems([])

      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${orderId}`)
      }, 1500)
    } catch (error) {
      console.error("[v0] Error placing order:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      setLoading(false)
    }
  }

  if (tableNumber === 0) {
    return null
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-green-50 dark:to-green-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="mb-4 hover:bg-muted">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tables
          </Button>
          <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full mb-4 font-semibold">
            🪑 Table {tableNumber}
          </div>
          <h1 className="text-4xl font-bold text-foreground">Select Items</h1>
          <p className="text-muted-foreground mt-2">Browse our menu and add items to your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            <MenuSection
              items={items}
              onAddItem={handleAddItem}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4 shadow-lg border-2 border-blue-200 dark:border-blue-800">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <ShoppingCart className="w-5 h-5" />
                Order Summary
              </h2>

              {items.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex justify-between items-center text-sm bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors group"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} x € {(item.price * RUPEE_TO_EURO).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">
                            € {(item.quantity * item.price * RUPEE_TO_EURO).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.menuItemId)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-foreground">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                        € {(totalAmount * RUPEE_TO_EURO).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={placeOrder}
                      disabled={loading}
                      className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold"
                    >
                      {loading ? "🔄 Placing Order..." : "✓ Place Order"}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setItems([])}
                    className="w-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Clear Cart
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">No items selected yet</p>
                  <p className="text-xs text-muted-foreground mt-2">Add items from the menu to get started</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
