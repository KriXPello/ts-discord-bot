import { GuildMember } from 'discord.js';

import { nickChanged } from './events/nick-change';
import { rolesChanged } from './events/roles-change';

export const onMemberUpdate = async (
  oldMember: GuildMember,
  newMember: GuildMember
): Promise<void> => {
  const newRoles = newMember.roles.cache.array()
  const oldRoles = oldMember.roles.cache.array()
  const newNick = newMember.nickname || newMember.user.username
  const oldNick = oldMember.nickname || newMember.user.username

  const [updatedRole] = newRoles.filter(a => oldRoles.indexOf(a) == -1)

  if (newNick != oldNick) {
    nickChanged(newMember)

    return
  }

  if (updatedRole) {
    rolesChanged(newMember, oldMember, updatedRole)

    return
  }
}
