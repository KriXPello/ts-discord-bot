import { Message, MessageEmbed } from 'discord.js'

export interface ExtendedMessage extends Message {
  answer(str: string | MessageEmbed): Promise<Message>

  param: string
  value: string
}

export type MessageHandler = (message: ExtendedMessage) => Promise<void>

export type MessageRouter = Map<string, MessageHandler>

export type StatObj = {
  name: string,
  count: number
}

export type SortFunc = (obj: any) => Promise<StatObj[]>
