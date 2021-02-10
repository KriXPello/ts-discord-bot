import { GuildMember, TextChannel } from 'discord.js'

import { error } from './logger/logger'

export const mentionMember = (text: string, member: GuildMember): string =>
  text.replace(/\$user/gi, `<@!${member.id}>`);

export const sendToChannel = async (
  member: GuildMember,
  channelId: string,
  text: string
): Promise<void> => {
  try {
    const channel = await member.client.channels
      .fetch(channelId) as TextChannel

    channel.send(text)
  } catch (e) {
    error('Failed to send message to', channelId, e.message)
  }
}
