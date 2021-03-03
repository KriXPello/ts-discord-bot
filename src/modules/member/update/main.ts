import { GuildMember } from 'discord.js'

import { getOptions } from '@options'

import {
  addRole,
  checkName,
  checkTrust,
  fromBlacklist,
  fromWhitelist,
  haveRole,
  toBlacklist,
  toWhitelist
} from '../manager'
import { mentionMember, sendToChannel } from 'modules/tools'

export const onMemberUpdate = async (
  oldMember: GuildMember,
  newMember: GuildMember
): Promise<void> => {
  const {
    nickRole,
    punishRole,
    punishMessage,
    punishChannel,
    reportsChannel
  } = getOptions()

  const oldName = oldMember.displayName
  const newName = newMember.displayName
  const oldRoles = oldMember.roles.cache.array()
  const newRoles = newMember.roles.cache.array()

  console.log('Member updating')

  // *Обработчик изменения ника
  if (oldName != newName) {
    if (await haveRole(newMember, punishRole)) return

    const isOldNameValid = await checkName(oldMember)
    const isNewNameValid = await checkName(newMember)
    const isMemberTrusted = await checkTrust(newMember)

    console.log('Триггер смены ника', isOldNameValid, isNewNameValid, isMemberTrusted)

    // Ник корректный -> некорректный И пользователь доверенный
    // Уведомить о том, что доверенный пользователь сменил корректный ник на некорректный
    if (isMemberTrusted && isOldNameValid && ! isNewNameValid) {
      const text = [
        `Доверенный пользователь <@${newMember.id}>`,
        'сменил ник на некорректный:',
        `\`${newName}\``
      ].join(' ')

      sendToChannel(newMember.guild, reportsChannel, text)

      return
    }

    // Ник некорректный -> некорректный И пользователь доверенный
    // Уведомить о том, что доверенный пользователь оставил свой ник всё так же некорректным
    if (isMemberTrusted && ! isOldNameValid && ! isNewNameValid) {
      const text = [
        `Доверенный пользователь <@${newMember.id}>`,
        'изменил ник, но он всё ещё некорректен.',
        `\nБыло: \`${oldName}\``,
        `\nСтало: \`${newName}\``
      ].join(' ')

      sendToChannel(newMember.guild, reportsChannel, text)

      return
    }

    // Ник некорректный -> корректный И пользователь недоверенный
    // Сделать доверенным и по возможности выдать роль
    if (! isMemberTrusted && ! isOldNameValid && isNewNameValid) {
      await toWhitelist(newMember)

      if (nickRole)
        await addRole(newMember, nickRole)

      return
    }
  }

  // *Обработчик изменения ролей
  if (oldRoles.length != newRoles.length) {
    const [ addedRole ] = newRoles.filter(r => ! oldRoles.find(f => f.id == r.id))
    const [ removedRole ] = oldRoles.filter(r => ! newRoles.find(f => f.id == r.id))

    console.log('Триггер смены роли', addedRole, removedRole)

    // Добавилась роль и эта роль является punishRole
    // Удалить пользователя из списка доверенных и добавить в список недоверенных и отправить сообщение (если есть)
    if (addedRole && addedRole.id == punishRole) {
      await fromWhitelist(newMember)
      await toBlacklist(newMember)

      if (! (punishMessage && punishChannel)) return

      const text = mentionMember(punishMessage, newMember)

      sendToChannel(newMember.guild, punishChannel, text)

      return
    }

    // Удалилась роль и эта роль является punishRole
    // Удалить пользователя из списка недоверенных, проверить ник и в случае успеха добавить в список доверенных
    if (removedRole && removedRole.id == punishRole) {
      await fromBlacklist(newMember)

      if (await checkName(newMember))
        await toWhitelist(newMember)
    }
  }
}
