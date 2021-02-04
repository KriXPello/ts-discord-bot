import { GuildMember } from 'discord.js';

import { getOptions } from '../fileManager/file-manager';
import { error } from '../logger/logger';

export const onMemberAdd = async (member: GuildMember): Promise<void> => {
  const nick = member.user.username.slice(0, 25) + ' (имя?)'

  await member.setNickname(nick)

  const { defaultRole } = await getOptions()

  if (defaultRole) {
    try {
      const role = await member.guild.roles.fetch(defaultRole)

      member.roles.add(role)
    } catch (e) {
      error('Failed to add defaultRole', defaultRole, e.message)
    }
  }
}
