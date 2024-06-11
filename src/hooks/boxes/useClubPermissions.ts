import { useUserInfo } from 'state/user/hooks'
import useGetBoxAddress from './useGetBoxAddress'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ZERO_ADDRESS } from 'constants/index'
import { IBoxUserStatus } from 'api/user/type'

export default function useClubPermissions() {
  const router = useRouter()
  const userInfo = useUserInfo()
  const { boxAddressRaw } = useGetBoxAddress(userInfo.box?.rewardId || undefined)
  const redirectHome = useCallback(() => {
    if (
      (userInfo.user &&
        typeof userInfo.user.boxStatus === 'number' &&
        userInfo.user.boxStatus < IBoxUserStatus.CREATED) ||
      boxAddressRaw === ZERO_ADDRESS
    ) {
      router.push('/')
      return
    }
  }, [boxAddressRaw, router, userInfo])

  useEffect(() => {
    redirectHome()
  }, [redirectHome])

  useEffect(() => {
    if (!userInfo.token) {
      router.push('/')
    }
  }, [router, userInfo.token])
}
