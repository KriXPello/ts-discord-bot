import { Client } from 'discord.js'

import { initFileManager, getToken } from './file-manager/main'
import { reactionHandlerInit } from './reaction/main'

import { onMessage } from './message/main'
import { onMemberAdd } from './member/add/main'
import { onMemberRemove } from './member/remove/main'
import { onMemberUpdate } from './member/update/main'
import { onReactionAdd, onReactionRemove } from './reaction/main'

export const start = async (): Promise<void> => {
  await initFileManager()

  const client = new Client()
  const token = await getToken()

  client.on('message', onMessage)
  client.on('guildMemberAdd', onMemberAdd)
  client.on('guildMemberRemove', onMemberRemove)
  client.on('guildMemberUpdate', onMemberUpdate)
  client.on('messageReactionAdd', onReactionAdd)
  client.on('messageReactionRemove', onReactionRemove)
  client.on('ready', async () => {
    await reactionHandlerInit(client)
  })

  client.login(token)

  console.log('Started')
}
