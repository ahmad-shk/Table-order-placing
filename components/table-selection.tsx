"use client"

import { Card } from "@/components/ui/card"
import { UtensilsCrossed } from "lucide-react"

interface TableSelectionProps {
  onSelectTable: (tableNumber: number) => void
}

export default function TableSelection({ onSelectTable }: TableSelectionProps) {
  // 6 Tables
  const tables = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    capacity: [2, 4, 4, 6, 6, 8][i],
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tables.map((table) => (
        <Card
          key={table.id}
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow hover:border-primary border-2"
          onClick={() => onSelectTable(table.number)}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
              <UtensilsCrossed className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground">Table {table.number}</h3>
              <p className="text-sm text-muted-foreground">Capacity: {table.capacity} persons</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
