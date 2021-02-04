import { GuildMember, Role, TextChannel } from 'discord.js';

import { getOptions } from '../../fileManager/file-manager';
import { error } from '../../logger/logger';

const mentionMember = (text: string, member: GuildMember): string =>
  text.replaceAll(/\$user/gi, `<@!${member.id}>`);

const sendToChannel = async (
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

export const rolesChanged = async (
  newMember: GuildMember,
  oldMember: GuildMember,
  updatedRole: Role
): Promise<void> => {
  const {
    defaultRole,
    welcomeChannel,
    welcomeMessage,
    punishRole,
    punishChannel,
    punishMessage
  } = await getOptions()

  if (updatedRole.id == defaultRole) {
    if (! (welcomeChannel && welcomeMessage)) return

    let text = mentionMember(welcomeMessage, newMember)

    sendToChannel(newMember, welcomeChannel, text)

    return
  }

  if (updatedRole.id == punishRole) {
    if (! (punishChannel && punishMessage)) return

    let text = mentionMember(punishMessage, newMember)

    sendToChannel(newMember, punishChannel, text)

    return
  }
}
