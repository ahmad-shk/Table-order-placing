import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { RestaurantProvider } from "@/lib/restaurant-context"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <RestaurantProvider>
          {children}
          <Analytics />
        </RestaurantProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.app",
}
