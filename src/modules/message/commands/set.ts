import { getOptions, setOptions } from '../../fileManager/file-manager';
import { log } from '../../logger/logger';

import { regMessageHandler } from '../message-router';

import { ExtendedMessage, MessageHandler } from '../message-types';

const isMentionRegexp = /<[\@\!\#\&\:\a]*?[A-zА-я0-9\s]*>/
// Для удаления символов по типу @!#&:a<>  и получения чистого id
const clearMentionRegexp = /[^0-9]/g

const handlerSet: MessageHandler = async (message: ExtendedMessage): Promise<void> => {
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

  const options = await getOptions()
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

  log(param, `from: '${option}' changed to: '${options[param]}'`)

  message.answer(`Значение ${param} изменено`)
}

regMessageHandler('set', handlerSet)
