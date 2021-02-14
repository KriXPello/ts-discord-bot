import { GuildChannel } from 'discord.js';

import { error } from '../../logger/logger';

import { regMessageHandler } from '../message-router';

import { ExtendedMessage, SortFunc, StatObj } from '../message-types';

const objToArr = (obj: any): any[] => {
  const arr = []

  for (let key in obj) {
    arr.push(obj[key])
  }

  return arr
}

const byAlphabet = (a: StatObj, b: StatObj) =>
  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1

const byCount = (a: StatObj, b: StatObj) => a.count - b.count

const createSort = (stat: any): SortFunc => {
  const func: SortFunc = async (sorter): Promise<StatObj[]> =>
    objToArr(stat).sort(sorter)

  return func
}

export const handlerStat = async (message: ExtendedMessage) => {
  const { param } = message

  const channel = message.channel as GuildChannel

  const roles = channel.guild.roles.cache
  const members = channel.guild.members.cache

  const stat = Object.create(null)

  let peopleTotal = 0
  let botsTotal = 0

  roles.forEach(role => {
    if (role.name == '@everyone') return

    const roleObj = Object.create(null)

    roleObj.name = role.name
    roleObj.count = 0

    stat[role.id] = roleObj
  })

  members.forEach(member => {
    member.roles.cache.forEach(role => {
      if (role.name == '@everyone') return

      stat[role.id].count++
    })

    member.user.bot
      ? botsTotal++
      : peopleTotal++
  })

  const sort = createSort(stat)

  let arr: StatObj[] = null

  switch (param) {
    case 'a': { // По алфавиту
      arr = await sort(byAlphabet)
      break
    }
    case '!a': { // По алфавиту с конца
      arr = (await sort(byAlphabet)).reverse()
      break
    }
    case '!c': { // По количеству мало->много
      arr = await sort(byCount)
      break
    }
    default: { // По количеству много->мало
      arr = (await sort(byCount)).reverse()
      break
    }
  }

  const sortTypes = {
    'a': 'По алфавиту',
    '!a': 'По алфавиту с конца',
    'c': 'По количеству ролей в порядке убывания',
    '!c': 'По количеству ролей в порядке возрастания'
  }

  const sortType = sortTypes[param] || sortTypes.c

  let msg = [
    `**Роль: кол-во (${sortType})**`,
    `*Людей*: ${peopleTotal}`,
    `*Ботов*: ${botsTotal}`,
    `-------`,
    ...arr.map(el => `${el.name}: ${el.count}`)
  ].join('\n')

  try {
    message.answer(msg)
  } catch (e) {
    error('Failed to send stat', e.message)
  }
}

regMessageHandler('stat', handlerStat)
