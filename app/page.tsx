"use client"

import { Card } from "@/components/ui/card"
import { useRestaurant } from "@/lib/restaurant-context"
import Link from "next/link"
import { CheckCircle, AlertCircle } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"

const TABLES = [1, 2, 3, 4, 5, 6]

export default function HomePage() {
  const { error, loading } = useRestaurant()
  const [qrCodes, setQrCodes] = useState<{ [key: number]: string }>({})

  const isConnected = !error && !loading

  useEffect(() => {
    const generateQRCodes = async () => {
      const codes: { [key: number]: string } = {}
      for (const tableNum of TABLES) {
        const qrUrl = await QRCode.toDataURL(`${window.location.origin}/order?table=${tableNum}`)
        codes[tableNum] = qrUrl
      }
      setQrCodes(codes)
    }
    generateQRCodes()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-50 dark:to-blue-950 p-4">
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
          <h1 className="text-5xl font-bold text-foreground mb-2">🍽️ Restaurant Ordering</h1>
          <p className="text-lg text-muted-foreground">Scan QR code or select your table to place an order</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TABLES.map((tableNum) => (
            <Link key={tableNum} href={`/order?table=${tableNum}`}>
              <Card className="p-8 text-center cursor-pointer hover:shadow-xl transition-all hover:scale-105 h-full flex flex-col items-center justify-center bg-card border-2 border-transparent hover:border-blue-500">
                <div className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-widest">
                  Table {tableNum}
                </div>
                {qrCodes[tableNum] ? (
                  <img
                    src={qrCodes[tableNum] || "/placeholder.svg"}
                    alt={`QR Code for Table ${tableNum}`}
                    className="w-32 h-32 mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">Click or scan QR code</p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border border-border text-center">
          <p className="text-muted-foreground mb-2 font-semibold">📱 Easy Ordering Experience</p>
          <p className="text-sm text-muted-foreground">
            Each table has a unique QR code. Customers can scan it with their phone to start ordering immediately
          </p>
        </div>
      </div>
    </div>
  )
}
