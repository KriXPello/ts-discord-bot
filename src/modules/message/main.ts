import { Message } from 'discord.js'

import { getHandler } from './commands-router'
import { getOptions } from '@options'

import { ExtendedMessage } from './types'

// Activating modules
import './commands/options'
import './commands/set'
import './commands/stat'

export const onMessage = async (message: Message): Promise<void> => {
  if (! message.content.startsWith('!')) return
  if (message.author.bot) return

  const parts = message.content
    .slice(1)
    .split(' ')
    .filter(Boolean) // Удаляет пустые строки, возникающие из-за двойных+ пробелов
  const [command, param, ...value] = parts

  if (! command) return

  const handler = getHandler(command)

  if (! handler) return

  const extended: ExtendedMessage = Object.assign({
    async answer(str: string): Promise<Message> {
      return message.channel.send(str)
    },
    param,
    value: value.join(' '),
  }, message)

  const { ownerRole } = getOptions()
  const messageAuthor = await message.guild.members.fetch(message.author.id)

  const isOwner = messageAuthor.roles.cache.has(ownerRole)

  if (! isOwner) {
    extended.answer('У вас нет прав для использования бота')

    return
  }

  try {
    await handler(extended)
  } catch (e) {
    extended.answer('Произошла ошибка')
  }
}
