"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRestaurant } from "@/lib/restaurant-context"
import { addOrder } from "@/lib/firestore"
import type { OrderItem } from "@/lib/types"
import { Trash2, Plus } from "lucide-react"

interface OrderFormProps {
  tableNumber: number
  onOrderComplete: () => void
}

export default function OrderForm({ tableNumber, onOrderComplete }: OrderFormProps) {
  const { orders } = useRestaurant()
  const [items, setItems] = useState<OrderItem[]>([])
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addItem = () => {
    if (itemName.trim() && itemPrice) {
      const newItem: OrderItem = {
        menuItemId: Date.now().toString(),
        name: itemName.trim(),
        price: Number.parseFloat(itemPrice),
        quantity,
        specialInstructions: "",
      }
      setItems([...items, newItem])
      setItemName("")
      setItemPrice("")
      setQuantity(1)
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      alert("Please add at least one item")
      return
    }

    setIsSubmitting(true)
    try {
      await addOrder({
        tableNumber,
        items,
        totalAmount: calculateTotal(),
        status: "pending",
      })
      alert("Order placed successfully!")
      onOrderComplete()
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Section */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Create Order for Table {tableNumber}</h2>

          {/* Add Item Section */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Item Name</label>
              <Input
                placeholder="e.g., Biryani, Tikka Masala..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Price</label>
                <Input
                  type="number"
                  placeholder="Price"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                />
              </div>
            </div>

            <Button onClick={addItem} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Order Items ({items.length})</h3>
            {items.length === 0 ? (
              <p className="text-muted-foreground">No items added yet</p>
            ) : (
              items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-card p-3 rounded border border-border">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      € {(item.price * 0.012).toFixed(2)} × {item.quantity} = €{" "}
                      {(item.price * item.quantity * 0.012).toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Order Summary Section */}
      <div>
        <Card className="p-6 sticky top-4">
          <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium text-foreground">€ {(calculateTotal() * 0.012).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-medium text-foreground">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Qty:</span>
              <span className="font-medium text-foreground">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 mb-6">
            <div className="flex justify-between font-bold text-foreground">
              <span>Total:</span>
              <span className="text-xl">€ {(calculateTotal() * 0.012).toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleSubmitOrder}
            disabled={isSubmitting || items.length === 0}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </Button>
        </Card>
      </div>
    </div>
  )
}
