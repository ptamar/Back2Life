"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Bell, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Info, 
  LogOut, 
  User 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

// Define settings type
type Settings = {
  notifications: boolean;
  soundEffects: boolean;
  darkMode: boolean;
};

const SettingsPage = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    soundEffects: true,
    darkMode: false
  });
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('app-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  // Toggle setting and save to localStorage
  const toggleSetting = (key: keyof Settings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    setSettings(newSettings);
    localStorage.setItem('app-settings', JSON.stringify(newSettings));
  };

  // Logout function (placeholder)
  const handleLogout = () => {
    // TODO: Implement actual logout logic
    alert('Logout functionality to be implemented');
    router.push('/login');
  };

  return (
    <div className="mobile-container w-full flex flex-col h-full bg-white">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4 border-b w-full bg-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-green-800"
            onClick={() => router.push("/game/garden")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-green-800">Settings</h1>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Notifications Setting */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-800">Notifications</span>
          </div>
          <Switch
            checked={settings.notifications}
            onCheckedChange={() => toggleSetting('notifications')}
          />
        </div>

        {/* Sound Effects Setting */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            {settings.soundEffects ? (
              <Volume2 className="h-5 w-5 text-green-600" />
            ) : (
              <VolumeX className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium text-gray-800">Sound Effects</span>
          </div>
          <Switch
            checked={settings.soundEffects}
            onCheckedChange={() => toggleSetting('soundEffects')}
          />
        </div>

        {/* Dark Mode Setting */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            {settings.darkMode ? (
              <Moon className="h-5 w-5 text-indigo-600" />
            ) : (
              <Sun className="h-5 w-5 text-yellow-500" />
            )}
            <span className="font-medium text-gray-800">Dark Mode</span>
          </div>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={() => toggleSetting('darkMode')}
          />
        </div>

        {/* Profile Section */}
        <div 
          className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => {/* TODO: Navigate to profile page */}}
        >
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-800">Profile</span>
          </div>
        </div>

        {/* About Section */}
        <div 
          className="flex items-center justify-between bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100"
          onClick={() => setIsInfoDialogOpen(true)}
        >
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-800">About</span>
          </div>
        </div>

        {/* Logout Section */}
        <div 
          className="flex items-center justify-between bg-red-50 p-4 rounded-lg cursor-pointer hover:bg-red-100"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-800">Logout</span>
          </div>
        </div>
      </div>

      {/* About Dialog */}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Recovery Garden</DialogTitle>
            <DialogDescription>
              <p className="mb-4">
                Back2Life is a supportive application designed to help individuals 
                on their recovery journey, providing tools, achievements, and motivation.
              </p>
              <p className="mb-4">
                Version: 1.0.0
                {/* You can update version dynamically if needed */}
              </p>
              <p>
                © 2025 Back2Life. All rights reserved.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsInfoDialogOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;