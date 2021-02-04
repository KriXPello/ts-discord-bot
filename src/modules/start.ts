import { Client } from 'discord.js'

import { initFileManager, getToken } from './fileManager/file-manager'
import { error, startLogging } from './logger/logger'

import { onMessage } from './message/on-message'
import { onMemberUpdate } from './memberUpdate/on-memberUpdate'
import { onMemberAdd } from './memberAdd/on-member-add'

export const start = async (): Promise<void> => {
  await startLogging()
  await initFileManager()

  process.on('uncaughtException', er => error(er.name, ':', er.message))

  const client = new Client()
  const token = await getToken()

  client.on('message', onMessage)
  client.on('guildMemberUpdate', onMemberUpdate)
  client.on('guildMemberAdd', onMemberAdd)

  client.login(token)
}
