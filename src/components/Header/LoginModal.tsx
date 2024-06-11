import { useUserInfo } from 'state/user/hooks'
import { useEffect, useMemo } from 'react'
import { useActiveWeb3React } from 'hooks'
import { globalDialogControl } from 'components/Dialog'
import useDebounce from 'hooks/useDebounce'

export default function LoginModal() {
  const { account: address } = useActiveWeb3React()
  const { token } = useUserInfo()

  const _customIsOpen = useMemo(() => !!address && !token, [address, token])
  const customIsOpen = useDebounce(_customIsOpen, 50)

  useEffect(() => {
    if (customIsOpen) {
      globalDialogControl.show('SignLoginDialog')
    } else {
      globalDialogControl.hide('SignLoginDialog')
    }
  }, [customIsOpen])

  return null
}
