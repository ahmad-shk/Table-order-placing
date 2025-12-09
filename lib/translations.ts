import { ScanQrCode } from "lucide-react";

export const translations = {
  // English
  en: {
    homeRestaurantOrdering: "Restaurant Ordering System",
    homeRestaurantOrderingDescription: "Scan QR code to place orders directly from your table.",
    loading: "Loading",
    table: "Table",
    ScanQrCode: "Scan QR Code",
    easyOrderingExperience: "Easy Ordering Experience",
    footerDisclaimer: "Each table has a unique QR code. Customers can scan it with their phone to start ordering immediately",
   //orderpage
    Order_backToTables: "Back to Tables",
    Order_table: "Table",
    Order_selectItems: "Select Items",
    Order_browseMenu: "Browse our menu and add items to your order",
    Order_summary: "Order Summary",
    Order_deleteItem: "Delete item",
    Order_total: "Total:",
    Order_placeOrder: "✓ Place Order",
    Order_placingOrder: "🔄 Placing Order...",
    Order_clearCart: "Clear Cart",
    Order_noItems: "No items selected yet",
    Order_addItems: "Add items from the menu to get started",
    Order_error: "Error",
    Order_unknownError: "An unknown error occurred",
    Order_toastSuccessTitle: "✅ Order Placed Successfully",
    Order_toastSuccessDesc: "Your order for table",
    //ordercomfirmation
    OrderConfirm_loading: "Loading order details...",
    OrderConfirm_backHome: "Back to Home",

    OrderConfirm_title: "Order Confirmed!",
    OrderConfirm_subtitle: "Your order has been successfully placed",

    OrderConfirm_orderId: "Order ID",
    OrderConfirm_tableNumber: "Table Number",
    OrderConfirm_items: "Order Items",
    OrderConfirm_qty: "Qty",
    OrderConfirm_total: "Total:",
    OrderConfirm_message: "Your order is being prepared in the kitchen. The kitchen staff has been notified.",

    OrderConfirm_backTables: "Back to Tables",
    OrderConfirm_newOrder: "New Order",
    

  },
  // Chinese
  zh: {
    homeRestaurantOrdering: "餐廳點餐系統",
    homeRestaurantOrderingDescription: "掃描桌上的 QR 碼，直接從手機點餐。",
    loading: "載入中",
    table: "桌子",
    ScanQrCode: "掃描 QR 碼",
    easyOrderingExperience: "輕鬆點餐體驗",
    footerDisclaimer: "每個桌子都有獨特的 QR 碼，顧客可以用手機掃描它，立即開始點餐",
    //orderpage
    Order_backToTables: "返回桌號列表",
    Order_table: "桌號",
    Order_selectItems: "選擇餐點",
    Order_browseMenu: "瀏覽菜單並將餐點加入訂單",
    Order_summary: "訂單摘要",
    Order_deleteItem: "刪除餐點",
    Order_total: "總計：",
    Order_placeOrder: "✓ 下訂單",
    Order_placingOrder: "🔄 正在下訂單...",
    Order_clearCart: "清空購物車",
    Order_noItems: "尚未選擇任何餐點",
    Order_addItems: "從菜單中加入餐點以開始",
    Order_error: "錯誤",
    Order_unknownError: "發生未知錯誤",
    Order_toastSuccessTitle: "✅ 訂單成功送出",
    Order_toastSuccessDesc: "您的桌號訂單",
    //ordercomfirmation
    OrderConfirm_loading: "正在載入訂單詳情...",
    OrderConfirm_backHome: "返回首頁",
    OrderConfirm_title: "訂單已確認！",
    OrderConfirm_subtitle: "您的訂單已成功送出",
    OrderConfirm_orderId: "訂單編號",
    OrderConfirm_tableNumber: "桌號",
    OrderConfirm_items: "訂購項目",
    OrderConfirm_qty: "數量",
    OrderConfirm_total: "總計：",
    OrderConfirm_message: "您的訂單正在廚房準備中，廚房人員已收到通知。",
    OrderConfirm_backTables: "返回桌號列表",
    OrderConfirm_newOrder: "新訂單",
  },
}


// Define language and key types
export type Language = keyof typeof translations
type TranslationKeys = keyof typeof translations["zh"]

// Type-safe translation getter
export const getTranslation = (
  lang: Language,
  key: keyof typeof translations.zh // only string keys
): string => {
  const value = translations[lang]?.[key] ?? translations.zh?.[key];
  return typeof value === "string" ? value : "";
};
