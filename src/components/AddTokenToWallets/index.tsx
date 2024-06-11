import { Stack } from '@mui/material'
import { useAccount } from 'wagmi'
import Metamask from 'assets/svg/metamask.svg'
import { useCallback } from 'react'

export default function Page({
  address,
  symbol,
  decimals,
  image = ''
}: {
  address: string
  symbol: string
  decimals: number
  image: string
}) {
  const { connector, isConnected } = useAccount()
  const add = useCallback(() => {
    if (window?.ethereum?.request) {
      window.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address, // The address that the token is at.
            symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals, // The number of decimals in the token
            image // A string url of the token logo
          }
        }
      })
    } else if (connector && isConnected && connector.watchAsset) {
      connector.watchAsset?.({
        address,
        symbol,
        image,
        decimals
      })
    }
  }, [address, connector, decimals, image, isConnected, symbol])

  return (
    <>
      <Stack onClick={add} sx={{ cursor: 'pointer', width: 32, height: 'auto', minWidth: 'fit-content' }}>
        <Metamask />
      </Stack>
    </>
  )
}
