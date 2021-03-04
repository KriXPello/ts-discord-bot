import { TextChannel } from 'discord.js'

import { regMessageHandler } from '../commands-router'
import { checkName } from 'modules/member/manager'

import { ExtendedMessage } from '../types'

const getValidIds = async (message: ExtendedMessage): Promise<void> => {
  const members = (message.channel as TextChannel).guild.members
  const validIds: string[] = []

  members.cache.forEach(async (member) => {
    const isValid = await checkName(member)

    if (isValid) {
      validIds.push(member.id)
    }
  })

  Promise.all(validIds).then(() => console.log(JSON.stringify(validIds)))
}

regMessageHandler('gvalids', getValidIds)
