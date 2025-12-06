"use client"

import type { Order } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { UtensilsCrossed, Clock, CheckCircle2, Utensils } from "lucide-react"

interface KitchenStatsProps {
  orders: Order[]
}

export function KitchenStats({ orders }: KitchenStatsProps) {
  const pendingCount = orders.filter((o) => o.status === "pending").length
  const preparingCount = orders.filter((o) => o.status === "preparing").length
  const readyCount = orders.filter((o) => o.status === "ready").length
  const servingCount = orders.filter((o) => o.status === "serving").length

  const stats = [
    { label: "Pending", count: pendingCount, icon: Clock, color: "text-yellow-600" },
    { label: "Preparing", count: preparingCount, icon: UtensilsCrossed, color: "text-blue-600" },
    { label: "Ready", count: readyCount, icon: CheckCircle2, color: "text-green-600" },
    { label: "Serving", count: servingCount, icon: Utensils, color: "text-purple-600" },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4 text-center">
            <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold text-foreground">{stat.count}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        )
      })}
    </div>
  )
}
