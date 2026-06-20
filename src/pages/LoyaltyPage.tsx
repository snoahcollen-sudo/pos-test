import { Gift, Star, Award, Ticket, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const loyaltyMembers = [
  { id: 1, name: "David Lee", points: 3200, tier: "Gold", spent: 12500 },
  { id: 2, name: "Robert Brown", points: 2100, tier: "Silver", spent: 8920 },
  { id: 3, name: "John Smith", points: 1250, tier: "Bronze", spent: 4520 },
  { id: 4, name: "Emma Wilson", points: 890, tier: "Bronze", spent: 2890 },
  { id: 5, name: "Maria Garcia", points: 450, tier: "Basic", spent: 1230 },
]

const rewards = [
  { id: 1, name: "10% Discount", points: 500, redemptions: 45 },
  { id: 2, name: "Free Shipping", points: 200, redemptions: 120 },
  { id: 3, name: "$5 Voucher", points: 1000, redemptions: 23 },
  { id: 4, name: "Free Product", points: 2000, redemptions: 8 },
]

export function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Program</h1>
          <p className="text-muted-foreground">Manage customer rewards and loyalty</p>
        </div>
        <Button>Create Reward</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Gift size={20} className="text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Points</p><p className="text-2xl font-bold">7,890</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-success/10 p-2"><Star size={20} className="text-success" /></div><div><p className="text-sm text-muted-foreground">Active Members</p><p className="text-2xl font-bold">5</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-warning/10 p-2"><Award size={20} className="text-warning" /></div><div><p className="text-sm text-muted-foreground">Redemptions</p><p className="text-2xl font-bold">196</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-blue-500/10 p-2"><TrendingUp size={20} className="text-blue-500" /></div><div><p className="text-sm text-muted-foreground">Avg. Points/Member</p><p className="text-2xl font-bold">1,578</p></div></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Members</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Points</TableHead><TableHead>Tier</TableHead><TableHead>Spent</TableHead></TableRow></TableHeader>
              <TableBody>
                {loyaltyMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.points.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={m.tier === "Gold" ? "default" : m.tier === "Silver" ? "secondary" : "outline"}>{m.tier}</Badge></TableCell>
                    <TableCell>${m.spent.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Available Rewards</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Reward</TableHead><TableHead>Points</TableHead><TableHead>Redemptions</TableHead></TableRow></TableHeader>
              <TableBody>
                {rewards.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.points.toLocaleString()}</TableCell>
                    <TableCell>{r.redemptions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
