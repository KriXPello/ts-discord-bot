import { Guild, GuildMember, MessageEmbed, Role, TextChannel } from 'discord.js'

import { error } from './logger/logger'

export const mentionMember = (text: string, member: GuildMember): string =>
  text.replace(/\$user/gi, `<@!${member.id}>`);

export const sendToChannel = async (
  member: GuildMember,
  channelId: string,
  message: string | MessageEmbed
): Promise<void> => {
  if (! (channelId && message)) return

  try {
    const channel = await member.client.channels
      .fetch(channelId) as TextChannel

    channel.send(message)
  } catch (e) {
    error('Failed to send message to', channelId, e.message)
  }
}

export const getRole = async (
  guild: Guild,
  roleId: string = '1'
): Promise<Role | undefined> => {
  try {
    const role = await guild.roles.fetch(roleId)

    return role
  } catch (e) {
    error('Failed to get role', roleId, e.message)
  }
}

export const createHaveRole = (member: GuildMember) => {
  return async (roleId: string = '1'): Promise<boolean> => {
    try {
      return member.roles.cache.has(roleId)
    } catch (e) {
      error('failed to check existing of role', e.message)
    }
  }
}

export const createAddRole = (member: GuildMember) => {
  return async (roleId: string = '1'): Promise<void> => {
    try {
      const role = await member.guild.roles.fetch(roleId)

      await member.roles.add(role)
    } catch {
      error('failed to add role', roleId)
    }
  }
}

export const createRemoveRole = (member: GuildMember) => {
  return async (roleId: string = '1'): Promise<void> => {
    try {
      const role = await member.guild.roles.fetch(roleId)

      await member.roles.remove(role)
    } catch {
      error('failed to remove role', roleId)
    }
  }
}

/**
 * Возвращает массив функций:
 * [ haveRole, addRole, removeRole ]
 */
export const createRoleManagers = (member: GuildMember) => {
  return [
    createHaveRole(member),
    createAddRole(member),
    createRemoveRole(member)
  ]
}
