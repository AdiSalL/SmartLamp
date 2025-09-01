'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPusherClient, CHANNELS, EVENTS } from '../lib/soketi'

export function useSoketi(config) {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [channel, setChannel] = useState(null)
  const [pusher, setPusher] = useState(null)

  useEffect(() => {
    if (!config) {
      console.log('[v0] No Soketi config provided, skipping initialization')
      return
    }

    const initializePusher = async () => {
      try {
        const pusherClient = createPusherClient(config)
        setPusher(pusherClient)

        const messageChannel = pusherClient.subscribe(CHANNELS.MESSAGES)
        setChannel(messageChannel)

        pusherClient.connection.bind('connected', () => {
          console.log('[v0] Connected to Soketi')
          setIsConnected(true)
        })

        pusherClient.connection.bind('disconnected', () => {
          console.log('[v0] Disconnected from Soketi')
          setIsConnected(false)
        })

        pusherClient.connection.bind('error', (error) => {
          console.error('[v0] Soketi connection error:', error)
          setIsConnected(false)
        })

        messageChannel.bind(EVENTS.NEW_MESSAGE, (data) => {
          console.log('[v0] New message received:', data)
          setMessages((prev) => [...prev, data])
        })
      } catch (error) {
        console.error('[v0] Failed to initialize Pusher:', error)
      }
    }

    initializePusher()

    return () => {
      if (channel) {
        channel.unbind_all()
      }
      if (pusher) {
        pusher.unsubscribe(CHANNELS.MESSAGES)
        pusher.connection.unbind_all()
      }
    }
  }, [config])

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return

      try {
        console.log(channel)
        channel.trigger(`client-${CHANNELS.MESSAGES}`, {
          message: text,
        })

        console.log('[v0] Message sent successfully')
      } catch (error) {
        console.error('[v0] Error sending message:', error)
        throw error
      }
    },
    [config]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isConnected,
    sendMessage,
    clearMessages,
  }
}
