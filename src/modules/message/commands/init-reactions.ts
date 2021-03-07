import { regMessageHandler } from '../commands-router'

import { reactionHandlerInit } from 'modules/reaction/main'

import { ExtendedMessage } from '../types'

const handlerReactions = async (message: ExtendedMessage): Promise<void> => {
  await reactionHandlerInit(message.client, message)
}

regMessageHandler('initReactions', handlerReactions)
