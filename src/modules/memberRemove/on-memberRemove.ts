import { GuildMember } from 'discord.js';

import { getOptions } from '../fileManager/file-manager';
import { error } from '../logger/logger';

import { sendToChannel } from '../tools';

export const onMemberRemove = async (member: GuildMember) => {
  try {
    const { reportsChannel } = await getOptions()

    const text = `Пользователь <@${member.id}> покинул сервер.`

    sendToChannel(member, reportsChannel, text)
  } catch (e) {
    error('on member remove error', e.message)
  }
}
