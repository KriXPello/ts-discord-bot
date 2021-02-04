import { appendFile, mkdir, readFile, stat, writeFile } from 'fs/promises'

import { optionsD, tokenD } from './default-files'
import { error, log } from '../logger/logger'

import { Options } from './file-manager-types'

const requiredFiles = {
  'options.json': optionsD,
  'token.txt': tokenD,
}

const checkDir = async (): Promise<void> => {
  try {
    await stat('./storages')
  } catch (e) {
    if (e.code == 'ENOENT') {
      error('storages/ does not exists')

      await mkdir('./storages')

      log('storages/ created')
    }
  }
}

const checkFile = async (filename: string): Promise<void> => {
  const file = './storages/' + filename

  try {
    await stat(file)
  } catch (e) {
    if (e.code == 'ENOENT') {
      error(filename, 'does not exists')

      await appendFile(file, requiredFiles[filename])

      log(filename, 'created')
    }
  }
}

const checkAll = async (): Promise<void[]> => {
  await checkDir()

  const result = Object.keys(requiredFiles).map(checkFile)

  return Promise.all(result)
}

export const initFileManager = async (): Promise<void> => {
  await checkAll()

  console.log('File Manager initialized')
}

export const getOptions = async (): Promise<Options> => {
  const optionsJson = await readFile('./storages/options.json', 'utf8')
  const options = JSON.parse(optionsJson)

  return options
}

export const setOptions = async (options: Options): Promise<void> => {
  const optionsJson = JSON.stringify(options)

  await writeFile('./storages/options.json', optionsJson)
}

export const getToken = async (): Promise<string> => {
  return readFile('./storages/token.txt', 'utf8')
}
