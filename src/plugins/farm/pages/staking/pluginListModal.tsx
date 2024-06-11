import { Box, MenuItem, Stack, Typography } from '@mui/material'
import { ITokenListItem } from 'api/common/type'
import BaseDialog from 'components/Dialog/baseDialog'
import Image from 'components/Image'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import { Dispatch, SetStateAction } from 'react'
import { viewControl } from 'views/editBox/modal'

function UserBalance({ tokenAddress }: { tokenAddress: string }) {
  const { account } = useActiveWeb3React()
  const token = useToken(tokenAddress)
  const userTokenBalance = useCurrencyBalance(account, token || undefined)
  return (
    <Typography sx={{ marginLeft: 'auto !important' }}>
      {userTokenBalance ? userTokenBalance.toSignificant() : '--'}{' '}
    </Typography>
  )
}

export default function PluginListModal({
  data,
  tokenAddress,
  setTokenAddress,
  setLogo
}: {
  data: ITokenListItem[] | undefined
  tokenAddress: string | undefined
  setTokenAddress: Dispatch<SetStateAction<string | undefined>>
  setLogo: Dispatch<SetStateAction<string | undefined>>
}) {
  return (
    <BaseDialog title="Select a Token" close>
      <Stack spacing={6}>
        {data?.map(option => (
          <MenuItem
            disabled={tokenAddress === option.contractAddress}
            value={option.contractAddress || ''}
            key={option.contractAddress}
            selected={tokenAddress === option.contractAddress}
            onClick={() => {
              setTokenAddress(option.contractAddress || '')
              setLogo(option.smallImg || '')
              viewControl.hide('PluginListModal')
            }}
          >
            <Box display={'flex'} gap={6} alignItems={'center'} p={12}>
              <Image
                src={option.smallImg || ''}
                alt="tokenLogo"
                width={24}
                height={24}
                style={{ borderRadius: '50%' }}
              />
              {option.tokenSymbol?.toLocaleUpperCase()}
            </Box>
            <UserBalance tokenAddress={option.contractAddress || ''} />
          </MenuItem>
        ))}
      </Stack>
    </BaseDialog>
  )
}
