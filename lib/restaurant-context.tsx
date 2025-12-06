"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { Order } from "./types"
import { subscribeToActiveOrders, updateOrderStatus as updateOrderInFirestore } from "./firestore"

interface RestaurantContextType {
  orders: Order[]
  loading: boolean
  error: string | null
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>
  getAllActiveOrders: () => Order[]
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined)

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const unsubscribe = subscribeToActiveOrders((updatedOrders) => {
        setOrders(updatedOrders)
        setLoading(false)
        setError(null)
      })

      if (!unsubscribe) {
        setError("Firebase is not configured. Please add your credentials.")
        setLoading(false)
      }

      return () => {
        if (unsubscribe) {
          unsubscribe()
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect to Firebase"
      setError(errorMessage)
      setLoading(false)
      console.error("RestaurantContext error:", err)
    }
  }, [])

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderInFirestore(orderId, status)
      // Update local state optimistically
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: Date.now() } : o)))
    } catch (error) {
      console.error("Failed to update order status:", error)
      throw error
    }
  }, [])

  const getAllActiveOrders = useCallback(() => {
    return orders
  }, [orders])

  return (
    <RestaurantContext.Provider
      value={{
        orders,
        loading,
        error,
        updateOrderStatus,
        getAllActiveOrders,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  )
}

export function useRestaurant() {
  const context = useContext(RestaurantContext)
  if (context === undefined) {
    throw new Error("useRestaurant must be used within RestaurantProvider")
  }
  return context
}
