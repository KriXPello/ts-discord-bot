import { mkdir, stat } from 'fs/promises'
import { createWriteStream, WriteStream } from 'fs'

const getTime = (): string => {
  const date = new Date()
  const dmy = date.toLocaleDateString()
  const hms = date.toLocaleTimeString()

  return dmy + ' ' + hms
}

let stream: null | WriteStream = null

export const startLogging = async (): Promise<void> => {
  const validTime = getTime()
    .replaceAll('.', '-')
    .replaceAll(':', '-')
    .replace(' ', '_')

  const logName = `./logs/${validTime} log.txt`

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
    stream.write(`LOG  ${getTime()}  ${info.join(' ')}\n`)
}

export const error = (...info: string[]): void => {
  if (stream)
    stream.write(`ERROR  ${getTime()}  ${info.join(' ')}\n`)
}
