import { GuildMember, MessageEmbed } from 'discord.js';

import { getOptions } from '@options';

import { sendToChannel } from 'modules/tools';
import { fromWhitelist, toBlacklist } from '../manager';

export const onMemberRemove = async (member: GuildMember) => {
  const { reportsChannel } = getOptions()

  const msg = new MessageEmbed()

  msg.setTitle('Пользователь покинул сервер')
  msg.setColor('ff0000')
  msg.addFields([
    { name: 'Имя на сервере', value: member.displayName },
    { name: 'Имя#тег', value: member.user.tag },
    { name: 'Высшая роль', value: member.roles.highest }
  ])

  sendToChannel(member.guild, reportsChannel, msg)

  fromWhitelist(member)
  toBlacklist(member)
}
