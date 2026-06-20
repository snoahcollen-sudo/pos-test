import { useState, useEffect } from "react"
import { Store, Receipt, CreditCard, Bell, Users, Palette, Database, Save, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { settingsApi } from "@/services/settingsApi"

export function SettingsPage() {
  const [settings, setSettings] = useState<any>({})
  const [saved, setSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await settingsApi.get()
      setSettings(data.data)
    } catch {
      setSettings({ storeName: "SmartPOS Store", storePhone: "+1 234 567 890", storeEmail: "store@smartpos.com", storeAddress: "123 Business Street", currency: "USD", taxRate: 10, receiptHeader: "Thank you for shopping with us!", receiptFooter: "Visit us again soon!" })
    } finally { setIsLoading(false) }
  }

  const handleSave = async () => {
    try { await settingsApi.update(settings); toast.success("Settings saved!") }
    catch { toast.error("Failed to save settings") }
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Configure your store and application</p></div>
        <Button onClick={handleSave}><Save size={16} className="mr-2" /> {saved ? "Saved!" : "Save Changes"}</Button>
      </div>

      <Tabs defaultValue="store">
        <TabsList className="flex-wrap">
          <TabsTrigger value="store"><Store size={14} className="mr-1" /> Store</TabsTrigger>
          <TabsTrigger value="receipt"><Receipt size={14} className="mr-1" /> Receipt</TabsTrigger>
          <TabsTrigger value="taxes"><CreditCard size={14} className="mr-1" /> Taxes</TabsTrigger>
          <TabsTrigger value="notifications"><Bell size={14} className="mr-1" /> Notifications</TabsTrigger>
          <TabsTrigger value="users"><Users size={14} className="mr-1" /> Users</TabsTrigger>
          <TabsTrigger value="appearance"><Palette size={14} className="mr-1" /> Theme</TabsTrigger>
          <TabsTrigger value="backup"><Database size={14} className="mr-1" /> Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Store Information</CardTitle><CardDescription>Basic store details</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Store Name</Label><Input value={settings.storeName || ""} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={settings.storePhone || ""} onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Email</Label><Input value={settings.storeEmail || ""} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} /></div>
                <div className="space-y-2"><Label>Currency</Label><Select value={settings.currency || "USD"} onChange={(e) => setSettings({ ...settings, currency: e.target.value })}><option>USD ($)</option><option>ZMW (ZK)</option><option>EUR (€)</option></Select></div>
              </div>
              <div className="space-y-2"><Label>Address</Label><Textarea value={settings.storeAddress || ""} onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipt" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Receipt Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Receipt Header</Label><Input value={settings.receiptHeader || ""} onChange={(e) => setSettings({ ...settings, receiptHeader: e.target.value })} /></div>
              <div className="space-y-2"><Label>Receipt Footer</Label><Input value={settings.receiptFooter || ""} onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Tax Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Default Tax Rate (%)</Label><Input type="number" value={settings.taxRate || 10} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} /></div>
                <div className="space-y-2"><Label>Tax Name</Label><Input defaultValue="VAT" /></div>
              </div>
              <Separator />
              <div className="space-y-2"><Label>Tax Rules</Label>
                <div className="rounded-lg border p-3"><div className="flex items-center justify-between"><span className="text-sm">Electronics - 10%</span><Button variant="ghost" size="sm">Edit</Button></div></div>
                <div className="rounded-lg border p-3"><div className="flex items-center justify-between"><span className="text-sm">Groceries - 5%</span><Button variant="ghost" size="sm">Edit</Button></div></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {["Low Stock Alerts", "Daily Sales Summary", "New Orders", "Payment Received", "Employee Clock-in"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm font-medium">{item}</span>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div><CardTitle>User Management</CardTitle></div>
              <Button size="sm">Add User</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Admin User", "Sarah Manager", "Mike Cashier", "Lisa Stock"].map((name, i) => (
                  <div key={name} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{name.split(" ").map((n) => n[0]).join("")}</div>
                      <div><p className="text-sm font-medium">{name}</p><p className="text-xs capitalize text-muted-foreground">{["admin", "manager", "cashier", "stock_controller"][i]}</p></div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Theme</Label><Select><option>System</option><option>Light</option><option>Dark</option></Select></div>
              <div className="space-y-2"><Label>Primary Color</Label>
                <div className="flex gap-2">
                  {["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((c) => (
                    <button key={c} className="h-8 w-8 rounded-full border-2 border-transparent hover:border-foreground" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Backup & Restore</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4"><div className="flex items-center justify-between"><div><p className="font-medium">Create Backup</p><p className="text-sm text-muted-foreground">Download a backup of your data</p></div><Button variant="outline">Backup Now</Button></div></div>
              <div className="rounded-lg border p-4"><div className="flex items-center justify-between"><div><p className="font-medium">Export Data</p><p className="text-sm text-muted-foreground">Download all data as CSV</p></div><Button variant="outline">Export</Button></div></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
