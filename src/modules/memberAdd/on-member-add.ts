import { GuildMember } from 'discord.js';

import { getOptions } from '../fileManager/file-manager';

import { checkName } from '../memberUpdate/inspectors/nick';
import { mentionMember, sendToChannel } from '../tools';

export const onMemberAdd = async (member: GuildMember): Promise<void> => {
  const name = member.user.username
  const { welcomeChannel, welcomeMessage } = await getOptions()

  await checkName(member, name)

  if (! (welcomeChannel && welcomeMessage)) return

  let text = mentionMember(welcomeMessage, member)

  await sendToChannel(member, welcomeChannel, text)
}
