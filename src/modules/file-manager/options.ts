import { watchFile } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { Options } from './types'

let options: Options

const PATH = './storages/options.json'

const updateOptions = async (): Promise<void> => {
  const newOptionsJSON = await readFile(PATH, 'utf8')
  const newOptions = JSON.parse(newOptionsJSON)

  options = newOptions
}

export const initOptionsWatcher = async () => {
  watchFile(PATH, updateOptions)

  console.log('Options watcher initialized')

  await updateOptions()
}

export const getOptions = (): Options => options

export const setOptions = async (newOptions: Options): Promise<void> => {
  const optionsJSON = JSON.stringify(newOptions)

  await writeFile('./storages/options.json', optionsJSON)
}
