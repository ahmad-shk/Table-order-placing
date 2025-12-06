"use client"

import { Card } from "@/components/ui/card"
import { useRestaurant } from "@/lib/restaurant-context"
import Link from "next/link"
import { CheckCircle, AlertCircle } from "lucide-react"

const TABLES = [1, 2, 3, 4, 5, 6]

export default function HomePage() {
  const { error, loading } = useRestaurant()

  const isConnected = !error && !loading

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Firebase Status Banner */}
        <div className="mb-8 p-4 rounded-lg border flex items-center gap-3 bg-card">
          {isConnected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-700 dark:text-green-400">Firebase Connected</p>
                <p className="text-sm text-muted-foreground">Ready to process orders</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-700 dark:text-red-400">Firebase Not Connected</p>
                <p className="text-sm text-muted-foreground">{error || "Connecting..."}</p>
              </div>
            </>
          )}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">Restaurant Ordering</h1>
          <p className="text-lg text-muted-foreground">Select your table to place an order</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TABLES.map((tableNum) => (
            <Link key={tableNum} href={`/order?table=${tableNum}`}>
              <Card className="p-8 text-center cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-foreground mb-4">Table {tableNum}</div>
                <p className="text-muted-foreground mb-4">Click to order</p>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🔗</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border border-border text-center">
          <p className="text-muted-foreground mb-2">In a real restaurant, each table would have a printed QR code</p>
          <p className="text-sm text-muted-foreground">
            Customers scan the QR code or click the link to order from that table
          </p>
        </div>
      </div>
    </div>
  )
}
