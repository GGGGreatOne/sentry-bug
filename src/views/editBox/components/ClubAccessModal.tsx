import { Box, Button, Link, Stack, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'

import { useCallback, useMemo, useState } from 'react'
import { viewControl } from '../modal'

import useBreakpoint from 'hooks/useBreakpoint'
import { LoadingButton } from '@mui/lab'
import { Currency, CurrencyAmount } from 'constants/token'
import Router from 'next/router'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { ILinksValue } from 'state/boxes/type'
import LinkIcon from 'components/LinkIcon'
import { ROUTES } from 'constants/routes'
import { useClubAuthCallback } from 'hooks/boxes/useClubAuthCallback'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCurrencyBalance } from 'hooks/useToken'

interface Props {
  clubAddress?: string | undefined
  onCancel?: () => void
  payToken?: Currency | undefined
  payTokenAmount?: CurrencyAmount | undefined
  isPayMode?: boolean | undefined
  handlePay?: () => void
  links: ILinksValue[] | undefined
}

const StyleSocials = styled(Box)(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#FFFFFF1A',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyleContent = styled(Typography)(({ theme }) => ({
  color: 'var(--ps-neutral4)',
  textAlign: 'center',
  fontFamily: 'IBM Plex Sans',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.4,
  maxWidth: 360,
  [theme.breakpoints.down('md')]: {
    fontSize: 14
  }
}))

const StyleLoadingButton = styled(LoadingButton)(() => ({
  whiteSpace: 'nowrap'
}))

function WhiteListMode({
  onCancel,
  isMd,
  Socials
}: {
  onCancel?: () => void
  isMd?: boolean | undefined
  Socials?: JSX.Element | undefined
}) {
  return (
    <Stack spacing={40} width="100%">
      <StyleContent>
        Sorry! You are not eligible. Only whitelisted users are eligible to access private clubs.{' '}
        {Socials && 'You can still visit:'}
      </StyleContent>
      {Socials}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          width: '100%',
          '& button': {
            height: isMd ? 36 : 44,
            fontSize: isMd ? 13 : 15,
            fontWeight: 500
          }
        }}
      >
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <StyleLoadingButton variant="contained" onClick={onCancel}>
          OK
        </StyleLoadingButton>
      </Box>
    </Stack>
  )
}

function PayMode({
  clubAddress,
  onCancel,
  isMd,
  Socials
}: {
  clubAddress?: string | undefined
  onCancel?: () => void
  isMd?: boolean | undefined
  Socials?: JSX.Element | undefined
}) {
  const { paymentToken, paymentTokenAmount, userSubscribe } = useClubAuthCallback(clubAddress)
  const [approvalState, run] = useApproveCallback(paymentTokenAmount, clubAddress)
  const [loading, setLoading] = useState<boolean>(false)
  const SubmitPay = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userSubscribe()
      console.log(res)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [userSubscribe])
  const WalletModalToggle = useWalletModalToggle()

  const { account, chainId } = useActiveWeb3React()

  const tokenBalance = useCurrencyBalance(account, paymentToken, chainId)

  const needPay = useMemo(() => {
    if (paymentTokenAmount) {
      return !tokenBalance?.greaterThan(paymentTokenAmount)
    }
    return true
  }, [paymentTokenAmount, tokenBalance])

  const bt = useMemo(() => {
    if (!account) {
      return (
        <StyleLoadingButton onClick={WalletModalToggle} variant="contained">
          Sign in
        </StyleLoadingButton>
      )
    }
    if (!paymentTokenAmount) {
      return (
        <StyleLoadingButton disabled variant="contained">
          loading...
        </StyleLoadingButton>
      )
    }
    if (needPay) {
      return (
        <StyleLoadingButton disabled variant="contained">
          Insufficient balance
        </StyleLoadingButton>
      )
    }

    if (approvalState !== ApprovalState.APPROVED) {
      return (
        <StyleLoadingButton loading={approvalState === ApprovalState.PENDING} variant="contained" onClick={run}>
          Approval {paymentTokenAmount?.currency.symbol}
        </StyleLoadingButton>
      )
    }
    return (
      <StyleLoadingButton
        loading={loading}
        disabled={approvalState !== ApprovalState.APPROVED}
        variant="contained"
        onClick={SubmitPay}
      >
        Pay
      </StyleLoadingButton>
    )
  }, [SubmitPay, WalletModalToggle, account, approvalState, loading, needPay, paymentTokenAmount, run])

  return (
    <Stack spacing={40} width="100%" alignItems={'center'}>
      <StyleContent>
        This is a private club. You need to pay {paymentTokenAmount?.toExact() || '--'} {paymentToken?.symbol || '--'}{' '}
        to gain permanent access to the Club. {Socials && 'You can still visit:'}
      </StyleContent>
      {Socials}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          width: '100%',
          '& button': {
            height: isMd ? 36 : 44,
            fontSize: isMd ? 13 : 15,
            fontWeight: 500
          }
        }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            onCancel ? onCancel() : viewControl.hide('ClubAccessModal')
          }}
        >
          Cancel
        </Button>

        {bt}
      </Box>
    </Stack>
  )
}

const ClubAccessModal = ({ clubAddress, onCancel, isPayMode, links }: Props) => {
  const isMd = useBreakpoint('md')

  const socialsLink = useMemo(() => {
    return links?.filter(v => v.url && v)
  }, [links])

  const onCloseCb = useCallback(() => {
    onCancel ? onCancel() : viewControl.hide('ClubAccessModal')
    Router.push(ROUTES.home)
  }, [onCancel])

  const Socials = useMemo(() => {
    if (!socialsLink?.length) return undefined
    return (
      <Box
        sx={{
          display: 'flex',
          gap: { xs: '8px', md: '16px' }
        }}
      >
        {socialsLink?.map(item =>
          item?.url ? (
            <Link href={item.url} key={item.typeName} target="_blank">
              <StyleSocials>
                <LinkIcon type={item.typeName} isMd={isMd} />
              </StyleSocials>
            </Link>
          ) : null
        )}
      </Box>
    )
  }, [isMd, socialsLink])

  return (
    <BaseDialog
      title=""
      onClose={onCloseCb}
      sx={{
        '.MuiPaper-root': {
          width: '440px',
          padding: '32px 40px 40px'
        },
        '.MuiDialogContent-root': {
          marginTop: '12px'
        }
      }}
    >
      <Stack width={'100%'} spacing={24}>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontFamily: 'IBM Plex Sans',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.4,
            textAlign: 'center'
          }}
        >
          Club Access
        </Typography>
        {isPayMode ? (
          <PayMode clubAddress={clubAddress} onCancel={onCloseCb} isMd={isMd} Socials={Socials} />
        ) : (
          <WhiteListMode onCancel={onCloseCb} isMd={isMd} Socials={Socials} />
        )}
      </Stack>
    </BaseDialog>
  )
}
export default ClubAccessModal
