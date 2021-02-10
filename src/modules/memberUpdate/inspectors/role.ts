import { GuildMember, Role } from 'discord.js';

import { getOptions } from '../../fileManager/file-manager';

import { mentionMember, sendToChannel } from '../../tools';

export const checkRoles = async (
  member: GuildMember,
  updatedRole: Role
): Promise<void> => {
  const {
    punishRole,
    punishChannel,
    punishMessage
  } = await getOptions()

  if (updatedRole.id == punishRole) {
    if (! (punishChannel && punishMessage)) return

    let text = mentionMember(punishMessage, member)

    sendToChannel(member, punishChannel, text)

    return
  }
}
