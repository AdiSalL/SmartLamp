"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface SoketiConfig {
  host: string
  port: string
  appId: string
  key: string
  secret: string
  cluster: string
  forceTLS: boolean
}

interface SoketiConfigFormProps {
  onConfigSave: (config: SoketiConfig) => void
  initialConfig?: Partial<SoketiConfig>
}

export function SoketiConfigForm({ onConfigSave, initialConfig }: SoketiConfigFormProps) {
  const [config, setConfig] = useState<SoketiConfig>({
    host: initialConfig?.host || "localhost",
    port: initialConfig?.port || "6001",
    appId: initialConfig?.appId || "app-id",
    key: initialConfig?.key || "app-key",
    secret: initialConfig?.secret || "app-secret",
    cluster: initialConfig?.cluster || "mt1",
    forceTLS: initialConfig?.forceTLS || false,
  })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!config.host || !config.port || !config.appId || !config.key) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    onConfigSave(config)
    toast({
      title: "Configuration Saved",
      description: "Soketi configuration has been saved successfully",
    })
  }

  const handleInputChange = (field: keyof SoketiConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Soketi Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your Soketi server connection settings before using the dashboard
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="host">Host *</Label>
              <Input
                id="host"
                type="text"
                placeholder="localhost"
                value={config.host}
                onChange={(e) => handleInputChange("host", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Port *</Label>
              <Input
                id="port"
                type="text"
                placeholder="6001"
                value={config.port}
                onChange={(e) => handleInputChange("port", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appId">App ID *</Label>
              <Input
                id="appId"
                type="text"
                placeholder="app-id"
                value={config.appId}
                onChange={(e) => handleInputChange("appId", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                type="text"
                placeholder="app-key"
                value={config.key}
                onChange={(e) => handleInputChange("key", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret">Secret</Label>
              <Input
                id="secret"
                type="text"
                placeholder="app-secret"
                value={config.secret}
                onChange={(e) => handleInputChange("secret", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cluster">Cluster</Label>
              <Input
                id="cluster"
                type="text"
                placeholder="mt1"
                value={config.cluster}
                onChange={(e) => handleInputChange("cluster", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="forceTLS"
              type="checkbox"
              checked={config.forceTLS}
              onChange={(e) => handleInputChange("forceTLS", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="forceTLS">Force TLS</Label>
          </div>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration & Connect
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
