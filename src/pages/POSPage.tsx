import { useState, useRef, useEffect } from "react"
import {
  Search,
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  User,
  Printer,
  Pause,
  RotateCcw,
  Package,
  Tag,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/utils/cn"
import { usePOSStore } from "@/stores/posStore"
import { saleApi } from "@/services/saleApi"
import { categoryApi } from "@/services/categoryApi"
import { mockCategories } from "@/mockData"
import type { Category } from "@/types"

export function POSPage() {
  const {
    cart,
    selectedCustomer,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setSelectedCustomer,
    getSubtotal,
    getTax,
    getDiscount,
    getTotal,
  } = usePOSStore()

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string>("cash")
  const [amountTendered, setAmountTendered] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [posCategories, setPosCategories] = useState<Category[]>([])
  const searchRef = useRef<HTMLInputElement>(null)

  const products = usePOSStore((s) => s.products)

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search)
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory
    return matchesSearch && matchesCategory && p.status === "active"
  })

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        searchRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    fetchPosCategories()
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const fetchPosCategories = async () => {
    try {
      const { data } = await categoryApi.getAll()
      setPosCategories(data.data)
    } catch {
      setPosCategories(mockCategories)
    }
  }

  const handlePayment = () => {
    setShowPayment(true)
  }

  const completeSale = async () => {
    setIsProcessing(true)
    try {
      await saleApi.create({
        customerId: selectedCustomer?.id,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          costPrice: item.costPrice,
          discount: item.discount,
          tax: item.tax,
        })),
        subtotal,
        tax,
        discount,
        total,
        paymentMethod: paymentMethod as any,
        amountTendered: amountTendered ? parseFloat(amountTendered) : total,
        change: change > 0 ? change : 0,
      })
      toast.success("Sale completed successfully!")
      clearCart()
      setShowPayment(false)
      setAmountTendered("")
      setPaymentMethod("cash")
    } catch {
      toast.error("Failed to process sale")
    } finally {
      setIsProcessing(false)
    }
  }

  const subtotal = getSubtotal()
  const tax = getTax()
  const discount = getDiscount()
  const total = getTotal()
  const change = amountTendered ? parseFloat(amountTendered) - total : 0

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchRef}
              placeholder="Scan barcode or search product... (F2)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10 text-lg"
            />
          </div>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {posCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex flex-col items-center rounded-xl border bg-card p-3 text-center transition-all hover:border-primary hover:shadow-md active:scale-[0.98]"
              >
                <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                  <Package size={24} className="text-muted-foreground" />
                </div>
                <p className="w-full text-xs font-medium leading-tight line-clamp-2">{product.name}</p>
                <p className="mt-1 text-sm font-bold text-primary">{formatCurrency(product.sellingPrice)}</p>
                <p className="text-[10px] text-muted-foreground">Stock: {product.stock}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-[380px] flex-col rounded-xl border bg-card shadow-sm">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} />
              <h2 className="text-lg font-semibold">Current Sale</h2>
              <Badge>{cartCount}</Badge>
            </div>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart}>
                <X size={14} className="mr-1" /> Clear
              </Button>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <User size={14} className="mr-1" /> Customer
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Tag size={14} className="mr-1" /> Coupon
            </Button>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart size={48} className="mb-4 opacity-50" />
              <p className="font-medium">Cart is empty</p>
              <p className="text-sm">Click products to add to cart</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} each</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 size={12} className="text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </Button>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="mb-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Pause size={14} className="mr-1" /> Hold
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw size={14} className="mr-1" /> Return
            </Button>
          </div>

          <Button
            className="mt-2 h-14 w-full text-lg"
            onClick={handlePayment}
            disabled={cart.length === 0}
          >
            <CreditCard size={20} className="mr-2" />
            Pay {formatCurrency(total)}
          </Button>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-xl bg-card p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Payment</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)}>
                <X size={20} />
              </Button>
            </div>

            <div className="mb-6 rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground">Amount Due</p>
              <p className="text-4xl font-bold text-primary">{formatCurrency(total)}</p>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-2">
              {[
                { id: "cash", label: "Cash", icon: Banknote },
                { id: "card", label: "Card", icon: CreditCard },
                { id: "mobile_money", label: "Mobile", icon: Smartphone },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground"
                  }`}
                >
                  <method.icon size={24} />
                  <span className="text-sm font-medium">{method.label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === "cash" && (
              <div className="mb-6 space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Tendered</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amountTendered}
                    onChange={(e) => setAmountTendered(e.target.value)}
                    className="text-center text-2xl"
                  />
                </div>
                <div className="flex gap-2">
                  {[total, 10, 20, 50, 100].map((amt) => (
                    <Button
                      key={amt}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setAmountTendered(String(amt))}
                    >
                      {formatCurrency(amt)}
                    </Button>
                  ))}
                </div>
                {change > 0 && (
                  <div className="rounded-lg bg-success/10 p-3 text-center">
                    <p className="text-sm text-muted-foreground">Change</p>
                    <p className="text-2xl font-bold text-success">{formatCurrency(change)}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={completeSale} disabled={isProcessing || (paymentMethod === "cash" && (!amountTendered || parseFloat(amountTendered) < total))}>
                {isProcessing ? <><Loader2 size={16} className="mr-2 animate-spin" /> Processing...</> : <><Printer size={16} className="mr-2" /> Complete Sale</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
