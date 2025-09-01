"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  Lightbulb,
  Loader2,
  Zap,
  ZapOff,
  Wifi,
  WifiOff,
  Activity,
  Clock,
  Settings,
} from "lucide-react";

export default function ToggleButton({
  onSendMessage,
  isConnected,
  messages,
  lastUpdate,
  setLastUpdate,
  lampName = "Nama Lampu",
}) {
  const [lampState, setLampState] = useState(() => {
    try {
      const saved = localStorage.getItem("lampState");
      return saved ? JSON.parse(saved) : false;
    } catch (err) {
      console.error("Failed to parse lampState:", err);

      return err;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const [autoMode, setAutoMode] = useState(false);

  // Listen for incoming lamp status messages
  useEffect(() => {
    if (messages && messages.length > 0) {
      const latestMessage = messages[0];

      try {
        // Check if message contains lamp status
        if (latestMessage.message) {
          const data = JSON.parse(latestMessage.message);

          if (data.state) {
            const newState = data.state === "ON";
            setLampState(newState);
            setLastUpdate(new Date());
            console.log("📡 Lamp state updated from ESP32:", data.state);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("lampState", JSON.stringify(lampState));
  }, [lampState]);

  const sendLampCommand = async (action) => {
    if (!isConnected) {
      console.error("Not connected to Soketi");
      return;
    }

    setIsLoading(true);

    try {
      const command = {
        action: action,
        timestamp: new Date().toISOString(),
        source: "web-dashboard",
        device: "lamp-control",
      };

      await onSendMessage(JSON.stringify(command), "Dashboard");

      // Optimistically update UI
      setLampState(action === "ON");
      setLastUpdate(new Date());

      console.log("📤 Sent lamp command:", action);
    } catch (error) {
      console.error("❌ Failed to send command:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    const newAction = lampState ? "OFF" : "ON";

    sendLampCommand(newAction);
  };

  //   const handleDirectControl = (state) => {
  //     const action = state ? "ON" : "OFF";
  //     sendLampCommand(action);
  //   };

  // Auto mode toggle every 5 seconds
  useEffect(() => {
    let interval;
    if (autoMode && isConnected) {
      interval = setInterval(() => {
        handleToggle();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoMode, lampState, isConnected]);

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      {/* Connection Status Header */}

      {/* Main Lamp Control */}
      <Card>
        <CardContent>
          <div className="flex flex-col items-center space-y-8">
            {/* Lamp Visual with Animation */}

            {/* Main Control */}
            <div className="flex flex-col items-center space-y-6 w-full">
              {/* Toggle Switch */}
              <h1>{lampName}</h1>
              <div className="flex flex-col md:flex-row justify-center items-center space-x-4 p-4  rounded-lg bg-muted/20 ">
                <div className="relative ">
                  <div className="transition-all duration-500 ease-in-out transform hover:scale-110">
                    {lampState ? (
                      <div className="relative ">
                        <Lightbulb className="h-30 w-30 text-yellow-400 animate-pulse drop-shadow-2xl" />
                        <div className="absolute inset-0 bg-yellow-300 opacity-30 blur-2xl rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Lightbulb className="h-30 w-30 text-gray-400 opacity-50" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Big Action Button */}
              <Button
                onClick={handleToggle}
                disabled={isLoading || !isConnected}
                className={`
    w-full h-16 text-lg font-semibold rounded-xl transition-all duration-300 
    ${
      lampState
        ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
        : "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25"
    }
    ${isLoading ? "opacity-70" : ""}
    ${
      !isConnected
        ? "opacity-50 cursor-not-allowed"
        : "hover:scale-[1.02] active:scale-[0.98]"
    }
  `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Mengirim...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {lampState ? (
                      <>
                        <ZapOff className="h-5 w-5 mr-2" />
                        Matikan
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5 mr-2" />
                        Nyalakan
                      </>
                    )}
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {/* <Card> */}
      {/* <CardHeader>
          <CardTitle className="text-lg">⚡ Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleDirectControl(true)}
              disabled={isLoading || !isConnected || lampState}
              className="flex items-center justify-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              Force ON
            </Button>

            <Button
              variant="outline"
              onClick={() => handleDirectControl(false)}
              disabled={isLoading || !isConnected || !lampState}
              className="flex items-center justify-center"
            >
              <ZapOff className="h-4 w-4 mr-2" />
              Force OFF
            </Button>
          </div>
        </CardContent> */}
      {/* </Card> */}

      {/* Connection Warning */}
    </div>
  );
}
