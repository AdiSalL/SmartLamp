import Pusher from 'pusher-js'
import PusherSer from 'pusher'

export function createPusherClient(config) {
  return new Pusher(config.key, {
    wsHost: config.host,
    wsPort: Number.parseInt(config.port),
    wssPort: Number.parseInt(config.port),
    forceTLS: config.forceTLS,
    enabledTransports: ['ws', 'wss'],
    cluster: config.cluster,
    disableStats: true,
  })
}

export const CHANNELS = {
  MESSAGES: 'esp32-smartlamp',
}

export const EVENTS = {
  NEW_MESSAGE: 'new-message',
}
