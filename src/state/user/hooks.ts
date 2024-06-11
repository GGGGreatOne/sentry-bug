import { useRequest } from 'ahooks'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { addressRegisterOrLogin } from 'api/user'
import {
  fetchUserBoxCheckStatus,
  fetchUserProfile,
  getLocalUserToken,
  initLoginInfo,
  removeLoginInfo,
  saveLoginInfo,
  saveUserProfile
} from './reducer'
import { useCallback, useEffect, useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { IAddressRegisterLoginResponse, IBoxUserStatus } from 'api/user/type'
import { IResponse } from 'utils/fetch/type'
import { AppState } from 'state'
import { useDisconnect, useSignMessage } from 'wagmi'
import useGetBoxAddress from 'hooks/boxes/useGetBoxAddress'
// import { useDIDLogin } from 'plugins/chatroom/hooks/useDIDLogin'

export function useUserInfo(): AppState['user'] {
  const { account } = useActiveWeb3React()
  const userState = useSelector<AppState, AppState['user']>(state => state.user)

  const { boxAddress } = useGetBoxAddress(userState?.box?.rewardId || undefined)

  return useMemo(() => {
    if (!account || userState.address.toLowerCase() !== account.toLowerCase()) {
      return {
        token: '',
        address: '',
        userId: 0,
        box: null,
        follow: null,
        user: null
      }
    }
    const _boxAddress = boxAddress || userState?.box?.boxAddress || undefined

    return {
      token: userState.token,
      address: userState.address,
      userId: userState.userId,
      box: (userState.box && Object.assign({ ...userState.box }, { boxAddress: _boxAddress })) || null,
      follow: userState?.follow || null,
      user: userState?.user
        ? {
            ...userState?.user,
            boxStatus: _boxAddress ? IBoxUserStatus.CREATED : userState?.user.boxStatus
          }
        : null
    }
  }, [
    account,
    boxAddress,
    userState.address,
    userState.box,
    userState?.follow,
    userState.token,
    userState?.user,
    userState.userId
  ])
}

export function useIsDiDLogin(): boolean | undefined {
  const userState = useSelector<AppState, AppState['user']>(state => state.user)
  return userState?.didLogin
}

const RemoveDIDLogin = () => {
  localStorage.setItem('sdn_access_token', '')
  localStorage.setItem('sdn_user_id', '')
  localStorage.setItem('sdn_user_address', '')
}

export const useWeb3Login = () => {
  const dispatch = useDispatch()
  const { account } = useActiveWeb3React()
  const { signMessageAsync } = useSignMessage()
  // const didLogin = useDIDLogin()
  return useRequest(
    () =>
      new Promise(
        async (resolve: (value: IResponse<IAddressRegisterLoginResponse> & { account: string }) => void, reject) => {
          try {
            const message = 'Welcome to BounceClub'
            const signRes = await signMessageAsync({ message })
            // const signRes = await didLogin(account || '')

            const res = await addressRegisterOrLogin({
              walletAddress: account || '',
              text: message,
              signature: signRes
            })
            resolve({ ...res, account: account || '' })
          } catch (error) {
            reject(error)
          }
        }
      ),
    {
      manual: true,
      onSuccess: async response => {
        const data = response
        const code = data.code
        if (code === 10412) {
          return toast.error('Incorrect password')
        }
        if (code === 10401) {
          return toast.error('Incorrect Account')
        }
        if (code === 10457) {
          return toast.error(
            'Your account already exists. For Metalents users who log in to BounceClub for the first time, please click Forgot Password to verify your email.'
          )
        }
        if (code === 10406 || code === 10418 || code === 10407) {
          return toast.error('Sorry, your account has not been registered yet. Please register first.')
        }
        if (code !== 200) {
          return toast.error('Login failed')
        }
        toast.success('Welcome to BounceClub')
        RemoveDIDLogin()
        dispatch(
          saveLoginInfo({
            token: data.data.token,
            userId: data.data.userId,
            address: data.account
          })
        )
        return
        // if (path) {
        //   return navigate.push(path)
        // }
        // return navigate.push('/')
      }
    }
  )
}

export const useLogout = () => {
  const dispatch = useDispatch()
  const { disconnect } = useDisconnect({
    // There is a delay in disconnecting wagmi on the mobile phone
    // So use the callback function to execute
    onSuccess() {
      dispatch(removeLoginInfo())
      // remove chatroom cache
      RemoveDIDLogin()
    }
  })
  const handleLogout = () => {
    disconnect()
  }
  return { logout: handleLogout }
}

// interface IUserInfoData {
//   address: string
//   id: number
//   email: string
//   passwordSet: boolean
//   fullName: string
//   fullNameId: number
//   avatar: {
//     id: number
//     type: number
//     userId: number
//     fileName: string
//     fileType: string
//     fileSize: number
//     fileUrl: string
//     fileThumbnailUrl: string
//   }
//   banner: string
//   location: string
//   timezone: string
//   publicRole: number[]
//   companyRole: number
//   company: { name: string; avatar: string; link: string }
//   companyId: number
//   thirdpartId: number
//   university: { name: string; avatar: string; link: string }
//   description: string
//   contactEmail: string
//   website: string
//   github: string
//   discord: string
//   instagram: string
//   googleEmail: string
//   twitter: string
//   twitterName: string
//   linkedin: string
//   linkedinName: string
//   userType: number
//   isMember: number
//   primaryRole: number
//   years: number
//   skills: string
//   currentState: string
//   jobTypes: any[]
//   ifRemotely: 0
//   desiredSalary: string
//   desiredCompanySize: number
//   desiredMarket: any[]
//   careJobs: any[]
//   resumes: any[]
//   // isVerify: number
//   ifKyc: number
//   isWhitelist: 0 | 2 //0: no - 2: yes
//   tg_token: string
//   tgIntroduction: string
// }

// export function useUserInfo(): ICacheLoginInfo & {
//   userInfo?: IUserInfoData
//   companyInfo: any
// } {
//   const { account } = useActiveWeb3React()
//   const loginInfo = useSelector<AppState, AppState['user']>(state => state.user)
//   if (account !== loginInfo.address) {
//     return {
//       address: '',
//       token: '',
//       userId: 0,
//       userType: '0',
//       userInfo: undefined,
//       companyInfo: {}
//     }
//   }
//   return loginInfo
// }

// export function useRefreshUserInfoByFirstLoad() {
//   const [first, setFirst] = useState(true)
//   const dispatch = useDispatch()
//   const { token, userId } = useUserInfo()

//   useEffect(() => {
//     if (!first || !token || !userId) return
//     setFirst(false)
//     dispatch(
//       fetchUserInfo({
//         userId: userId
//       })
//     )
//   }, [dispatch, first, token, userId])
// }

export function useUpdateUserLoginInfoWithWindowVisible() {
  const windowVisible = useIsWindowVisible()
  const dispatch = useDispatch()

  useEffect(() => {
    const localUserToken = getLocalUserToken()

    if (windowVisible) {
      initLoginInfo({
        token: localUserToken?.token,
        userId: localUserToken?.userId,
        address: localUserToken?.address
      })
    }
  }, [dispatch, windowVisible])
}

export function useUpdateUserInfoInterval() {
  const dispatch = useDispatch()
  const { token } = useUserInfo()

  useRequest(
    async () => {
      if (!token) {
        dispatch(saveUserProfile(null))
        return
      }
      setTimeout(() => dispatch(fetchUserProfile()), 10)
    },
    {
      refreshDeps: [token],
      refreshOnWindowFocus: true
    }
  )

  useRequest(
    async () => {
      if (!token) {
        return
      }
      setTimeout(() => dispatch(fetchUserBoxCheckStatus()), 100)
    },
    {
      refreshDeps: [token]
    }
  )
}
export function useRefreshUserInfo() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(fetchUserProfile())
  }, [dispatch])
}
export function useRefreshCheckStatus() {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(fetchUserBoxCheckStatus())
  }, [dispatch])
}
