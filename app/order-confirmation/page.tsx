"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"

interface OrderData {
  orderId: string
  tableNumber: number
  items: Array<{
    menuItemId: string
    name: string
    price: number
    quantity: number
  }>
  totalAmount: number
}

const RUPEE_TO_EURO = 0.012

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key as any)

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder")
    if (savedOrder) {
      setOrderData(JSON.parse(savedOrder))
    }
  }, [])

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">{t("OrderConfirm_loading")}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("OrderConfirm_backHome")}
          </Button>
        </Card>
      </div>
    )
  }

  const totalInEuros = (orderData.totalAmount).toFixed(2)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("OrderConfirm_title")}
          </h1>
          <p className="text-muted-foreground">
            {t("OrderConfirm_subtitle")}
          </p>
        </div>

        {/* Order Summary Card */}
        <Card className="p-8 mb-6">
          {/* Order ID */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-sm text-muted-foreground">{t("OrderConfirm_orderId")}</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300 font-mono">
              {orderData.orderId}
            </p>
          </div>

          {/* Table Number */}
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900 rounded-lg">
            <p className="text-sm text-muted-foreground">{t("OrderConfirm_tableNumber")}</p>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
              {orderData.tableNumber}
            </p>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {t("OrderConfirm_items")}
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="flex justify-between items-center p-3 bg-card border border-border rounded"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("OrderConfirm_qty")}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      € {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-border pt-6 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-semibold bg-green-50 dark:bg-green-900 p-3 rounded">
                <span className="text-green-700 dark:text-green-300">
                  {t("OrderConfirm_total")}
                </span>
                <span className="text-green-700 dark:text-green-300">
                  € {totalInEuros}
                </span>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg mb-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {t("OrderConfirm_message")}
            </p>
          </div>
        </Card>

        {/* Navigation Buttons */}
        {/* <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => {
              sessionStorage.removeItem("lastOrder")
              router.push("/")
            }}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("OrderConfirm_backTables")}
          </Button>

          <Button
            onClick={() => {
              sessionStorage.removeItem("lastOrder")
              router.push("/")
            }}
            variant="outline"
            className="gap-2"
          >
            {t("OrderConfirm_newOrder")}
          </Button>
        </div> */}
      </div>
    </div>
  )
}
