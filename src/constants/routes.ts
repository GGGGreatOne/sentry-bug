export const ROUTES = {
  home: '/',
  market: '/market',
  club: {
    index: '/clubs',
    cusBox: (clubId: string | number) => `/club/${clubId}`,
    editClub: '/club/editClub'
  },
  appStore: {
    index: '/appStore',
    submitApp: '/appStore/submitApp',
    pluginDetail: (pluginId: string | number) => `/appStore/${pluginId}`
    // editClub: '/club/editClub'
  },
  lastestUpdates: '/lastestupdates',
  wallet: {
    index: '/wallet',
    name1: (name: string) => `/wallet/${name}`,
    name2: (name1: string, name2: string) => `/wallet/${name1}/${name2}`
  },
  account: {
    myAssets: '/account/myAssets',
    dashboard: '/account/dashboard'
  },
  claimClub: `/claimClub`,
  clubs: {
    index: '/clubs',
    allClub: '/clubs/allclubs'
  },
  auction: {
    createPool: '/auction/erc20-create-pool',
    createPoolById: (id: string) => `/auction/erc20-create-pool?id=${id}`,
    poolDetail: (clubId: string, poolId: string) => `/auction/${clubId}/${poolId}`
  },
  tokenToolBox: {
    tokenLocker: ({
      tokenType,
      version,
      chainId,
      tokenAddr
    }: {
      tokenType?: string
      version?: string
      chainId?: string
      tokenAddr?: string
    }) => {
      if (tokenType && version) return `/tokenToolBox/tokenLocker?tokenType=${tokenType}&version=${version}`
      if (chainId && tokenAddr) return `/tokenToolBox/tokenLocker?chainId=${chainId}&tokenAddr=${tokenAddr}`
      return `/tokenToolBox/tokenLocker`
    },
    tokenLockerInfo: (chainId?: string, hash?: string) => {
      return `/tokenToolBox/tokenLockerInfo?chainId=${chainId}&hash=${hash}`
    },
    lockerLpInfo: (chainId?: string, hash?: string) => {
      return `/tokenToolBox/lockerLpInfo?chainId=${chainId}&hash=${hash}`
    },
    tokenLPLockerInfo: (chainId?: string, hash?: string) => {
      return `/tokenToolBox/tokenLPLockerInfo?chainId=${chainId}&hash=${hash}`
    },
    disperse: (chainId?: string, disperseType?: string, tokenAddr?: string) => {
      if (chainId && disperseType && tokenAddr) {
        return `/tokenToolBox/disperse?chain=${chainId}&disperseType=${disperseType}&tokenAddr=${tokenAddr}`
      }
      return `/tokenToolBox/disperse`
    },
    tokenInfo: (tokenAddr: string) => {
      return `/tokenToolBox/tokenInfo?tokenAddr=${tokenAddr}`
    },
    tokenMinter: '/tokenToolBox/tokenMinter',
    tokenMinterList: '/tokenToolBox/tokenMinterList',
    myLock: '/tokenToolBox/myLock',
    myDisperse: '/tokenToolBox/myDisperse',
    diperseDetail: '/tokenToolBox/diperseDetail'
  }
}
