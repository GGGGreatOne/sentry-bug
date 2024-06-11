import { Button, Stack, Typography } from '@mui/material'
import WarningIcon from 'assets/svg/statusIcon/warning_icon.svg'
import { useWalletModalToggle } from 'state/application/hooks'
import { IsLogin } from 'state/boxes/type'
import { useRequest } from 'ahooks'
import { AuthorizeTwitter } from 'api/user'
import { useEffect, useState } from 'react'

export default function BoxTip({ tipTab }: { tipTab?: number }) {
  const WalletModalToggle = useWalletModalToggle()
  const [url, setUrl] = useState<undefined | string>(undefined)
  const { run } = useRequest(
    async () => {
      const { data } = await AuthorizeTwitter()
      setUrl(data.url)
    },
    {
      manual: true
    }
  )
  useEffect(() => {
    if (tipTab === IsLogin.UnPermissions) {
      run()
    }
  }, [run, tipTab])
  return (
    <Stack spacing={16}>
      <Stack
        sx={{
          '& svg': {
            margin: '0 auto'
          }
        }}
      >
        <WarningIcon />
      </Stack>
      <Typography width="100%" px={40} textAlign={'center'} fontSize={16}>
        The current page is restricted. Please connect your wallet to access this page.
      </Typography>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} spacing={20}>
        {tipTab === IsLogin.Unlogin && (
          <Button
            variant="contained"
            onClick={() => {
              WalletModalToggle()
            }}
            sx={{
              width: 160,
              height: 44,
              padding: '12px 24px',
              backgroundColor: 'var(--ps-text-100)'
            }}
          >
            Connect Wallet
          </Button>
        )}
        {tipTab === IsLogin.UnPermissions && (
          <Button
            variant="contained"
            onClick={() => {
              if (!url) return
              window.open(
                url,
                'intent',
                'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
              )
            }}
            sx={{
              width: 160,
              height: 44,
              padding: '12px 24px',
              backgroundColor: 'var(--ps-text-100)'
            }}
          >
            Connect Twitter
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
