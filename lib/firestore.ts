import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  type Unsubscribe,
} from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { Order } from "./types"

const ORDERS_COLLECTION = "orders"
const LOCAL_ORDERS_KEY = "restaurant_orders_local"

function getOrdersCollection() {
  if (!db) {
    throw new Error(
      "Firestore not initialized. Check that Firebase credentials are set in your Vercel environment variables (NEXT_PUBLIC_FIREBASE_*)",
    )
  }
  return collection(db, ORDERS_COLLECTION)
}

function saveOrderLocally(order: Order): string {
  const orders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || "[]")
  const orderId = Date.now().toString()
  orders.push({ ...order, id: orderId })
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders))
  return orderId
}

export async function addOrder(order: Omit<Order, "id">): Promise<string> {
  console.log("[v0] Adding order with data:", order)

  if (!isFirebaseConfigured()) {
    console.warn("[v0] Firebase not configured, using local storage")
    return saveOrderLocally({ ...order, id: "" })
  }

  if (!db) {
    console.warn("[v0] Firestore not available, using local storage fallback")
    return saveOrderLocally({ ...order, id: "" })
  }

  try {
    const ordersCollection = getOrdersCollection()

    const orderData = {
      ...order,
      createdAt: order.createdAt || Date.now(),
      updatedAt: order.updatedAt || Date.now(),
    }

    console.log("[v0] Attempting Firestore write...")

    return new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.warn("[v0] Firestore timeout, falling back to local storage")
        resolve(saveOrderLocally({ ...order, id: "" }))
      }, 5000)

      addDoc(ordersCollection, orderData)
        .then((docRef) => {
          clearTimeout(timeout)
          console.log("[v0] Order saved to Firestore with ID:", docRef.id)
          resolve(docRef.id)
        })
        .catch((err) => {
          clearTimeout(timeout)
          console.warn("[v0] Firestore write failed, using local storage:", err.message)
          resolve(saveOrderLocally({ ...order, id: "" }))
        })
    })
  } catch (error) {
    console.warn("[v0] Error with Firestore, falling back to local storage:", error)
    return saveOrderLocally({ ...order, id: "" })
  }
}

export function subscribeToActiveOrders(callback: (orders: Order[]) => void): Unsubscribe | null {
  if (!db) {
    console.warn("Firestore not initialized. Cannot subscribe to orders.")
    return null
  }

  try {
    const ordersCollection = getOrdersCollection()
    const q = query(ordersCollection, where("status", "!=", "completed"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[]

        const sorted = orders.sort((a, b) => a.createdAt - b.createdAt)
        callback(sorted)
      },
      (error) => {
        console.error("[v0] Error subscribing to orders:", error)
      },
    )

    return unsubscribe
  } catch (error) {
    console.error("[v0] Error setting up orders subscription:", error)
    return null
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
  if (!db) {
    throw new Error("Firestore not initialized. Check Firebase configuration.")
  }

  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: Date.now(),
    })
  } catch (error) {
    console.error("[v0] Error updating order status:", error)
    throw error
  }
}

export async function getActiveOrders(): Promise<Order[]> {
  if (!db) {
    console.warn("Firestore not initialized. Returning empty orders.")
    return []
  }

  try {
    const ordersCollection = getOrdersCollection()
    const q = query(ordersCollection, where("status", "!=", "completed"))
    const snapshot = await getDocs(q)
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[]

    return orders.sort((a, b) => a.createdAt - b.createdAt)
  } catch (error) {
    console.error("[v0] Error fetching active orders:", error)
    return []
  }
}
