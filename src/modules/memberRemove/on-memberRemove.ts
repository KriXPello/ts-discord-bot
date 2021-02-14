import { GuildMember, MessageEmbed } from 'discord.js';

import { getOptions } from '../fileManager/file-manager';
import { error, log } from '../logger/logger';

import { sendToChannel } from '../tools';

export const onMemberRemove = async (member: GuildMember) => {
  try {
    const { reportsChannel } = await getOptions()

    // const text = `Пользователь <@${member.id}> покинул сервер.`

    const msg = new MessageEmbed()

    msg.setTitle('Пользователь покинул сервер')
    msg.setColor('ff0000')
    msg.addFields([
      { name: 'Имя на сервере', value: member.displayName },
      { name: 'Имя#тег', value: member.user.tag },
      { name: 'Высшая роль', value: member.roles.highest }
    ])

    log(`'${member.user.tag}' покинул сервер '${member.guild.name}'`)

    sendToChannel(member, reportsChannel, msg)
  } catch (e) {
    error('on member remove error', e.message)
  }
}
