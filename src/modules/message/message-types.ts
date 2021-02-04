import { GuildChannel, Message, MessageEmbed, NewsChannel, TextChannel } from 'discord.js'

export interface ExtendedMessage extends Message {
  answer(str: string | MessageEmbed): Promise<Message>

  param: string
  value: string
}

export type MessageHandler = (message: ExtendedMessage) => Promise<void>
