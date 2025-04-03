import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Check, X } from "lucide-react";

const ExercisePopup = ({ onComplete, onClose }) => {
  const [stage, setStage] = useState("instructions"); // instructions, camera, preview
  const [rehabExercises, setRehabExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Load rehabilitation data from localStorage
    try {
      const rehabData = localStorage.getItem("rehabData");
      if (rehabData) {
        const parsed = JSON.parse(rehabData);
        if (parsed.rehabPlan && parsed.rehabPlan.length > 0) {
          setRehabExercises(parsed.rehabPlan);
          // Select a random exercise from the plan
          const randomIndex = Math.floor(Math.random() * parsed.rehabPlan.length);
          setCurrentExercise(parsed.rehabPlan[randomIndex]);
        }
      }
    } catch (error) {
      console.error("Error loading rehabilitation data:", error);
      // Fallback exercise if data can't be loaded
      setCurrentExercise({ 
        name: "Stretching Exercise", 
        frequency: "1" 
      });
    }
  }, []);

  const startCamera = async () => {
    setStage("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access your camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);
      setStage("preview");
      
      // Stop the camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmExercise = () => {
    // In a real app, you would upload the image to a server here
    onComplete();
  };

  const renderInstructions = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Exercise Time!</h2>
      
      {currentExercise ? (
        <>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800">{currentExercise.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete this {currentExercise.frequency === "1" ? 
                "1 time" : 
                `${currentExercise.frequency} times`} today
            </p>
          </div>
          
          <p className="text-sm">
            After completing your exercise, take a photo to record your progress!
          </p>
          
          <Button 
            onClick={startCamera}
            className="w-full bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
          >
            <Camera size={18} />
            Take a Photo
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-green-500 text-green-500"
            onClick={() => onComplete()}
          >
            Skip for Now
          </Button>
        </>
      ) : (
        <>
          <p>No exercise found. Please set up your rehabilitation plan.</p>
          <Button 
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => onComplete()}
          >
            Continue
          </Button>
        </>
      )}
    </div>
  );

  const renderCamera = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Take a Photo</h2>
      
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <video 
          ref={videoRef}
          autoPlay 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }
            setStage("instructions");
          }}
        >
          <X size={18} className="mr-1" /> Cancel
        </Button>
        
        <Button 
          className="flex-1 bg-green-500 hover:bg-green-600"
          onClick={capturePhoto}
        >
          <Camera size={18} className="mr-1" /> Capture
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-2">Confirm Your Photo</h2>
      
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={capturedImage} 
          alt="Captured exercise" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex justify-between gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={retakePhoto}
        >
          <Camera size={18} className="mr-1" /> Retake
        </Button>
        
        <Button 
          className="flex-1 bg-green-500 hover:bg-green-600"
          onClick={confirmExercise}
        >
          <Check size={18} className="mr-1" /> Done
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm mx-4">
        {stage === "instructions" && renderInstructions()}
        {stage === "camera" && renderCamera()}
        {stage === "preview" && renderPreview()}
      </div>
    </div>
  );
};

export default ExercisePopup;