"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Github, Mail, Loader2, Calendar, MapPin, User, AtSign, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "../hooks/useAuth"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

export function RegisterForm() {
  const { register, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    dob: "",
    city: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    await register(formData)
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Họ</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="Nguyễn"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="lastName"
                  placeholder="Văn A"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                placeholder="nguyen_van_a"
                value={formData.username}
                onChange={handleChange}
                className="pl-9"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="pl-9"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="pl-9"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dob">Ngày sinh</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Thành phố</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder="Hà Nội"
                  value={formData.city}
                  onChange={handleChange}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">
              {error}
            </p>
          )}

          <div className="flex items-start space-x-2 mt-2">
            <Checkbox id="terms" disabled={isLoading} required />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-xs font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tôi đồng ý với các Điều khoản và Chính sách của Vietnam Photo Scout
              </label>
            </div>
          </div>

          <Button disabled={isLoading} className="mt-4 w-full font-bold h-11 bg-primary hover:bg-primary/90 transition-all shadow-md active:scale-95">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Tham gia ngay
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium">
            Hoặc đăng ký bằng
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading} className="gap-2 h-10 hover:bg-muted/50 transition-colors">
          <Github className="h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} className="gap-2 h-10 hover:bg-muted/50 transition-colors">
          <Mail className="h-4 w-4" />
          Google
        </Button>
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-bold text-primary underline-offset-4 hover:underline transition-all"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
