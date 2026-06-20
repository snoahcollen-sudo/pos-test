import { create } from "zustand"
import type { Product, SaleItem } from "@/types"
import { mockProducts } from "@/mockData"

interface CartItem extends SaleItem {
  discount: number
}

interface POSStore {
  products: Product[]
  cart: CartItem[]
  selectedCustomer: { id: string; name: string } | null
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateDiscount: (productId: string, discount: number) => void
  clearCart: () => void
  setSelectedCustomer: (customer: { id: string; name: string } | null) => void
  getSubtotal: () => number
  getTax: () => number
  getDiscount: () => number
  getTotal: () => number
}

export const usePOSStore = create<POSStore>((set, get) => ({
  products: mockProducts,
  cart: [],
  selectedCustomer: null,
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.cart.find((item) => item.productId === product.id)
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }
      }
      return {
        cart: [
          ...state.cart,
          {
            id: `cart-${product.id}-${Date.now()}`,
            productId: product.id,
            productName: product.name,
            productSku: product.sku,
            quantity,
            price: product.sellingPrice,
            costPrice: product.costPrice,
            discount: 0,
            tax: product.tax,
            total: product.sellingPrice * quantity,
          },
        ],
      }
    })
  },
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.productId !== productId),
    }))
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity, total: (item.price - item.discount) * quantity }
          : item
      ),
    }))
  },
  updateDiscount: (productId, discount) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.productId === productId
          ? { ...item, discount, total: (item.price - discount) * item.quantity }
          : item
      ),
    }))
  },
  clearCart: () => set({ cart: [], selectedCustomer: null }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  getSubtotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getTax: () => get().cart.reduce((sum, item) => sum + (item.price * item.quantity * item.tax) / 100, 0),
  getDiscount: () => get().cart.reduce((sum, item) => sum + item.discount * item.quantity, 0),
  getTotal: () => {
    const subtotal = get().getSubtotal()
    const tax = get().getTax()
    const discount = get().getDiscount()
    return subtotal + tax - discount
  },
}))
