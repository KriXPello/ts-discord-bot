import { Client } from 'discord.js'

import { initFileManager, getToken } from './fileManager/file-manager'
import { error, startLogging } from './logger/logger'

import { onMemberAdd } from './memberAdd/on-member-add'
import { onMemberRemove } from './memberRemove/on-memberRemove'
import { onMemberUpdate } from './memberUpdate/on-memberUpdate'
import { onMessage } from './message/on-message'

export const start = async (): Promise<void> => {
  await startLogging()
  await initFileManager()

  process.on('uncaughtException', er => error(er.stack))

  const client = new Client()
  const token = await getToken()

  client.on('guildMemberAdd', onMemberAdd)
  client.on('guildMemberRemove', onMemberRemove)
  client.on('guildMemberUpdate', onMemberUpdate)
  client.on('message', onMessage)

  client.login(token)
}
