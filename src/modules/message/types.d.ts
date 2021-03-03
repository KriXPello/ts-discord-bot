import { Message, MessageEmbed } from 'discord.js';

export interface ExtendedMessage extends Message {
  answer(data: string | MessageEmbed): Promise<Message>

  param: string,
  value: string
}

export type MessageHandler = (message: ExtendedMessage) => Promise<void>

export type MessageRouter = Map<string, MessageHandler>
