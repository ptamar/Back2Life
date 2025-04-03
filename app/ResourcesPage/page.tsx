"use client"

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Search, X, ArrowLeft, Coins } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getCoins, addCoins } from "../utils/coins"; // Import coin utilities

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [coins, setCoins] = useState(100); // Will be replaced by coins from utility
  const router = useRouter();

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

  // Categories of resources
  const resources = [
    {
      category: "medical",
      title: "שיקום רפואי וגופני",
      icon: "🧑‍⚕️",
      links: [
        {
          title: "מרכזים רפואיים לשיקום (כללית)",
          url: "https://www.clalit.co.il/he/info/ServiceBag/Pages/rehabilitation_centers.aspx",
          description: "מידע על מרכזי שיקום של קופת חולים כללית"
        },
        {
          title: "בית חולים רעות",
          url: "https://www.reuth.org.il/",
          description: "מרכז שיקום מוביל בישראל"
        },
        {
          title: "יד מכוונת",
          url: "https://www.yadmev.org.il/",
          description: "ייעוץ והכוונה לנכים ומשתקמים"
        }
      ]
    },
    {
      category: "mental",
      title: "בריאות הנפש",
      icon: "🧠",
      links: [
        {
          title: "אנוש",
          url: "https://www.enosh.org.il/",
          description: "העמותה הישראלית לבריאות הנפש"
        },
        {
          title: "סהר",
          url: "https://www.sahar.org.il/",
          description: "תמיכה נפשית מקוונת"
        },
        {
          title: "ער\"ן",
          url: "https://www.eran.org.il/",
          description: "עזרה ראשונה נפשית"
        }
      ]
    },
    {
      category: "rights",
      title: "זכויות רפואיות וחברתיות",
      icon: "⚖️",
      links: [
        {
          title: "ביטוח לאומי",
          url: "https://www.btl.gov.il/",
          description: "פורטל מידע על זכויות וקצבאות"
        },
        {
          title: "שיקום נכים – משרד הביטחון",
          url: "https://www.gov.il/he/departments/ministry_of_defense_rehabilitation",
          description: "זכויות ושירותי שיקום לנכי צה\"ל"
        },
        {
          title: "כל זכות",
          url: "https://www.kolzchut.org.il/he/%D7%9E%D7%A9%D7%AA%D7%A7%D7%9E%D7%99%D7%9D",
          description: "מידע מקיף על זכויות משתקמים"
        }
      ]
    },
    {
      category: "employment",
      title: "הכשרה תעסוקתית ושילוב בעבודה",
      icon: "💼",
      links: [
        {
          title: "מרכזי תעסוקה – עמותת איל\"ן",
          url: "https://www.ilan-israel.co.il/",
          description: "סיוע תעסוקתי לאנשים עם מוגבלויות פיזיות"
        },
        {
          title: "מרכזי תעסוקה נתמכת – ג'וינט ישראל",
          url: "https://www.tevet.org.il/",
          description: "תוכניות תעסוקה לאוכלוסיות מיוחדות"
        },
        {
          title: "עמותת לשם – שילוב סטודנטים עם מוגבלות",
          url: "https://www.lashem.ac.il/",
          description: "ליווי סטודנטים עם מוגבלויות באקדמיה"
        }
      ]
    },
    {
      category: "community",
      title: "קהילה ותמיכה",
      icon: "🧑‍🤝‍🧑",
      links: [
        {
          title: "קהילה נגישה",
          url: "https://www.kolzchut.org.il/he/קהילה_נגישה",
          description: "קהילות תמיכה מקומיות ברחבי הארץ"
        },
        {
          title: "נגישות ישראל",
          url: "https://www.aisrael.org/",
          description: "קידום נגישות ושילוב אנשים עם מוגבלויות"
        },
        {
          title: "שיקום שדרה ישראל (פייסבוק)",
          url: "https://www.facebook.com/groups/",
          description: "קבוצת תמיכה לנפגעי שדרה"
        },
        {
          title: "נפגעי PTSD (פייסבוק)",
          url: "https://www.facebook.com/groups/",
          description: "קבוצת תמיכה לנפגעי טראומה נפשית"
        },
        {
          title: "Amputee Israel Group",
          url: "https://www.facebook.com/groups/",
          description: "קבוצת תמיכה לאנשים עם קטיעות"
        }
      ]
    },
    {
      category: "housing",
      title: "תחבורה והתאמות ביתיות",
      icon: "🏠",
      links: [
        {
          title: "עמותת נגישות ישראל",
          url: "https://www.aisrael.org/",
          description: "ייעוץ בנגישות בבית ובתחבורה"
        },
        {
          title: "סיוע בדיור – משרד השיכון",
          url: "https://www.gov.il/he/departments/ministry_of_construction_and_housing",
          description: "סיוע בהתאמות דיור לאנשים עם מוגבלות"
        },
        {
          title: "זכאות לרכב מותאם – ביטוח לאומי",
          url: "https://www.btl.gov.il/benefits/Disability/rehabilitation/Pages/AdaptedVehicle.aspx",
          description: "מידע על זכאויות לרכב מותאם"
        }
      ]
    }
  ];
  
  // Filter resources based on search term
  const filterResources = (items) => {
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // For each category, filter its links
  const filteredResources = resources.map(category => ({
    ...category,
    links: filterResources(category.links)
  })).filter(category => category.links.length > 0);

  // Award coins for visiting important resources using the coin utility
  const handleResourceClick = (resource) => {
    // Check if this resource has been visited before
    const visitedResources = JSON.parse(localStorage.getItem('visitedResources') || '[]');
    
    if (!visitedResources.includes(resource.url)) {
      // Add 5 coins for first visit to each resource using the utility
      addCoins(5);
      // Update the local state to reflect the new coin balance
      setCoins(getCoins());
      
      // Mark as visited
      visitedResources.push(resource.url);
      localStorage.setItem('visitedResources', JSON.stringify(visitedResources));
      
      // Show a small notification
      alert("נוספו 5 מטבעות! תודה על ההשקעה בשיקום שלך 🌱");
    }
  };

  return (
    <div className="mobile-container w-full flex flex-col h-full">
      {/* Top bar - Matching garden page style */}
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
          <h1 className="text-lg font-bold text-green-800">משאבי שיקום</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
            {showSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-1">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{coins}</span>
          </div>
        </div>
      </div>
      
      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 pt-0 bg-white border-b">
          <Input
            placeholder="חיפוש משאבים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl"
          />
        </div>
      )}

      {/* Main content with tabs */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        {/* Tab list */}
        <div className="overflow-x-auto bg-white border-b">
          <TabsList className="bg-gray-100 p-1 flex space-x-1 mx-4 my-2">
            <TabsTrigger value="all" className="rounded-xl text-sm">
              הכל
            </TabsTrigger>
            {resources.map((category) => (
              <TabsTrigger 
                key={category.category} 
                value={category.category}
                className="rounded-xl text-sm whitespace-nowrap"
              >
                {category.icon} {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-auto p-4 bg-gradient-to-b from-sky-100 to-sky-50">
          <TabsContent value="all" className="space-y-6 mt-0">
            {filteredResources.length > 0 ? (
              filteredResources.map((category) => (
                <div key={category.category}>
                  <h2 className="text-lg font-semibold mb-3 flex items-center text-green-800">
                    <span className="mr-2">{category.icon}</span> {category.title}
                  </h2>
                  <div className="space-y-3">
                    {category.links.map((link, index) => (
                      <ResourceCard 
                        key={index} 
                        resource={link} 
                        onClick={() => handleResourceClick(link)}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>לא נמצאו תוצאות עבור "{searchTerm}"</p>
              </div>
            )}
          </TabsContent>

          {resources.map((category) => (
            <TabsContent key={category.category} value={category.category} className="space-y-3 mt-0">
              {filterResources(category.links).length > 0 ? (
                filterResources(category.links).map((link, index) => (
                  <ResourceCard 
                    key={index} 
                    resource={link} 
                    onClick={() => handleResourceClick(link)}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>לא נמצאו תוצאות עבור "{searchTerm}"</p>
                </div>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({ resource, onClick }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow bg-white/90 border-none">
      <CardContent className="p-0">
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block p-4"
          onClick={() => onClick && onClick(resource)}
        >
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-medium text-green-800">{resource.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
            </div>
            <div className="text-green-600">
              <ExternalLink className="h-5 w-5" />
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export default ResourcesPage;