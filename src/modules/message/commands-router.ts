import { MessageHandler, MessageRouter } from './types'

const messageRouter: MessageRouter = new Map

export const regMessageHandler = (name: string, fn: MessageHandler): void => {
  messageRouter.set(name, fn)

  console.log(`Module '${name}' added to router`)
}

export const getHandler = (command: string): MessageHandler => {
  const handler = messageRouter.get(command)

  return handler
}
