"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Coins, Trophy, Star, LockKeyhole, Award, Target, Clock, Leaf } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCoins, addCoins } from "../utils/coins";

// Achievement types
type Achievement = {
  id: string;
  category: 'daily' | 'progress' | 'special';
  title: string;
  description: string;
  icon: string;
  requirement: string;
  reward: number;
  completed: boolean;
  progress?: number;
  maxProgress?: number;
  claimed?: boolean;
};

const renderIcon = (iconName: string) => {
  const iconProps = { className: "h-6 w-6" }

  const icons: Record<string, JSX.Element> = {
    Trophy: <Trophy {...iconProps} />,
    Target: <Target {...iconProps} />,
    Leaf: <Leaf {...iconProps} />,
    Clock: <Clock {...iconProps} />,
    Award: <Award {...iconProps} />,
    Coins: <Coins {...iconProps} />,
    Star: <Star {...iconProps} />,
    LockKeyhole: <LockKeyhole {...iconProps} />,
  }

  return icons[iconName] || <Trophy {...iconProps} />
}

const AchievementsPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [coins, setCoins] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const router = useRouter();

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
    
    // Load coins and achievements data
    const initialCoins = getCoins();
    setCoins(initialCoins);
    loadAchievements(initialCoins);

    // Set up refreshing of coins when the page gets focus
    const refreshCoins = () => {
      setCoins(getCoins());
    };

    window.addEventListener('focus', refreshCoins);
    
    return () => {
      window.removeEventListener('focus', refreshCoins);
    };
  }, []);

  // Load achievements from localStorage or set defaults
  const loadAchievements = (currentCoins: number) => {
    const savedAchievements = localStorage.getItem('achievements');
    
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    } else {
      // Default achievements
      const defaultAchievements: Achievement[] = [
        {
          id: 'first-exercise',
          category: 'daily',
          title: 'First Steps',
          description: 'Complete your first exercise',
          icon: "Trophy",
          requirement: 'Complete 1 exercise',
          reward: 20,
          completed: false,
          progress: 0,
          maxProgress: 1
        },
        {
          id: 'exercise-streak',
          category: 'daily',
          title: 'Consistency is Key',
          description: 'Complete exercises for 3 days in a row',
          icon: "Target",
          requirement: '3 consecutive days',
          reward: 50,
          completed: false,
          progress: 1,
          maxProgress: 3
        },
        {
          id: 'use-all-tools',
          category: 'daily',
          title: 'Green Thumb',
          description: 'Use all garden tools in one day',
          icon: "Leaf",
          requirement: 'Use water and sun in one day',
          reward: 30,
          completed: false,
          progress: 1,
          maxProgress: 2
        },
        {
          id: 'export-data',
          category: 'progress',
          title: 'Data Analyst',
          description: 'Export your progress data',
          icon: 'Clock',
          requirement: 'Export any progress report',
          reward: 25,
          completed: false,
        },
        {
          id: 'visit-resources',
          category: 'progress',
          title: 'Resource Explorer',
          description: 'Visit 3 different rehabilitation resources',
          icon: 'Award',
          requirement: 'Visit 3 resources',
          reward: 45,
          completed: false,
          progress: 0,
          maxProgress: 3,
        },
        {
          id: 'plant-growth',
          category: 'progress',
          title: 'Master Gardener',
          description: 'Grow your plant to level 3',
          icon: 'Leaf',
          requirement: 'Reach plant level 3',
          reward: 100,
          completed: false,
          progress: 1,
          maxProgress: 3,
        },
        {
          id: 'reach-100-coins',
          category: 'special',
          title: 'First Fortune',
          description: 'Collect 100 coins',
          icon: 'Coins',
          requirement: 'Have 100 coins at once',
          reward: 50,
          completed: currentCoins >= 100,
          progress: currentCoins,
          maxProgress: 100,
        },
        {
          id: 'all-daily',
          category: 'special',
          title: 'Recovery Champion',
          description: 'Complete all daily achievements',
          icon: 'Star',
          requirement: 'Complete all daily achievements',
          reward: 200,
          completed: false,
        },
        {
          id: 'secret',
          category: 'special',
          title: '???',
          description: 'Secret achievement',
          icon: 'LockKeyhole',
          requirement: 'Discover the secret',
          reward: 100,
          completed: false,
        }
      ];
      
      setAchievements(defaultAchievements);
      localStorage.setItem('achievements', JSON.stringify(defaultAchievements));
    }
  };

  // Function to claim reward for a completed achievement
  const claimReward = (achievement: Achievement) => {
    if (!achievement.completed) return;
    
    // Check if achievement is already claimed
    const isAlreadyClaimed = localStorage.getItem(`claimed_${achievement.id}`);
    if (isAlreadyClaimed) return;
    
    // Add coins reward
    addCoins(achievement.reward);
    setCoins(getCoins());
    
    // Mark as claimed
    localStorage.setItem(`claimed_${achievement.id}`, 'true');
    
    // Update UI to reflect claim
    const updatedAchievements = achievements.map(a => {
      if (a.id === achievement.id) {
        return { ...a, claimed: true };
      }
      return a;
    });
    
    setAchievements(updatedAchievements);
    localStorage.setItem('achievements', JSON.stringify(updatedAchievements));
    
    // Show notification
    alert(`Congratulations! You've earned ${achievement.reward} coins! 🎉`);
  };

  // If not client-side, return null to prevent hydration issues
  if (!isClient) {
    return null;
  }

  // Filter achievements by category
  const dailyAchievements = achievements.filter(a => a.category === 'daily');
  const progressAchievements = achievements.filter(a => a.category === 'progress');
  const specialAchievements = achievements.filter(a => a.category === 'special');

  // Calculate statistics
  const totalAchievements = achievements.length;
  const completedAchievements = achievements.filter(a => a.completed).length;
  const completionPercentage = Math.round((completedAchievements / totalAchievements) * 100);
  const totalCoinsEarned = achievements
    .filter(a => a.completed && localStorage.getItem(`claimed_${a.id}`))
    .reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="mobile-container w-full flex flex-col h-full">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 border-b w-full bg-white">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-800"
            onClick={() => router.push("/game/garden")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-green-800">Achievements</h1>
        </div>
        <div className="flex items-center gap-1">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="font-bold">{coins}</span>
        </div>
      </div>
      
      {/* Stats overview */}
      <div className="bg-gradient-to-b from-green-50 to-green-100 p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-green-800 mb-2">Your Progress</h2>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Completion</span>
            <span className="text-green-800 font-medium">{completedAchievements}/{totalAchievements}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <div className="text-green-800 font-semibold">{completedAchievements}</div>
              <div className="text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-green-800 font-semibold">{totalCoinsEarned}</div>
              <div className="text-gray-500">Coins Earned</div>
            </div>
            <div className="text-center">
              <div className="text-green-800 font-semibold">{completionPercentage}%</div>
              <div className="text-gray-500">Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements tabs */}
      <Tabs defaultValue="daily" className="flex-1 flex flex-col">
        <div className="border-b bg-white">
          <TabsList className="w-full p-0 bg-transparent">
            <TabsTrigger 
              value="daily" 
              className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500"
            >
              Progress
            </TabsTrigger>
            <TabsTrigger 
              value="special" 
              className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-500"
            >
              Special
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-gradient-to-b from-sky-100 to-sky-50">
          <TabsContent value="daily" className="mt-0 space-y-4">
            {dailyAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                onClaim={claimReward} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="progress" className="mt-0 space-y-4">
            {progressAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                onClaim={claimReward} 
              />
            ))}
          </TabsContent>
          
          <TabsContent value="special" className="mt-0 space-y-4">
            {specialAchievements.map((achievement) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                onClaim={claimReward} 
              />
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// Achievement Card Component
const AchievementCard = ({ 
  achievement, 
  onClaim 
}: { 
  achievement: Achievement; 
  onClaim: (achievement: Achievement) => void;
}) => {
  const isClaimed = localStorage.getItem(`claimed_${achievement.id}`) === 'true';
  
  return (
    <Card className={`overflow-hidden border-none ${achievement.completed ? 'bg-white' : 'bg-gray-100'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-full ${achievement.completed ? 'bg-green-100' : 'bg-gray-200'}`}>
            {renderIcon(achievement.icon)}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-medium ${achievement.completed ? 'text-green-800' : 'text-gray-600'}`}>
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {achievement.description}
            </p>
            
            {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, Math.round((achievement.progress / achievement.maxProgress) * 100))}%` 
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">
                  {achievement.progress} / {achievement.maxProgress}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end justify-between h-full">
            <div className="flex items-center text-amber-500">
              <Coins className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">{achievement.reward}</span>
            </div>
            
            {achievement.completed && !isClaimed ? (
              <Button 
                onClick={() => onClaim(achievement)}
                size="sm" 
                className="mt-2 bg-green-500 hover:bg-green-600 text-xs py-1 h-8"
              >
                Claim
              </Button>
            ) : achievement.completed ? (
              <div className="text-xs text-green-600 mt-2 font-medium">
                Claimed ✓
              </div>
            ) : (
              <div className="text-xs text-gray-500 mt-2">
                {achievement.requirement}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsPage;