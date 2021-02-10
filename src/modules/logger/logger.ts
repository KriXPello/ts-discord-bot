import { mkdir, stat } from 'fs/promises'
import { createWriteStream, WriteStream } from 'fs'

const getLogTime = (): string => {
  const date = new Date()
  const dmy = date.toLocaleDateString()
  const hms = date.toLocaleTimeString()

  return dmy + ' ' + hms
}

let stream: null | WriteStream = null

export const startLogging = async (): Promise<void> => {
  const now = new Date()

  const fileName = [
    now.getDate(),
    now.getMonth() + 1,
    now.getFullYear(),
    '--',
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ].map(el => String(el).padStart(2, '0')).join('-')

  const logName = `./logs/${fileName}_log.txt`

  try {
    await stat('./logs/')
  } catch (e) {
    await mkdir('./logs')
  }

  stream = createWriteStream(logName)

  stream.on('open', () => console.log('Logging started'))
  stream.on('error', (e) => console.log('Logging error:', e.message))
}

export const log = (...info: string[]): void => {
  if (stream)
    stream.write(`LOG  ${getLogTime()}  ${info.join(' ')}\n`)
}

export const error = (...info: string[]): void => {
  if (stream)
    stream.write(`ERROR  ${getLogTime()}  ${info.join(' ')}\n`)
}
