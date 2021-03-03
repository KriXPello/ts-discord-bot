import {
  Guild,
  GuildMember,
  Message,
  MessageEmbed,
  TextChannel
} from 'discord.js'

export const mentionMember = (text: string, member: GuildMember): string =>
  text.replace(/\$user/gi, `<@!${member.id}>`);

export const sendToChannel = async (
  guild: Guild,
  channelId: string,
  message: string | MessageEmbed
): Promise<Message> => {
  if (! (channelId && message)) return

  try {
    const channel = await guild.client.channels
      .fetch(channelId) as TextChannel

    return channel.send(message)
  } catch (e) {
    console.log('Failed to send message to', channelId, e.message)
  }
}
