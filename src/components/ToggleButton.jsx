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
}) {
  const [lampState, setLampState] = useState(false);
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
        // Ignore parse errors for non-JSON messages
      }
    }
  }, [messages]);

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
              <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/20">
                <div className="relative">
                  <div className="transition-all duration-500 ease-in-out transform hover:scale-110">
                    {lampState ? (
                      <div className="relative">
                        <Lightbulb className="h-10 w-10 text-yellow-400 animate-pulse drop-shadow-2xl" />
                        <div className="absolute inset-0 bg-yellow-300 opacity-30 blur-2xl rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <Lightbulb className="h-10 w-10 text-gray-400 opacity-50" />
                    )}
                  </div>
                </div>
                <span className="font-medium">
                  {lampState ? "🔴 Mati" : "🟢 Nyala"}
                </span>
                <Switch
                  checked={lampState}
                  onCheckedChange={handleToggle}
                  disabled={isLoading || !isConnected}
                  className="scale-125"
                />
              </div>

              {/* Big Action Button */}
              <Button
                onClick={handleToggle}
                disabled={isLoading || !isConnected}
                size="sm"
                className={`w-full py-6 text-1xl font-bold transition-all shadow-lg`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    {lampState ? (
                      <ZapOff className="h-6 w-6 mr-3" />
                    ) : (
                      <Zap className="h-6 w-6 mr-3" />
                    )}
                    {lampState ? "MATIKAN LAMPU" : "NYALAKAN LAMPU"}
                  </>
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
      {!isConnected && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <WifiOff className="h-8 w-8 text-destructive mx-auto mb-2" />
              <h3 className="font-semibold text-destructive">
                Connection Lost
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Check your Soketi configuration and network connection
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
