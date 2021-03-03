import { GuildMember } from 'discord.js'

import { readFile, writeFile } from 'fs/promises'

const isValidNameRegexp = /\([А-Яа-яA-Za-z\sё^_.,`]{2,}\)$/

const getList = async (color: string): Promise<string[]> => {
  const listJSON = await readFile(`./storages/${color}list.json`, 'utf8')
  const list: string[] = JSON.parse(listJSON)

  return list
}

const setList = async (color: string, list: string[]): Promise<void> => {
  await writeFile(`./storages/${color}list.json`, JSON.stringify(list))
}

export const toBlacklist = async (member: GuildMember): Promise<void> => {
  const blackList = await getList('black')
  const id = member.user.id

  if (blackList.includes(id)) return

  blackList.push(id)

  setList('black', blackList)
}

export const fromBlacklist = async (member: GuildMember): Promise<void> => {
  const blacklist = await getList('black')
  const id = member.user.id

  if (! blacklist.includes(id)) return

  blacklist.splice(blacklist.indexOf(id), 1)

  await setList('black', blacklist)
}

export const checkBlock = async (member: GuildMember): Promise<boolean> => {
  const blacklist = await getList('black')

  return blacklist.includes(member.user.id)
}

export const toWhitelist = async (member: GuildMember): Promise<void> => {
  const whitelist = await getList('white')
  const id = member.user.id

  if (whitelist.includes(id)) return

  whitelist.push(id)

  await setList('white', whitelist)
}

export const fromWhitelist = async (member: GuildMember): Promise<void> => {
  const whitelist = await getList('white')
  const id = member.user.id

  if (! whitelist.includes(id)) return

  whitelist.splice(whitelist.indexOf(id), 1)

  await setList('white', whitelist)
}

export const checkTrust = async (member: GuildMember): Promise<boolean> => {
  const whitelist = await getList('white')

  return whitelist.includes(member.user.id)
}


export const checkName = async (member: GuildMember): Promise<boolean> => {
  const { guild } = member
  const nick = member.displayName

  if (guild.owner.id == member.user.id) return
  if (member.user.bot) return
  if (nick.includes('(имя?)')) return

  const isValid = isValidNameRegexp.test(nick)

  return isValid
}

export const haveRole = async (
  member: GuildMember,
  roleId: string
): Promise<boolean> => {
  try {
    return member.roles.cache.has(roleId)
  } catch (e) {
    console.log('Failed to check role existing', roleId, e.message)
  }
}

export const addRole = async (
  member: GuildMember,
  roleId: string
): Promise<void> => {
  try {
    await member.roles.add(roleId)
  } catch (e) {
    console.log('Failed to add role', roleId, e.message)
  }
}

export const removeRole = async (
  member: GuildMember,
  roleId: string
): Promise<void> => {
  try {
    await member.roles.remove(roleId)
  } catch (e) {
    console.log('Failed to remove role', roleId, e.message)
  }
}
