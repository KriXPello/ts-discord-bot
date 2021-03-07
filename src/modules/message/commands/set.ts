import { getOptions, setOptions } from '@options'
import { reactionHandlerInit } from 'modules/reaction/main'

import { regMessageHandler } from '../commands-router'

import { ExtendedMessage } from '../types'

const isMentionRegexp = /<[\@\!\#\&\:\a]*?[A-zА-я0-9\s]*>/
// Для удаления символов по типу @!#&:a<>  и получения чистого id
const clearMentionRegexp = /[^0-9]/g

const handlerSet = async (message: ExtendedMessage) => {
  let { param, value } = message

  if (! param) {
    message.answer(
      'Вы не указали *настройку*, которую нужно изменить\n' +
      '```!set <настройка> <значение>```'
    )

    return
  }

  if (! value) {
    message.answer(
      'Вы не указали *значение*\n' +
      '```!set <настройка> <значение>```'
    )

    return
  }

  const options = getOptions()
  const option = options[param]

  if (option === undefined) {
    message.answer(
      `В настройках нет параметра ${param}\n` +
      '```!options``` чтобы просмотреть все параметры'
    )

    return
  }

  // Чтобы не установить текст или mention в качестве id канала или роли
  if (param.includes('Channel') || param.includes('Role')) {
    value = value.split(' ').shift()

    if (isMentionRegexp.test(value))
      value = value.replace(clearMentionRegexp, '')
  }

  options[param] = value

  await setOptions(options)

  if (param == 'reactionsMessageId') {
    await reactionHandlerInit(message.client, message)

    return
  }

  message.answer(`Значение ${param} изменено`)
}

regMessageHandler('set', handlerSet)
