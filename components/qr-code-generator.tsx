"use client"

import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRef } from "react"

interface QRCodeGeneratorProps {
  tableNumber: number
  restaurantUrl?: string
}

export function QRCodeGenerator({ tableNumber, restaurantUrl = "" }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null)

  const orderUrl = `${restaurantUrl}/order?table=${tableNumber}`

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const image = new Image()

      image.onload = () => {
        canvas.width = image.width
        canvas.height = image.height
        ctx?.drawImage(image, 0, 0)
        const link = document.createElement("a")
        link.download = `table-${tableNumber}-qr.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      }

      image.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold">Table {tableNumber}</h3>
      <div ref={qrRef} className="bg-white p-4 rounded-lg">
        <QRCodeSVG value={orderUrl} size={200} level="H" />
      </div>
      <p className="text-sm text-muted-foreground text-center">Scan to order at Table {tableNumber}</p>
      <Button onClick={downloadQRCode} variant="outline" size="sm">
        Download QR Code
      </Button>
    </Card>
  )
}
