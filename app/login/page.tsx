"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate credentials
    router.push("/game/garden")
  }

  return (
    <div className="mobile-container flex flex-col p-6">
      <Link href="/" className="self-start mb-6">
        <ArrowLeft className="h-6 w-6 text-gray-500" />
      </Link>

      <div className="flex justify-center mb-6">
        <Image src="/images/logo.png" alt="Back2Life Logo" width={150} height={80} />
      </div>

      <h1 className="text-2xl font-bold text-center text-green-800 mb-8">Welcome Back</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-xl py-6"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="rounded-xl py-6"
          />
        </div>

        <div className="pt-6 flex justify-end">
          <Button type="submit" className="bg-green-500 hover:bg-green-600 rounded-xl px-8 py-6">
            Sign In
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

