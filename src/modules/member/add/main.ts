import { GuildMember } from 'discord.js'

import { getOptions } from '@options'

import { addRole, checkBlock, checkName, toWhitelist } from '../manager'
import { mentionMember, sendToChannel } from 'modules/tools'

export const onMemberAdd = async (member: GuildMember): Promise<void> => {
  const { defaultRole, welcomeChannel, welcomeMessage, punishRole, nickRole } = getOptions()

  const isBlocked = await checkBlock(member)

  if (isBlocked) {
    if (punishRole) addRole(member, punishRole)

    return
  }

  const isValidName = await checkName(member)

  if (isValidName) {
    if (nickRole) addRole(member, nickRole)

    await toWhitelist(member)
  } else {
    await member.setNickname(member.displayName.slice(0, 25) + ' (имя?)')

    await addRole(member, defaultRole)
  }

  if (! (welcomeChannel && welcomeMessage)) return

  const text = mentionMember(welcomeMessage, member)

  sendToChannel(member.guild, welcomeChannel, text)
}
