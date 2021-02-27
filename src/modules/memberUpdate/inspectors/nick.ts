import { GuildMember } from 'discord.js';

import { getOptions } from '../../fileManager/file-manager';
import { error } from '../../logger/logger';

import { createRoleManagers, getRole, sendToChannel } from '../../tools';

// Проверяет, есть ли у пользователя роль которая по списку выше указанной
const haveHigherRole = async (
  member: GuildMember,
  roleId: string
): Promise<boolean> => {
  const role = await getRole(member.guild, roleId)

  if (! role) return false

  return member.roles.highest.rawPosition > role.rawPosition
}

//const isValidRegexp = /\([A-zА-я\s]{2,}\)$/
const isValidRegexp = /\([А-Яа-яA-Za-z\sё^_.,`]{2,}\)$/

export const checkName = async (
  member: GuildMember,
  name: string
): Promise<void> => {
  try {
    const { guild } = member
    const guildOwner = guild.owner

    if (guildOwner.id == member.user.id) return

    const { defaultRole, nickRole, reportsChannel } = await getOptions()

    const [haveRole, addRole, removeRole] = createRoleManagers(member)

    const haveDefaultRole = await haveRole(defaultRole)
    const haveNickRole = await haveRole(nickRole)
    const hRHTNR = await haveHigherRole(member, nickRole) // have Role Higher Than Nick Role
    const isValid = isValidRegexp.test(name)

    // Здесь нет await потому что ждать результата нет смысла
    if (isValid) {
      if (! nickRole) return

      if (! hRHTNR)
        addRole(nickRole)

      if (haveDefaultRole && defaultRole)
        removeRole(defaultRole)
    } else {
      if (hRHTNR) {
        const text = [
          `Доверенный пользователь <@${member.id}>`,
          'имеет некорректный ник:',
          `\`${member.displayName}\``
        ].join(' ')

        sendToChannel(member, reportsChannel, text)

        return
      }

      if (! haveDefaultRole && defaultRole)
        addRole(defaultRole)

      if (haveNickRole)
        removeRole(nickRole)

      if (! name.includes('(имя?)'))
        member.setNickname(name.slice(0, 25) + ' (имя?)')
    }
  } catch (e) {
    error('check nick error:', e.message)
  }
}
