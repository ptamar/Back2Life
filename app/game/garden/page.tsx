"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Coins, Droplets, Shovel, SproutIcon as Seedling } from "lucide-react"

// Plant growth stages
const GROWTH_STAGES = [
  {
    stage: 0,
    image: "/images/plant-stage0.png",
    message: "Hello! I'm so happy you're here to help me grow!",
    height: 50,
  },
  {
    stage: 1,
    image: "/images/plant-stage1.png",
    message: "I can feel myself getting stronger with your help!",
    height: 80,
  },
  {
    stage: 2,
    image: "/images/plant-growth.png",
    message: "Look at my new leaves! Just like your progress in recovery!",
    height: 120,
  },
  {
    stage: 3,
    image: "/images/plant-growth.png",
    message: "I'm growing so well! Your dedication is paying off!",
    height: 160,
  },
  {
    stage: 4,
    image: "/images/plant-growth.png",
    message: "I'm almost fully grown! Keep up the great work!",
    height: 200,
  },
]

// Garden tools
const TOOLS = [
  { id: "water", name: "Water", icon: <Droplets className="h-6 w-6" />, color: "bg-blue-400" },
  { id: "soil", name: "Soil", icon: <Shovel className="h-6 w-6" />, color: "bg-amber-700" },
  { id: "fertilizer", name: "Fertilizer", icon: <Seedling className="h-6 w-6" />, color: "bg-green-600" },
]

// Activity circles
const ACTIVITIES = [
  { id: "exercises", name: "Exercises", emoji: "💪", color: "bg-purple-400" },
  { id: "progress", name: "Progress", emoji: "📊", color: "bg-blue-400" },
  { id: "achievements", name: "Achievements", emoji: "🏆", color: "bg-yellow-400" },
  { id: "community", name: "Community", emoji: "👥", color: "bg-green-400" },
  { id: "settings", name: "Settings", emoji: "⚙️", color: "bg-gray-400" },
]

export default function Garden() {
  const [growthStage, setGrowthStage] = useState(0)
  const [growthProgress, setGrowthProgress] = useState(0) // 0-100 for current stage
  const [plantHeight, setPlantHeight] = useState(GROWTH_STAGES[0].height)
  const [coins, setCoins] = useState(100)
  const [message, setMessage] = useState(GROWTH_STAGES[0].message)
  const [showMessage, setShowMessage] = useState(true)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [isGrowing, setIsGrowing] = useState(false)
  const [showHand, setShowHand] = useState(false)
  const handRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show initial message
    const timer = setTimeout(() => {
      setShowMessage(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
  }

  const animateGrowth = (growthAmount: number) => {
    setIsGrowing(true)

    // Calculate new growth progress
    const newProgress = Math.min(growthProgress + growthAmount, 100)

    // Animate the growth progress
    let currentProgress = growthProgress
    const interval = setInterval(() => {
      currentProgress += 1
      setGrowthProgress(currentProgress)

      // Calculate interpolated height between current and next stage
      const currentStageHeight = GROWTH_STAGES[growthStage].height
      const nextStageHeight =
        growthStage < GROWTH_STAGES.length - 1 ? GROWTH_STAGES[growthStage + 1].height : currentStageHeight + 40

      const progressRatio = currentProgress / 100
      const interpolatedHeight = currentStageHeight + (nextStageHeight - currentStageHeight) * progressRatio
      setPlantHeight(interpolatedHeight)

      if (currentProgress >= newProgress) {
        clearInterval(interval)
        setIsGrowing(false)

        // Check if we should advance to next stage
        if (currentProgress >= 100 && growthStage < GROWTH_STAGES.length - 1) {
          setGrowthStage((prev) => prev + 1)
          setGrowthProgress(0)
        }
      }
    }, 50)
  }

  const animateToolUse = (toolId: string) => {
    setShowHand(true)

    // Position the hand based on the tool
    if (handRef.current) {
      let xPos = "50%"
      let yPos = "60%"

      switch (toolId) {
        case "water":
          xPos = "60%"
          yPos = "40%"
          break
        case "soil":
          xPos = "40%"
          yPos = "70%"
          break
        case "fertilizer":
          xPos = "55%"
          yPos = "55%"
          break
      }

      handRef.current.style.left = xPos
      handRef.current.style.top = yPos
    }

    // Hide hand after animation
    setTimeout(() => {
      setShowHand(false)
    }, 1000)
  }

  const handleToolUse = () => {
    if (!selectedTool) return

    // Different responses based on tool
    let newMessage = ""
    let growthAmount = 0

    switch (selectedTool) {
      case "water":
        newMessage = "Thank you! I was so thirsty!"
        growthAmount = 15
        break
      case "soil":
        newMessage = "Mmm, fresh soil helps my roots grow strong!"
        growthAmount = 20
        break
      case "fertilizer":
        newMessage = "Wow! I can feel myself getting stronger already!"
        growthAmount = 25
        break
    }

    // Animate the tool use
    animateToolUse(selectedTool)

    // Show message
    setMessage(newMessage)
    setShowMessage(true)

    // Animate growth
    animateGrowth(growthAmount)

    // Add coins
    setCoins((prev) => prev + 10)

    // Reset selected tool
    setSelectedTool(null)

    // Hide message after delay
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  return (
    <div className="mobile-container w-full flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 border-b w-full">
        <div className="flex items-center gap-1">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="font-bold">{coins}</span>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-green-800">My Garden</h1>
        </div>
        <div className="w-5"></div> {/* Spacer for alignment */}
      </div>

      {/* Main garden area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-100 to-sky-50 w-full">
        {/* Growth progress bar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${growthProgress}%` }}
          ></div>
        </div>

        {/* Growth stage indicator */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-1">
          {GROWTH_STAGES.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index <= growthStage ? "bg-green-500" : "bg-gray-300"}`}
            ></div>
          ))}
        </div>

        {/* Plant container */}
        <div className="relative mt-12 mb-4 flex items-end justify-center w-full">
          {/* Pot */}
          <div className="relative w-40 h-28 bg-amber-700 rounded-t-full overflow-hidden">
            <div className="absolute bottom-0 w-full h-20 bg-amber-800 rounded-t-full"></div>
          </div>

          {/* Plant */}
          <div
            className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out ${
              isGrowing ? "scale-105" : ""
            }`}
            style={{ height: `${plantHeight}px` }}
          >
            <Image
              src={GROWTH_STAGES[growthStage].image || "/placeholder.svg"}
              alt="Plant"
              width={200}
              height={plantHeight}
              className="object-contain"
              style={{ height: `${plantHeight}px`, width: "auto" }}
            />
          </div>

          {/* Hand animation */}
          {showHand && (
            <div
              ref={handRef}
              className="absolute w-16 h-16 transition-all duration-300"
              style={{ transform: "translate(-50%, -50%)" }}
            >
              <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
            </div>
          )}

          {/* Speech bubble */}
          {showMessage && (
            <div className="speech-bubble absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 text-center">
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>

        {/* Activity circles */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
          {ACTIVITIES.map((activity) => (
            <button
              key={activity.id}
              className={`action-circle ${activity.color} text-white`}
              aria-label={activity.name}
            >
              <span className="text-xl">{activity.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Garden tools */}
      <div className="p-4 border-t bg-white w-full">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Garden Tools</h2>
        <div className="flex justify-between gap-4 w-full">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              className={`garden-tool flex-1 ${tool.color} text-white p-3 rounded-xl flex flex-col items-center gap-1 ${
                selectedTool === tool.id ? "ring-2 ring-green-500" : ""
              }`}
              onClick={() => handleToolSelect(tool.id)}
            >
              {tool.icon}
              <span className="text-xs">{tool.name}</span>
            </button>
          ))}
        </div>

        {selectedTool && (
          <Button onClick={handleToolUse} className="w-full mt-4 bg-green-500 hover:bg-green-600">
            Use {TOOLS.find((t) => t.id === selectedTool)?.name}
          </Button>
        )}
      </div>
    </div>
  )
}
