import { getAddress } from '@ethersproject/address'
import { Log } from '@ethersproject/providers'
import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'

export function isBrowser() {
  return typeof window === 'object'
}

export function getCurrentTimeStamp(date?: Date | string | number) {
  return Number(((date ? new Date(date) : new Date()).getTime() / 1000).toFixed())
}

export default function isZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function shortenStr(str: string, start = 4, end = 4) {
  if (!str || str.length <= 10) return str
  return `${str?.substring(0, start)}...${str?.substring(str?.length - end, str?.length)}`
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export function shortenHash(hash: string, suffixLength = 6): string {
  if (typeof hash !== 'string' || hash.length <= 4 + suffixLength) {
    return hash // Return original hash if it's not a string or shorter than prefix + suffix length
  }

  const prefix = hash.slice(0, 4)
  const suffix = hash.slice(-suffixLength)
  return `${prefix}...${suffix}`
}

export function isURL(url: string) {
  const strRegex = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
  const re = new RegExp(strRegex)
  return re.test(url)
}

export function isEmail(value: any): boolean {
  return /^[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{1,8}(,[A-Za-z\d]+([-_\.][A-Za-z\d]+)*@([A-Za-z\d]+[-\.])+[A-Za-z\d]{1,8})*$/.test(
    value
  )
}

export function formatBigNumber(num: BigNumber, decimalPlaces: number = 4): string {
  const roundedNum = num.toFixed(decimalPlaces)
  const [integerPart, decimalPart] = roundedNum.split('.')

  let formattedNum = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (decimalPart && parseInt(decimalPart, 10) !== 0) {
    formattedNum += `.${decimalPart.replace(/0+$/, '')}`
  }

  return formattedNum
}

export function formatGroupNumber(value: number, currencyText = '', fractionDigits = 1) {
  if (value / 1_000_000_000 >= 1) {
    return currencyText + BigNumber(value).dividedBy(1_000_000_000).toFixed(fractionDigits).toLocaleString() + 'B'
  }
  if (value / 1_000_000 >= 1) {
    return currencyText + BigNumber(value).dividedBy(1_000_000).toFixed(fractionDigits).toLocaleString() + 'M'
  }
  if (value / 1_000 >= 1) {
    return currencyText + BigNumber(value).dividedBy(1_000).toFixed(fractionDigits).toLocaleString() + 'K'
  }
  return currencyText + BigNumber(value).toFixed(fractionDigits).toLocaleString()
}

export function isSocialUrl(
  name: 'discord' | 'twitter' | 'github' | 'opensea' | 'youtube' | 'facebook' | 'medium' | 'telegram' | string,
  url: string
) {
  switch (name) {
    case 'discord':
      return (
        new RegExp(/^https:\/\/(www\.)?discord.com/).test(url) || new RegExp(/^https:\/\/(www\.)?discord.gg/).test(url)
      )
    case 'twitter':
      return new RegExp(/^https:\/\/(www\.)?twitter.com/).test(url) || new RegExp(/^https:\/\/(www\.)?x.com/).test(url)
    case 'github':
      return new RegExp(/^https:\/\/(www\.)?github.com/).test(url)
    case 'opensea':
      return new RegExp(/^https:\/\/(www\.)?opensea.io/).test(url)
    case 'youtube':
      return new RegExp(/^https:\/\/(www\.)?youtube.com/).test(url)
    case 'facebook':
      return new RegExp(/^https:\/\/(www\.)?facebook.com/).test(url)
    case 'medium':
      return new RegExp(/^https:\/\/(www\.)?medium.com/).test(url)
    case 'telegram':
      return new RegExp(/^https:\/\/(www\.)?telegram.org/).test(url) || new RegExp(/^https:\/\/t\.me/).test(url)
    default:
      return isURL(url)
  }
}

export function getEventLog(contract: Contract, logs: Log[], eventName: string, name: string): string | undefined {
  for (const log of logs) {
    if (log.address !== contract.address) {
      continue
    }
    const data = contract.interface.parseLog(log)
    if (eventName !== data.name) {
      continue
    }
    if (data.args?.[name]) {
      return data.args[name].toString()
    }
  }
  return undefined
}

export const getAddressByUserId = (userId: string) => {
  if (!userId || typeof userId !== 'string') return ''
  const cont = userId.split(':')[1]
  return cont ? `0x${cont}` : userId
}

export const POLLING_INTERVAL = 30000

export const formatStringLength = (e: string | undefined, num?: number) => {
  const defaultNumber = num ?? 20
  if (!!e) {
    if (e.length >= defaultNumber) {
      return e.slice(0, defaultNumber - 3) + '...'
    }
    return e
  }
  return undefined
}
