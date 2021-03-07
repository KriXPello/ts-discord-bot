import { Client, MessageReaction, TextChannel, User } from 'discord.js'

import assert from 'assert'

import { getOptions } from '@options'
import { addRole, removeRole } from 'modules/member/manager'

import { ExtendedMessage } from 'modules/message/types'

const roles: Map<string, string> = new Map

roles.set('817502142784733215', '815285054388830249') // LoL
roles.set('817503882628300801', '817506712101191751') // DbD

export const reactionHandlerInit = async (
  client: Client,
  message?: ExtendedMessage
): Promise<void> => {
  const { reactionsMessageId, reactionsChannel } = getOptions()

  if (! (reactionsMessageId && reactionsChannel)) return

  try {
    const channel = await client.channels
      .fetch(reactionsChannel) as TextChannel

    const msg = await channel.messages.fetch(reactionsMessageId)

    roles.forEach(async (_, emojiId) => {
      try {
        await msg.react(emojiId)
      } catch (e) {}
    })

    if (message) {
      message.answer('Успешно').catch(e => e)
    } else {
      console.log('Reaction message fetched')
    }
  } catch (e) {
    console.log('Reaction Handler init error', e.message)

    if (message) {
      message.answer('Ошибка ' + e.message).catch(e => e)
    }
  }
}

export const onReactionAdd = async (
  reaction: MessageReaction,
  user: User
): Promise<void> => {
  if (user.bot) return

  const { reactionsMessageId: mesId, reactionsChannel: chId } = getOptions()

  if (! (mesId && chId)) return

  let msg = reaction.message

  if (msg.channel.id != chId || msg.id != mesId) return

  const toAddId = roles.get(reaction.emoji.id)

  if (! toAddId) return

  const member = await msg.guild.members.fetch(user.id)

  await addRole(member, toAddId)
}

export const onReactionRemove = async (
  reaction: MessageReaction,
  user: User
): Promise<void> => {
  if (user.bot) return

  const { reactionsMessageId: mesId, reactionsChannel: chId } = getOptions()

  if (! (mesId && chId)) return

  let msg = reaction.message

  if (msg.channel.id != chId || msg.id != mesId) return

  const toRemoveId = roles.get(reaction.emoji.id)

  if (! toRemoveId) return

  const member = await msg.guild.members.fetch(user.id)

  await removeRole(member, toRemoveId)
}
