import { error } from '../logger/logger'

import { MessageHandler, ExtendedMessage } from './message-types'

const messageRouter: Map<string, MessageHandler> = new Map

export const regMessageHandler = (name: string, fn: MessageHandler): void => {
  messageRouter.set(name, fn)

  console.log(`Module '${name}' added to router`)
}

export const handleMessage = async (command: string, message: ExtendedMessage): Promise<void> => {
  const handler = messageRouter.get(command)

  if (! handler) return

  try {
    await handler(message)
  } catch (e) {
    const err: string = e.message

    error(err)

    await message.answer('Произошла ошибка')
  }
}
