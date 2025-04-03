"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Coins, Droplets, Shovel, SproutIcon as Seedling } from "lucide-react"
import { useRouter } from "next/navigation"
import { SproutIcon as SunIcon } from "lucide-react"
import ExercisePopup from "@/components/ExercisePopup"
import { getCoins, saveCoins, addCoins, spendCoins } from "../../utils/coins" // Import coin utilities


// Plant growth stages with more proportional heights
const GROWTH_STAGES = [
  {
    stage: 0,
    image: "/images/plant-stage0-seed.png",
    message: "Hello! I'm so happy you're here to help me grow!",
    height: 60,
  },
  {
    stage: 1,
    image: "/images/plant-stage1-sprouting.png",
    message: "I can feel myself getting stronger with your help!",
    height: 100,
  },
  {
    stage: 2,
    image: "/images/plant-stage2-leaves.png",
    message: "Look at my new leaves! Just like your progress in recovery!",
    height: 150,
  },
  {
    stage: 3,
    image: "/images/plant-stage3-taller.png",
    message: "I'm growing so well! Your dedication is paying off!",
    height: 200,
  },
  {
    stage: 4,
    image: "/images/plant-stage4-fullygrown.png",
    message: "I'm almost fully grown! Keep up the great work!",
    height: 250,
  },
]

// Garden tools 
const TOOLS = [
  { id: "water", name: "Water", icon: <Droplets className="h-6 w-6" />, color: "bg-blue-400" },
  { id: "sun", name: "Sun", icon: <SunIcon className="h-6 w-6" />, color: "bg-yellow-400" },
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
  // Use null as initial state for client/server rendering compatibility
  const [hydrated, setHydrated] = useState(false)
  const [growthStage, setGrowthStage] = useState(0)
  const [growthProgress, setGrowthProgress] = useState(0) // 0-100 for current stage
  const [plantHeight, setPlantHeight] = useState(GROWTH_STAGES[0].height)
  const [coins, setCoins] = useState(100) // Initial default value
  const [message, setMessage] = useState(GROWTH_STAGES[0].message)
  const [showMessage, setShowMessage] = useState(true)
  const [selectedTool, setSelectedTool] = useState(null)
  const [isGrowing, setIsGrowing] = useState(false)
  const [showHand, setShowHand] = useState(false)
  const handRef = useRef(null)
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [showExercisePopup, setShowExercisePopup] = useState(false)
  const [gardeningActions, setGardeningActions] = useState(0)

  const router = useRouter()

  // Load coins when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCoins(getCoins());
    }
  }, []);

  // Set up refreshing of coins when the page gets focus
  useEffect(() => {
    const refreshCoins = () => {
      setCoins(getCoins());
    };

    window.addEventListener('focus', refreshCoins);
    
    return () => {
      window.removeEventListener('focus', refreshCoins);
    };
  }, []);

  // This effect runs once after hydration
  useEffect(() => {
    setHydrated(true)
    
    // Check if it's the first visit of the day
    const lastVisitDate = localStorage.getItem('lastVisitDate')
    const today = new Date().toDateString()
    
    if (lastVisitDate !== today) {
      // First visit of the day, show exercise popup
      setShowExercisePopup(true)
      // Save today's date
      localStorage.setItem('lastVisitDate', today)
    }
  }, [])

  useEffect(() => {
    // Show initial message
    const timer = setTimeout(() => {
      setShowMessage(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Calculate container width for responsive sizing
    if (typeof window !== 'undefined' && containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    
      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth)
        }
      }
      
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])
  
  // Effect to check for showing exercise popup based on gardening actions
  useEffect(() => {
    if (gardeningActions > 0 && gardeningActions % 3 === 0) {
      // 30% chance to show exercise popup after every 3 gardening actions
      const randomChance = Math.random()
      if (randomChance < 0.3) {
        setShowExercisePopup(true)
      }
    }
  }, [gardeningActions])

  const handleToolSelect = (toolId) => {
    setSelectedTool(toolId)
  }

  const animateGrowth = (growthAmount) => {
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

  const animateToolUse = (toolId) => {
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
        case "sun":
          xPos = "50%"
          yPos = "20%"
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
      case "sun":
        newMessage = "Ahh, I love the sunshine! It helps me grow!"
        growthAmount = 20
        break
    }
    
    // Animate the tool use
    animateToolUse(selectedTool)

    // Show message
    setMessage(newMessage)
    setShowMessage(true)

    // Animate growth
    animateGrowth(growthAmount)

    // Use coin utility to spend coins
    if (spendCoins(10)) {
      // Update local state with new coin balance
      setCoins(getCoins())
    } else {
      // Not enough coins
      setMessage("I need more coins to grow!")
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
      return
    }

    // Reset selected tool
    setSelectedTool(null)

    // Hide message after delay
    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
    
    // Increment gardening actions counter
    setGardeningActions(prev => prev + 1)
  }

  // Handle exercise completion
  const handleExerciseComplete = () => {
    setShowExercisePopup(false)
    
    // Use coin utility to add 40 coins
    addCoins(40)
    // Update local state with new coin balance
    setCoins(getCoins())
    
    // Save the last exercise time
    localStorage.setItem('lastExerciseTime', new Date().getTime().toString())
    
    // Show a message congratulating the user
    setMessage("Great job on your exercise! You're helping me grow stronger!")
    setShowMessage(true)
    
    // Hide message after delay
    setTimeout(() => {
      setShowMessage(false)
    }, 4000)
    
    // Give the plant a growth boost
    animateGrowth(25)
  }

  // Calculate responsive plant width based on container size
  const getPlantWidth = () => {
    // Base width for small screens
    const baseWidth = 160
    
    // Scale up proportionally for larger screens, but cap at a reasonable size
    const responsiveWidth = typeof window !== 'undefined' 
      ? Math.min(baseWidth * (containerWidth / 375), 200)
      : baseWidth
    
    return responsiveWidth
  }

  return (
    <div className="mobile-container w-full flex flex-col h-full">
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
      <div 
        ref={containerRef}
        className="flex-1 relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-100 to-sky-50 w-full"
      >
        {/* Growth progress bar with level indicator */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 flex items-center">
          <div className="mr-2 bg-green-600 text-white text-xs font-bold rounded-md px-2 py-1">
            LV.{growthStage + 1}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${growthProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Plant container */}
        <div className="relative mt-16 mb-4 flex items-end justify-center w-full">
          {/* Plant and pot container */}
          <div className="relative flex flex-col items-center">
          {showMessage && (
            <div className="relative flex justify-center w-full mb-2">
              <div className="speech-bubble relative w-64 text-center bg-white p-2 rounded-lg shadow-md">
                <p className="text-sm">{message}</p>
                {/* Tail of bubble */}
                <div className="absolute left-1/2 bottom-0 w-4 h-4 bg-white transform rotate-45 translate-y-1/2 -translate-x-1/2 z-[-1]" />
              </div>
            </div>
          )}

            {/* Plant */}
            <div
              className={`transition-all duration-500 ease-out ${isGrowing ? "scale-110" : ""}`}
              style={{
                height: `${plantHeight}px`,
                maxHeight: "60vh",
                marginBottom: "-40px", // pull plant closer to pot
                zIndex: 10
              }}
            >
              <Image
                src={GROWTH_STAGES[growthStage].image || "/placeholder.svg"}
                alt="Plant"
                width={getPlantWidth()}
                height={plantHeight}
                className="object-contain"
                style={{
                  height: `${plantHeight}px`,
                  width: `${getPlantWidth()}px`,
                  maxWidth: "100%"
                }}
                priority
              />
            </div>

            {/* Pot */}
            <div className="relative w-80 h-56 z-0">
              <Image
                src="/images/planter.png"
                alt="Planter"
                fill
                className="object-contain"
                priority
              />
            </div>
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
        </div>

        {/* Activity circles */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity.id}
            className={`action-circle ${activity.color} text-white rounded-full w-10 h-10 flex items-center justify-center`}
            aria-label={activity.name}
            onClick={() => {
              if (activity.id === "progress") {
                router.push("/progressChart")
              } else if (activity.id === "community") {
                router.push("/ResourcesPage")
              } else if (activity.id === "exercises") {
                setShowExercisePopup(true) // Show exercise popup when exercise button is clicked
              } else if (activity.id === "achievements") {
                router.push("/achievementsPage")
              } else if (activity.id === "settings") {
                router.push("/SettingsPage")
              }
            }}
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
      
      {/* Exercise popup component */}
      {showExercisePopup && (
        <ExercisePopup 
          onComplete={handleExerciseComplete} 
          onClose={() => setShowExercisePopup(false)}
        />
      )}
    </div>
  )
}