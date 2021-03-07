import { MessageEmbed } from 'discord.js'

import { getOptions } from '@options'

import { regMessageHandler } from '../commands-router'

import { ExtendedMessage } from '../types'

const handlerOptions = async (message: ExtendedMessage): Promise<void> => {
  const optionsMessage = new MessageEmbed()
    .setTitle('Настройки')

  const options = await getOptions()

  for (let optionName in options) {
    optionsMessage.addField(optionName, options[optionName] || '-')
  }

  message.answer(optionsMessage)
}

regMessageHandler('options', handlerOptions)
