"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MessageFormProps {
  onSendMessage: (text: string, user?: string) => Promise<void>
  isConnected: boolean
}

export function MessageForm({ onSendMessage, isConnected }: MessageFormProps) {
  const [message, setMessage] = useState("")
  const [username, setUsername] = useState("Anonymous")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      })
      return
    }

    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Not connected to Soketi server",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await onSendMessage(message, username || "Anonymous")
      setMessage("")
      toast({
        title: "Success",
        description: "Message sent successfully",
      })
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e as any)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">Press Ctrl+Enter to send quickly</p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isConnected || !message.trim()}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </>
        )}
      </Button>

      {!isConnected && (
        <p className="text-sm text-destructive text-center">Waiting for connection to Soketi server...</p>
      )}
    </form>
  )
}
