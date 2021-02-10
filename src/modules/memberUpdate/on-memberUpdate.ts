import { GuildMember } from 'discord.js';

import { checkName } from './inspectors/nick';
import { checkRoles } from './inspectors/role';

export const onMemberUpdate = async (
  oldMember: GuildMember,
  newMember: GuildMember
): Promise<void> => {
  const newRoles = newMember.roles.cache.array()
  const oldRoles = oldMember.roles.cache.array()
  const newNick = newMember.nickname || newMember.user.username

  const [updatedRole] = newRoles.filter(a => oldRoles.indexOf(a) == -1)

  checkName(newMember, newNick)

  if (updatedRole) {
    checkRoles(newMember, updatedRole)

    return
  }
}
