import { GuildMember } from 'discord.js';

import { getOptions } from '../../fileManager/file-manager';
import { error } from '../../logger/logger';

/**
 * Возвращает массив функций...
 * [0] - addRole
 * [1] - removeRole
 */
const createRoleChangers = (member: GuildMember) => {
  return [
    async (roleId: string): Promise<void> => {
      try {
        const role = await member.guild.roles.fetch(roleId)

        await member.roles.add(role)
      } catch {
        error('nick inspector: failed to add role', roleId)
      }
    },
    async (roleId: string): Promise<void> => {
      try {
        const role = await member.guild.roles.fetch(roleId)

        await member.roles.remove(role)
      } catch {
        error('nick inspector: failed to remove role', roleId)
      }
    }
  ]
}

const isValidRegexp = /\([A-zА-я\s]{2,}\)$/

export const checkName = async (
  member: GuildMember,
  name: string
): Promise<void> => {
  const { defaultRole, nickRole } = await getOptions()
  const isValid = isValidRegexp.test(name)

  const haveDefaultRole = member.roles.cache.has(defaultRole)
  const haveNickRole = member.roles.cache.has(nickRole)

  const [addRole, removeRole] = createRoleChangers(member)

  if (isValid) {
    if (! nickRole) return

    if (! haveNickRole)
      addRole(nickRole)

    if (defaultRole && haveDefaultRole)
      removeRole(defaultRole)
  } else {
    if (! defaultRole) return

    if (! haveDefaultRole)
      addRole(defaultRole)

    if (nickRole && haveNickRole)
      removeRole(nickRole)

    if (name.includes('(имя?)')) return

    await member.setNickname(name.slice(0, 25) + ' (имя?)')
  }
}
