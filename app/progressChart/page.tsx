"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Coins, ArrowLeft, Calendar, Activity, Clock, SunMedium } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCoins, addCoins } from "../utils/coins"; // Import coin utilities

// Define types for our data structure
type DayData = {
  day: string;
  therapyMinutes: number;
  outsideHours: number;
  steps: number;
  anxiety: number;
  stress: number;
  consistency: number;
};

type WeekData = {
  week: string;
  therapyMinutes: number;
  outsideHours: number;
  steps: number;
  anxiety: number;
  stress: number;
  consistency: number;
};

type TimeViewType = "weekly" | "monthly";

type SampleDataType = {
  weekly: DayData[];
  monthly: WeekData[];
};

// Sample data - replace with actual user data in production
const sampleData: SampleDataType = {
  weekly: [
    { day: "Mon", therapyMinutes: 25, outsideHours: 1.5, steps: 5000, anxiety: 3, stress: 4, consistency: 2 },
    { day: "Tue", therapyMinutes: 30, outsideHours: 2.0, steps: 6500, anxiety: 3, stress: 3, consistency: 3 },
    { day: "Wed", therapyMinutes: 20, outsideHours: 0.5, steps: 4000, anxiety: 4, stress: 4, consistency: 1 },
    { day: "Thu", therapyMinutes: 35, outsideHours: 2.5, steps: 7500, anxiety: 3, stress: 3, consistency: 4 },
    { day: "Fri", therapyMinutes: 40, outsideHours: 3.0, steps: 8000, anxiety: 2, stress: 2, consistency: 4 },
    { day: "Sat", therapyMinutes: 15, outsideHours: 4.0, steps: 9000, anxiety: 2, stress: 2, consistency: 3 },
    { day: "Sun", therapyMinutes: 10, outsideHours: 3.5, steps: 6000, anxiety: 1, stress: 2, consistency: 2 }
  ],
  monthly: [
    { week: "Week 1", therapyMinutes: 150, outsideHours: 12.5, steps: 35000, anxiety: 3, stress: 3, consistency: 2 },
    { week: "Week 2", therapyMinutes: 180, outsideHours: 15.0, steps: 42000, anxiety: 3, stress: 3, consistency: 3 },
    { week: "Week 3", therapyMinutes: 200, outsideHours: 18.5, steps: 45000, anxiety: 2, stress: 2, consistency: 4 },
    { week: "Week 4", therapyMinutes: 160, outsideHours: 16.0, steps: 40000, anxiety: 2, stress: 2, consistency: 3 }
  ]
};

// Define a type for our summary data
type SummaryData = {
  therapyMinutes: string;
  outsideHours: string;
  steps: number;
  anxiety: string;
  consistency: string;
  stress: string;
};

export default function TherapyProgress() {
  const [timeView, setTimeView] = useState<TimeViewType>("weekly");
  const [coins, setCoins] = useState(100); // Will be replaced with coins from utility
  
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
  
  // Use type assertion to tell TypeScript that this access is valid
  const data = sampleData[timeView];
  
  // Calculate averages for the summary cards
  const calculateAverages = (): SummaryData => {
    const initialValues = { 
      therapyMinutes: 0, 
      outsideHours: 0, 
      steps: 0, 
      anxiety: 0, 
      consistency: 0, 
      stress: 0 
    };
   
    
    // Type safe reduction
    const sum = data.reduce((acc: typeof initialValues, item: DayData | WeekData) => {
      return {
        therapyMinutes: acc.therapyMinutes + item.therapyMinutes,
        outsideHours: acc.outsideHours + item.outsideHours,
        steps: acc.steps + item.steps,
        anxiety: acc.anxiety + item.anxiety,
        consistency: acc.consistency + item.consistency,
        stress: acc.stress + item.stress
      };
    }, initialValues);
    
    return {
      therapyMinutes: (sum.therapyMinutes / data.length).toFixed(1),
      outsideHours: (sum.outsideHours / data.length).toFixed(1),
      steps: Math.round(sum.steps / data.length),
      anxiety: (sum.anxiety / data.length).toFixed(1),
      consistency: (sum.consistency / data.length).toFixed(1),
      stress: (sum.stress / data.length).toFixed(1)
    };
  };

  // Function to export data as CSV
  const exportToCSV = () => {
    // Create CSV header row
    const timeLabel = timeView === "weekly" ? "Day" : "Week";
    const headers = [timeLabel, "Therapy Minutes", "Outside Hours", "Steps", "Anxiety", "Stress", "Consistency"];
    
    // Create CSV content
    let csvContent = headers.join(",") + "\n";
    
    // Add data rows
    data.forEach(item => {
      const timeValue = (item as any)[timeView === "weekly" ? "day" : "week"];
      const row = [
        timeValue,
        item.therapyMinutes,
        item.outsideHours,
        item.steps,
        item.anxiety,
        item.stress,
        item.consistency
      ];
      csvContent += row.join(",") + "\n";
    });
    
    // Create a download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `therapy_progress_${timeView}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and clean up
    link.click();
    document.body.removeChild(link);
    
    // Reward the user with coins for exporting data (if they haven't already)
    rewardForExporting('csv');
  };
  
  // Function to generate and download PDF
  const exportToPDF = async () => {
    try {
      // We'll use browser's print functionality which allows PDF saving
      // Create a new window with formatted content
      const printWindow = window.open('', '', 'height=600,width=800');
      
      if (!printWindow) {
        alert("Please allow popups to generate PDF reports");
        return;
      }
      
      const averages = calculateAverages();
      
      // Generate HTML content for the PDF
      printWindow.document.write(`
        <html>
          <head>
            <title>Therapy Progress Report - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { text-align: center; color: #16a34a; }
              .report-date { text-align: center; margin-bottom: 30px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
              th { background-color: #f0f9ff; font-weight: bold; }
              .summary { margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-radius: 8px; }
              .summary h2 { margin-top: 0; color: #16a34a; }
              .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #666; }
            </style>
          </head>
          <body>
            <h1>Therapy Progress Report</h1>
            <div class="report-date">Generated on ${new Date().toLocaleDateString()} - ${timeView.charAt(0).toUpperCase() + timeView.slice(1)} View</div>
            
            <div class="summary">
              <h2>Summary</h2>
              <p>Average Therapy Time: ${averages.therapyMinutes} minutes per ${timeView === "weekly" ? "day" : "week"}</p>
              <p>Average Time Outside: ${averages.outsideHours} hours per ${timeView === "weekly" ? "day" : "week"}</p>
              <p>Average Steps: ${averages.steps} per ${timeView === "weekly" ? "day" : "week"}</p>
              <p>Average Anxiety Level: ${averages.anxiety} (scale: 0-5)</p>
              <p>Average Stress Level: ${averages.stress} (scale: 0-5)</p>
              <p>Average Consistency Level: ${averages.consistency} (scale: 0-5)</p>
            </div>
            
            <h2>Detailed Data</h2>
            <table>
              <thead>
                <tr>
                  <th>${timeView === "weekly" ? "Day" : "Week"}</th>
                  <th>Therapy (min)</th>
                  <th>Outside (hrs)</th>
                  <th>Steps</th>
                  <th>Anxiety</th>
                  <th>Stress</th>
                  <th>Consistency</th>
                </tr>
              </thead>
              <tbody>
                ${data.map(item => {
                  const timeValue = (item as any)[timeView === "weekly" ? "day" : "week"];
                  return `
                    <tr>
                      <td>${timeValue}</td>
                      <td>${item.therapyMinutes}</td>
                      <td>${item.outsideHours}</td>
                      <td>${item.steps}</td>
                      <td>${item.anxiety}</td>
                      <td>${item.stress}</td>
                      <td>${item.consistency}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>This report is intended for medical professionals. Please consult with your healthcare provider before making any changes to your treatment plan.</p>
            </div>
          </body>
        </html>
      `);
      
      // Trigger print dialog which allows saving as PDF
      printWindow.document.close();
      printWindow.focus();
      
      // Brief timeout to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
      
      // Reward the user with coins for exporting data (if they haven't already)
      rewardForExporting('pdf');
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };
  
  // Function to reward users for exporting their data (once per format)
  const rewardForExporting = (format: 'csv' | 'pdf') => {
    // Get list of exported formats
    const exportedFormats = JSON.parse(localStorage.getItem('exportedFormats') || '[]');
    
    // If this format hasn't been exported before, add coins
    if (!exportedFormats.includes(format)) {
      // Add 10 coins for each new export format
      addCoins(10);
      // Update local state
      setCoins(getCoins());
      
      // Mark as exported
      exportedFormats.push(format);
      localStorage.setItem('exportedFormats', JSON.stringify(exportedFormats));
      
      // Show notification
      alert(`Thank you for sharing your progress data! You've earned 10 coins 🌱`);
    }
  };
  
  const averages = calculateAverages();
  const xAxisKey = timeView === "weekly" ? "day" : "week";
  const router = useRouter();

  return (
    <div className="mobile-container w-full flex flex-col h-full">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 border-b w-full bg-white">
        <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-green-800"
          onClick={() => router.push("/game/garden")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

          <h1 className="text-lg font-bold text-green-800">My Progress</h1>
        </div>
        <div className="flex items-center gap-1">
          <Coins className="h-5 w-5 text-yellow-500" />
          <span className="font-bold">{coins}</span>
        </div>
      </div>
      
      {/* Main content area with gradient background */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-sky-100 to-sky-50">
          {/* Download options */}
          <div className="p-4 space-y-3">
          <Button 
            onClick={exportToCSV}
            variant="outline"
            className="w-full bg-white flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </Button>
          
          <Button 
            onClick={exportToPDF}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 mb-6"
          >
            <Download size={16} />
            Export PDF for Doctor
          </Button>
        </div>
        {/* Time view selection */}
        <div className="p-4 pb-2">
          <Tabs defaultValue="weekly" className="w-full" onValueChange={(value) => setTimeView(value as TimeViewType)}>
            <TabsList className="grid w-full grid-cols-2 bg-blue-100">
              <TabsTrigger value="weekly" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Weekly View
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Monthly View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-purple-100 rounded-full p-3 mb-2">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Therapy Time</p>
              <div className="text-xl font-bold">{averages.therapyMinutes} min</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-3 mb-2">
                <SunMedium className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Time Outside</p>
              <div className="text-xl font-bold">{averages.outsideHours} hrs</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-3 mb-2">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Steps</p>
              <div className="text-xl font-bold">{averages.steps}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 border-none shadow-sm">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="bg-yellow-100 rounded-full p-3 mb-2">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600">Consistency</p>
              <div className="text-xl font-bold">{averages.consistency}/5</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mental Health Metrics */}
        <Card className="m-4 bg-white/90 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-center font-medium text-green-800">Mental Health Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={xAxisKey} tick={{fontSize: 12}} />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{fontSize: '12px'}} />
                  <Legend iconSize={10} wrapperStyle={{fontSize: '12px'}} />
                  <Line type="monotone" dataKey="anxiety" name="Anxiety" stroke="#ff7300" strokeWidth={2} dot={{r: 4}} />
                  <Line type="monotone" dataKey="stress" name="Stress" stroke="#ff0000" strokeWidth={2} dot={{r: 4}} />
                  <Line type="monotone" dataKey="consistency" name="Consistency" stroke="#00b0ff" strokeWidth={2} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Activity Charts */}
        <Card className="m-4 bg-white/90 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-center font-medium text-green-800">Therapy Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={xAxisKey} tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{fontSize: '12px'}} />
                  <Bar dataKey="therapyMinutes" name="Minutes" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Outside Time Chart */}
        <Card className="m-4 bg-white/90 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-md text-center font-medium text-green-800">Time Outside</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey={xAxisKey} tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip contentStyle={{fontSize: '12px'}} />
                  <Bar dataKey="outsideHours" name="Hours" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}