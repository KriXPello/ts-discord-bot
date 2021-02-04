import { MessageEmbed } from 'discord.js';

import { getOptions } from '../../fileManager/file-manager';
import { regMessageHandler } from '../message-router';

import { ExtendedMessage, MessageHandler } from '../message-types';

const handlerOptions: MessageHandler = async (message: ExtendedMessage): Promise<void> => {
  const optionsMessage = new MessageEmbed()
    .setTitle('Настройки')

  const options = await getOptions()

  for (let optionName in options) {
    optionsMessage.addField(optionName, options[optionName] || '-')
  }

  message.answer(optionsMessage)
}

regMessageHandler('options', handlerOptions)
