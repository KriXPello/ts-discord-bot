import { appendFile, mkdir, readFile, stat } from 'fs/promises'

import { blacklistD, optionsD, tokenD, whitelistD } from './defaults'

import { initOptionsWatcher } from './options'

const touchDir = async (dirpath: string): Promise<void> => {
  try {
    await stat(dirpath)
  } catch (e) {
    if (e.code == 'ENOENT') {
      await mkdir(dirpath)
    }
  }
}

const touchFile = async (
  filepath: string,
  initData?: string
): Promise<void> => {
  try {
    await stat(filepath)
  } catch (e) {
    if (e.code == 'ENOENT') {
      await appendFile(filepath, initData)
    }
  }
}

export const initFileManager = async (): Promise<void> => {
  await touchDir('./storages/')
  await touchFile('./storages/options.json', optionsD)
  await touchFile('./storages/token.txt', tokenD)
  await touchFile('./storages/blacklist.json', blacklistD)
  await touchFile('./storages/whitelist.json', whitelistD)

  console.log('Files checked')

  await initOptionsWatcher()
}

export const getToken = async (): Promise<string> => {
  return readFile('./storages/token.txt', 'utf8')
}
