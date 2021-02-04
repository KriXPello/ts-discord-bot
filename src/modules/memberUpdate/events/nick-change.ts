import { GuildMember } from 'discord.js';

import { getOptions } from '../../fileManager/file-manager';
import { error } from '../../logger/logger';

const isValidRegexp = /\([A-zА-я]{2,}\)$/

export const nickChanged = async (newMember: GuildMember): Promise<void> => {
  const { nickname } = newMember
  const { defaultRole, nickRole } = await getOptions()

  if (! (defaultRole && nickRole)) return

  const haveDefaultRole = newMember.roles.cache.has(defaultRole)
  const haveNickRole = newMember.roles.cache.has(nickRole)

  if (isValidRegexp.test(nickname)) {
    try {
      if (! haveNickRole)
        newMember.roles.add(nickRole)

      if (haveDefaultRole)
        newMember.roles.remove(defaultRole)
    } catch (e) {
      error('Failed to add defaultRole', defaultRole, e.message)
    }
  } else {
    try {
      if (! haveDefaultRole)
        newMember.roles.add(defaultRole)

      if (haveNickRole)
        newMember.roles.remove(nickRole)
    } catch (e) {
      error('Failed to remove nickRole', nickRole, e.message)
    }
  }
}
