import { Message } from 'discord.js'

import { getOptions } from '../fileManager/file-manager'
import { error } from '../logger/logger'

import { getHandler } from './message-router'

import { ExtendedMessage } from './message-types'

// Инициализация модулей команд
import './commands/commands-aggregator'

export const onMessage = async (message: Message): Promise<void> => {
  if (! message.content.startsWith('!')) return
  if (message.client.user.id == message.author.id) return

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

  const { ownerRole } = await getOptions()
  const messageAuthor = await message.guild.members.fetch(message.author.id)

  const isOwner = messageAuthor.roles.cache.has(ownerRole)

  if (! isOwner) {
    extended.answer('У вас нет прав для использования бота')

    return
  }

  try {
    await handler(extended)
  } catch (e) {
    error(e.message)

    await extended.answer('Произошла ошибка')
  }
}
