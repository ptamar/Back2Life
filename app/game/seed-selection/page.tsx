"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const SEEDS = [
  {
    id: "sunflower",
    name: "Sunflower",
    description: "Grows tall and bright, just like your progress!",
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-yellow-400",
  },
  {
    id: "rose",
    name: "Rose",
    description: "Beautiful but requires patience and care.",
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-red-400",
  },
  {
    id: "cactus",
    name: "Cactus",
    description: "Resilient and strong, even in tough conditions.",
    image: "/placeholder.svg?height=100&width=100",
    color: "bg-green-400",
  },
]

export default function SeedSelection() {
  const router = useRouter()
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null)

  const handleSelectSeed = (seedId: string) => {
    setSelectedSeed(seedId)
  }

  const handleContinue = () => {
    if (selectedSeed) {
      localStorage.setItem("selectedSeed", selectedSeed)
      router.push("/game/garden")
    }
  }

  return (
    <div className="mobile-container flex flex-col p-6">
      <div className="flex justify-center mb-6">
        <Image src="/images/logo.png" alt="Back2Life Logo" width={150} height={80} />
      </div>

      <h1 className="text-2xl font-bold text-center text-green-800 mb-4">Choose Your Seed</h1>

      <p className="text-center text-gray-600 mb-8">
        Select a seed to begin your growth journey. Each seed grows differently, just like your recovery.
      </p>

      <div className="grid gap-4 mb-8">
        {SEEDS.map((seed) => (
          <Card
            key={seed.id}
            className={`cursor-pointer transition-all ${
              selectedSeed === seed.id ? "border-green-500 border-2 shadow-lg" : "hover:border-green-200"
            }`}
            onClick={() => handleSelectSeed(seed.id)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full ${seed.color} flex items-center justify-center`}>
                <Image
                  src={seed.image || "/placeholder.svg"}
                  alt={seed.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{seed.name}</h3>
                <p className="text-sm text-gray-600">{seed.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-auto">
        <Button
          onClick={handleContinue}
          disabled={!selectedSeed}
          className="w-full bg-green-500 hover:bg-green-600 rounded-xl py-6"
        >
          Start Growing
        </Button>
      </div>
    </div>
  )
}

