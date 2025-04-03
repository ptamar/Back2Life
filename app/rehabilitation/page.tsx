"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const INJURY_TYPES = [
  "Knee Injury",
  "Shoulder Injury",
  "Back Pain",
  "Ankle Sprain",
  "Wrist Injury",
  "Hip Pain",
  "Neck Pain",
  "Elbow Injury",
]

const REHAB_PLANS = [
  "Strength Training",
  "Flexibility Exercises",
  "Balance Training",
  "Cardiovascular Exercise",
  "Aquatic Therapy",
  "Manual Therapy",
  "Functional Training",
]

export default function Rehabilitation() {
  const router = useRouter()
  const [rehabData, setRehabData] = useState({
    injuryType: "",
    rehabPlan: [{ name: "", frequency: "1" }],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [showRehabOptions, setShowRehabOptions] = useState(false)

  const handleChange = (name: string, value: string) => {
    setRehabData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would validate and save the data
    localStorage.setItem("rehabData", JSON.stringify(rehabData))
    router.push("/game/seed-selection")
  }

  const filteredRehabPlans = REHAB_PLANS.filter((plan) => plan.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="mobile-container flex flex-col p-6">
      <Link href="/register" className="self-start mb-6">
        <ArrowLeft className="h-6 w-6 text-gray-500" />
      </Link>

      <div className="flex justify-center mb-6">
        <Image src="/images/logo.png" alt="Back2Life Logo" width={150} height={80} />
      </div>

      <h1 className="text-2xl font-bold text-center text-green-800 mb-8">Injury & Rehabilitation Details</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="injuryType">Injury Type</Label>
          <Select onValueChange={(value) => handleChange("injuryType", value)} required>
            <SelectTrigger className="rounded-xl py-6">
              <SelectValue placeholder="Select your injury type" />
            </SelectTrigger>
            <SelectContent>
              {INJURY_TYPES.map((injury) => (
                <SelectItem key={injury} value={injury}>
                  {injury}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
        <Label>Rehabilitation Plan</Label>

        {rehabData.rehabPlan.map((plan, index) => (
          <div key={index} className="border p-4 rounded-xl space-y-3">
            <div>
              <Label>Exercise #{index + 1}</Label>
              <Input
                placeholder="Type or select an exercise"
                value={plan.name}
                onChange={(e) => {
                  const newPlans = [...rehabData.rehabPlan]
                  newPlans[index].name = e.target.value
                  setRehabData((prev) => ({ ...prev, rehabPlan: newPlans }))
                }}
                list={`rehab-options-${index}`}
                className="rounded-xl py-6 mt-1"
              />
              <datalist id={`rehab-options-${index}`}>
                {REHAB_PLANS.filter((p) =>
                  p.toLowerCase().includes(plan.name.toLowerCase())
                ).map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </div>

            <div>
              <Label>How many times per day?</Label>
              <Select
                value={plan.frequency}
                onValueChange={(value) => {
                  const newPlans = [...rehabData.rehabPlan]
                  newPlans[index].frequency = value
                  setRehabData((prev) => ({ ...prev, rehabPlan: newPlans }))
                }}
              >
                <SelectTrigger className="rounded-xl py-6 mt-1">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "time" : "times"} per day
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {rehabData.rehabPlan.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  const updated = rehabData.rehabPlan.filter((_, i) => i !== index)
                  setRehabData((prev) => ({ ...prev, rehabPlan: updated }))
                }}
              >
                Remove Exercise
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setRehabData((prev) => ({
              ...prev,
              rehabPlan: [...prev.rehabPlan, { name: "", frequency: "1" }],
            }))
          }
        >
          + Add Exercise
        </Button>
      </div>



        <div className="pt-6 flex justify-end">
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 rounded-xl px-8 py-6"
            disabled={!rehabData.injuryType || !rehabData.rehabPlan}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  )
}

