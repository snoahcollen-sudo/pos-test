import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/authStore"
import { useThemeStore } from "@/stores/themeStore"
import { Moon, Sun } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@smartpos.com",
      password: "password",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password)
    if (success) {
      toast.success("Welcome back!")
      navigate("/")
    } else {
      toast.error("Invalid email or password")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute right-4 top-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">SP</div>
          <h1 className="text-3xl font-bold">SmartPOS</h1>
          <p className="mt-2 text-muted-foreground">Enterprise Point of Sale</p>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@smartpos.com" className="pl-10" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pl-10 pr-10" {...register("password")} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-input" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>) : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Demo credentials:</strong><br />
              Email: admin@smartpos.com<br />
              Password: password
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
