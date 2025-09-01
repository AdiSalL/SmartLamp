"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useSoketi } from "../hooks/use-soketi";
import { MessageForm } from "./MessageForm";
import { MessageList } from "./MessageList";
import { SoketiConfigForm } from "./SoketiConfigForm";
import { Wifi, WifiOff, Settings, Car } from "lucide-react";
import ConnectionInfo from "./ConnectionInfo";
import ToggleButton from "./ToggleButton";

export default function Dashboard() {
  const [soketiConfig, setSoketiConfig] = useState(null);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const { messages, isConnected, sendMessage, clearMessages } = useSoketi(
    soketiConfig || undefined
  );

  useEffect(() => {
    const savedConfig = localStorage.getItem("soketi-config");
    if (savedConfig) {
      try {
        setSoketiConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("[v0] Failed to parse saved config:", error);
      }
    }
  }, []);

  const handleConfigSave = (config) => {
    setSoketiConfig(config);
    localStorage.setItem("soketi-config", JSON.stringify(config));
    setShowConfigForm(false);
  };

  if (!soketiConfig || showConfigForm) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <SoketiConfigForm
          onConfigSave={handleConfigSave}
          initialConfig={soketiConfig || undefined}
        />
      </div>
    );
  }
  let array = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Soketi Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time messaging dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "default" : "destructive"}
              className="flex items-center gap-2"
            >
              {isConnected ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfigForm(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-1">
          {/* Messages Area */}

          {/* Send Message Form */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            <div className="">
              <ToggleButton
                lastUpdate={lastUpdate}
                setLastUpdate={setLastUpdate}
                messages={messages}
                onSendMessage={sendMessage}
                isConnected={isConnected}
                lampName="Lampu Teras"
              />
            </div>
          </div>
          {/* Connection Info */}
          {!isConnected ? (
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
          ) : (
            <ConnectionInfo
              lastUpdate={lastUpdate}
              soketiConfig={soketiConfig}
              isConnected={isConnected}
            ></ConnectionInfo>
          )}
        </div>
      </div>
    </div>
  );
}
