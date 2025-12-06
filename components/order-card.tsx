"use client"

import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRestaurant } from "@/lib/restaurant-context"
import { Clock, CheckCircle2, ChefHat, Utensils } from "lucide-react"

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const { updateOrderStatus } = useRestaurant()
  const timeElapsed = Math.floor((Date.now() - order.createdAt) / 1000)
  const minutes = Math.floor(timeElapsed / 60)
  const seconds = timeElapsed % 60

  const statusConfig = {
    pending: {
      bg: "bg-yellow-50 dark:bg-yellow-900",
      border: "border-yellow-200 dark:border-yellow-700",
      icon: Clock,
      text: "Pending",
    },
    preparing: {
      bg: "bg-blue-50 dark:bg-blue-900",
      border: "border-blue-200 dark:border-blue-700",
      icon: ChefHat,
      text: "Preparing",
    },
    ready: {
      bg: "bg-green-50 dark:bg-green-900",
      border: "border-green-200 dark:border-green-700",
      icon: CheckCircle2,
      text: "Ready",
    },
    serving: {
      bg: "bg-purple-50 dark:bg-purple-900",
      border: "border-purple-200 dark:border-purple-700",
      icon: Utensils,
      text: "Serving",
    },
    completed: {
      bg: "bg-gray-50 dark:bg-gray-900",
      border: "border-gray-200 dark:border-gray-700",
      icon: CheckCircle2,
      text: "Completed",
    },
  }

  const config = statusConfig[order.status]
  const StatusIcon = config.icon

  return (
    <Card className={`p-4 ${config.bg} border-2 ${config.border}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Table {order.tableNumber}</h3>
          <p className="text-sm text-muted-foreground">
            {minutes}m {seconds}s ago
          </p>
        </div>
        <div className="flex items-center gap-1">
          <StatusIcon className="w-5 h-5" />
          <span className="font-semibold text-foreground">{config.text}</span>
        </div>
      </div>

      <div className="bg-background rounded p-3 mb-3 max-h-40 overflow-y-auto">
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold text-foreground ml-2">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {order.status === "pending" && (
          <Button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1" variant="default">
            Start Preparing
          </Button>
        )}
        {order.status === "preparing" && (
          <Button onClick={() => updateOrderStatus(order.id, "ready")} className="flex-1" variant="default">
            Mark Ready
          </Button>
        )}
        {order.status === "ready" && (
          <Button onClick={() => updateOrderStatus(order.id, "serving")} className="flex-1" variant="default">
            Start Serving
          </Button>
        )}
        {order.status === "serving" && (
          <Button onClick={() => updateOrderStatus(order.id, "completed")} className="flex-1" variant="default">
            Complete Order
          </Button>
        )}
      </div>
    </Card>
  )
}
