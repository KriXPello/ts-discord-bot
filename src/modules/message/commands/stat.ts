import { GuildChannel } from 'discord.js'

import { regMessageHandler } from '../commands-router'

import { ExtendedMessage } from '../types'

const objToArr = (obj: any): any[] => {
  const arr = []

  for (let key in obj) {
    arr.push(obj[key])
  }

  return arr
}

const byAlphabet = (a, b) =>
  a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1

const byCount = (a, b) => a.count - b.count

const createSort = (stat) => {
  const func = (sorter): any[] =>
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

  let arr = null

  switch (param) {
    case 'a': { // По алфавиту
      arr = sort(byAlphabet)
      break
    }
    case '!a': { // По алфавиту с конца
      arr = sort(byAlphabet).reverse()
      break
    }
    case '!c': { // По количеству мало->много
      arr = sort(byCount)
      break
    }
    default: { // По количеству много->мало
      arr = sort(byCount).reverse()
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

  message.answer(msg)
}

regMessageHandler('stat', handlerStat)
