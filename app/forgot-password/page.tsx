"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send a password reset email
    setSubmitted(true)
  }

  return (
    <div className="mobile-container flex flex-col p-6">
      <Link href="/login" className="self-start mb-6">
        <ArrowLeft className="h-6 w-6 text-gray-500" />
      </Link>

      <div className="flex justify-center mb-6">
        <Image src="/images/logo.png" alt="Back2Life Logo" width={150} height={80} />
      </div>

      <h1 className="text-2xl font-bold text-center text-green-800 mb-4">Forgot Password</h1>

      {!submitted ? (
        <>
          <p className="text-center text-gray-600 mb-8">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl py-6"
              />
            </div>

            <div className="pt-6">
              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 rounded-xl py-6">
                Send Reset Link
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="bg-green-100 text-green-800 p-4 rounded-xl">
            If an account exists with that email, we&apos;ve sent a password reset link.
          </div>

          <Button asChild variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

