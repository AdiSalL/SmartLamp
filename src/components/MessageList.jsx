"use client"

import { useEffect, useRef } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

export function MessageList({ messages, onClear }) {
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Messages</h3>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Send your first message!</p>
          </div>
        ) : (
          <div className="space-y-3 pr-4">
            {messages.map((message) => (
              <div key={message.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{message.user}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-sm text-foreground break-words">{message.text}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
