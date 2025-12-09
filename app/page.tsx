"use client"

import { Card } from "@/components/ui/card"
import { useRestaurant } from "@/lib/restaurant-context"
import Link from "next/link"
import { CheckCircle, AlertCircle } from "lucide-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

const TABLES = [1, 2, 3, 4, 5, 6]

export default function HomePage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key as any)
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-2">🍽️ {t("homeRestaurantOrdering")}</h1>
          <p className="text-lg text-muted-foreground">{t("homeRestaurantOrderingDescription")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TABLES.map((tableNum) => (
            <Card className="p-8 text-center cursor-pointer hover:shadow-xl transition-all hover:scale-105 h-full flex flex-col items-center justify-center bg-card border-2 border-transparent hover:border-blue-500">
              <div className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-widest">
                {t("table")} {tableNum}
              </div>
              {qrCodes[tableNum] ? (
                <img
                  src={qrCodes[tableNum] || "/placeholder.svg"}
                  alt={`QR Code for Table ${tableNum}`}
                  className="w-32 h-32 mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">{t("loading")}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">{t("ScanQrCode")}</p>
            </Card>
            // </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border border-border text-center">
          <p className="text-muted-foreground mb-2 font-semibold">📱 {t("easyOrderingExperience")}</p>
          <p className="text-sm text-muted-foreground">
            {t("footerDisclaimer")}
          </p>
        </div>
      </div>
    </div>
  )
}
