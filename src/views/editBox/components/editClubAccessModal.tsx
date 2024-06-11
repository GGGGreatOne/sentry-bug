import { Box, Button, MenuItem, Stack, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Input from 'components/Input'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { viewControl } from '../modal'

import QuestionIcon from 'assets/svg/claimBox/question.svg'
import DownArrow from 'assets/svg/down-white.svg'

import useBreakpoint from 'hooks/useBreakpoint'
import { LoadingButton } from '@mui/lab'
import { globalDialogControl } from 'components/Dialog'
import { useGetPluginTokenListData } from 'state/pluginTokenListConfig/hooks'
import { useActiveWeb3React } from 'hooks'
import { Currency, CurrencyAmount } from 'constants/token'
import { SupportedChainId } from 'constants/chains'
import Select from 'components/Select/Select'
import { isAddress } from 'utils'
import Tooltip from 'components/Tooltip'
import { useClubAuthCallback } from 'hooks/boxes/useClubAuthCallback'
import { CheckRoundBox } from 'components/Checkbox/CheckRoundBox'
import CurrencyLogo from 'components/essential/CurrencyLogo'

interface Props {
  clubAddress?: string | undefined
  onCancel?: () => void
}

enum CheckType {
  Public,
  SetPrice,
  WhiteList
}

const StyleTitleLabelLayout = styled(Box)(({}) => ({
  width: '100%',
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}))

const TitleLabel = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontFamily: 'Public Sans',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '28px',
  letterSpacing: '-0.02em',
  maxWidth: 'max-content',
  [theme.breakpoints.down('md')]: {
    fontSize: 15
  }
}))

const StyleInput = styled(Input)(() => ({
  width: '100%',
  border: '1px solid #D7D6D9 !important',
  borderRadius: '8px !important',
  span: {
    paddingRight: '16px !important'
  }
}))

function SelectEnterToken({
  chainId,
  checkToken,
  setCheckToken
}: {
  chainId: number | undefined
  checkToken: Currency | undefined
  setCheckToken: Dispatch<SetStateAction<Currency | undefined>>
}) {
  const { pluginTokenList } = useGetPluginTokenListData()
  console.log('🚀 ~ pluginTokenList:', pluginTokenList)
  const TokenList = pluginTokenList.map(v => {
    return new Currency(
      chainId || SupportedChainId.BIT_DEVNET,
      v.contractAddress || '',
      v.decimals || 18,
      v.tokenSymbol || '',
      v.tokenName,
      v.smallImg || ''
    )
  })

  const handleTokenSelection = useCallback(
    (e: Currency) => {
      setCheckToken(e)
      globalDialogControl.hide('SelectTokenDialog')
    },
    [setCheckToken]
  )

  const openModal = useCallback(() => {
    globalDialogControl.show('SelectTokenDialog', {
      tokens: TokenList,
      curSelectToken: checkToken,
      handleTokenSelection,
      showCreate: false
    })
  }, [TokenList, checkToken, handleTokenSelection])

  return (
    <Typography
      onClick={openModal}
      noWrap
      sx={{
        cursor: 'pointer',
        fontFamily: 'IBM Plex Sans',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        height: '100%'
      }}
    >
      {checkToken ? (
        <>
          <CurrencyLogo currencyOrAddress={checkToken.address} size="20px" />
          {checkToken?.symbol}
        </>
      ) : (
        <>Select Token</>
      )}
      <DownArrow />
    </Typography>
  )
}

function EditClubAccess({
  clubAddress,
  onCancel,
  chainId
}: {
  clubAddress: string | undefined
  onCancel?: () => void
  chainId?: SupportedChainId | undefined
}) {
  const isMd = useBreakpoint('md')
  const { setMemberModeToPayment, setMemberModeToWhiteList } = useClubAuthCallback(clubAddress)
  const [checkType, setCheckType] = useState<number>(CheckType.Public)
  const [loading, setLoading] = useState<boolean>(false)
  const [checkToken, setCheckToken] = useState<Currency | undefined>()
  const [price, setPrice] = useState<string>('')
  const [whiteListVal, setWhiteListVal] = useState<string>('')
  const [selectWhiteFarm, setSelectWhiteFarm] = useState<string>('')

  const tokenCurrencyAmount = useMemo(() => {
    if (checkToken) {
      return CurrencyAmount.fromAmount(checkToken, price)
    }
    return undefined
  }, [checkToken, price])

  const SetPayClubAccess = useCallback(async () => {
    if (!tokenCurrencyAmount) return
    setLoading(true)
    try {
      const PayAmountRes = await setMemberModeToPayment(tokenCurrencyAmount)
      console.log('🚀 ~ SetPayClubAccess ~ PayAmountRes:', PayAmountRes)
      setLoading(false)
      onCancel?.()
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [setMemberModeToPayment, tokenCurrencyAmount, onCancel])

  const SetWhiteListClubAccess = useCallback(async () => {
    let WhiteData: string[] = []
    if (whiteListVal.trim()) {
      const arr = whiteListVal.trim().split(/\r?\n|\r/)
      if (arr.find(v => !isAddress(v))) {
        alert('whiteList address error')
        return
      }
      WhiteData = arr
    }
    if (!WhiteData.length) return
    setLoading(true)
    try {
      const WhiteListRes = await setMemberModeToWhiteList(WhiteData)
      console.log('🚀 ~ SetWhiteListClubAccess ~ WhiteListRes:', WhiteListRes)
      setLoading(false)

      onCancel?.()
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }, [setMemberModeToWhiteList, whiteListVal, onCancel])

  const Submit = useCallback(() => {
    if (CheckType.Public === checkType) {
      onCancel?.()
      return
    }
    if (CheckType.SetPrice === checkType) {
      SetPayClubAccess()
    }
    if (CheckType.WhiteList === checkType) {
      SetWhiteListClubAccess()
    }
  }, [SetPayClubAccess, SetWhiteListClubAccess, checkType, onCancel])

  const WhiteListFarms = ['1', '2', '3', '4', '5']

  const isShow = false
  return (
    <Stack spacing={{ xs: 16, md: 32 }} width={{ xs: '100%', md: 514 }} maxWidth={514}>
      <StyleTitleLabelLayout
        sx={{
          opacity: checkType === CheckType.Public ? 1 : 0.5
        }}
      >
        <CheckRoundBox
          onChange={() => setCheckType(CheckType.Public)}
          curryCheck={checkType}
          value={CheckType.Public}
        />
        <TitleLabel>Public</TitleLabel>
      </StyleTitleLabelLayout>

      <Stack>
        <StyleTitleLabelLayout
          sx={{
            opacity: checkType === CheckType.SetPrice ? 1 : 0.5
          }}
        >
          <CheckRoundBox
            onChange={() => setCheckType(CheckType.SetPrice)}
            curryCheck={checkType}
            value={CheckType.SetPrice}
          />
          <TitleLabel> Set Entry Price </TitleLabel>
          <Tooltip
            placement={isMd ? 'top' : 'top-start'}
            title="You can set your Club to a private, fee-based mode (once set, the mode and amount cannot be changed)."
          >
            <Box display={'flex'} alignItems={'center'}>
              <QuestionIcon
                style={{
                  cursor: 'pointer'
                }}
              />
            </Box>
          </Tooltip>
        </StyleTitleLabelLayout>
        <Box
          key={CheckType.SetPrice + 'SetPrice'}
          sx={{
            height: checkType === CheckType.SetPrice ? (isMd ? 40 : 56) : 0,
            overflow: 'hidden',
            transition: 'all 0.4s',
            marginTop: checkType === CheckType.SetPrice ? 16 : 0
          }}
        >
          <StyleInput
            height={isMd ? 40 : 56}
            outlined
            type="unumber"
            value={price}
            onValue={e => {
              if (checkToken) {
                setPrice(e)
              }
            }}
            placeholder="Enter..."
            endAdornment={<SelectEnterToken chainId={chainId} checkToken={checkToken} setCheckToken={setCheckToken} />}
          />
        </Box>
      </Stack>

      <StyleTitleLabelLayout
        sx={{
          opacity: checkType === CheckType.WhiteList ? 1 : 0.5
        }}
      >
        <CheckRoundBox
          onChange={() => setCheckType(CheckType.WhiteList)}
          curryCheck={checkType}
          value={CheckType.WhiteList}
        />

        <TitleLabel> Whitelist </TitleLabel>
        <Tooltip
          placement={isMd ? 'top' : 'top-start'}
          title="You can set your Club to a private whitelist mode (once set, the mode cannot be changed, but allowed addresses can be manually updated)."
        >
          <Box display={'flex'} alignItems={'center'}>
            <QuestionIcon
              style={{
                cursor: 'pointer'
              }}
            />
          </Box>
        </Tooltip>
        <Typography
          sx={{
            fontSize: 13,
            color: 'var(--ps-text-60)'
          }}
        >{`(Only one address per line)`}</Typography>
      </StyleTitleLabelLayout>

      <Box
        key={CheckType.WhiteList + 'WhiteList'}
        sx={{
          height: checkType === CheckType.WhiteList ? 180 : 0,
          overflow: 'hidden',
          transition: 'all 0.4s',
          marginTop: checkType === CheckType.WhiteList ? '16px !important' : 0
        }}
      >
        <Stack spacing={16}>
          {isShow && (
            <Select
              height={isMd ? 42 : 56}
              style={{
                ':hover': {
                  backgroundColor: '#535353 !important',
                  opacity: 0.7
                }
              }}
              placeholder="Select Whitelist farm"
              value={selectWhiteFarm}
              onChange={e => {
                setSelectWhiteFarm(e.target.value)
              }}
            >
              {WhiteListFarms.map(v => (
                <MenuItem key={v} value={v} selected={v === selectWhiteFarm}>
                  {v}
                </MenuItem>
              ))}
            </Select>
          )}

          <Input
            height={180}
            placeholder="Enter addresses"
            multiline
            type="string"
            rows={6}
            value={whiteListVal}
            onValue={e => {
              setWhiteListVal(e)
            }}
            style={{
              borderRadius: '8px'
            }}
          />
        </Stack>
      </Box>

      <Stack
        width={'100%'}
        justifyContent={isMd ? 'center' : 'flex-end'}
        direction={'row'}
        alignItems={'center'}
        spacing={16}
        sx={{
          '& button': {
            width: 133,
            height: isMd ? 36 : 44,
            fontSize: isMd ? 13 : 15,
            fontWeight: 500
          }
        }}
      >
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          disabled={
            (checkType === CheckType.SetPrice && !tokenCurrencyAmount?.greaterThan('0')) ||
            (checkType === CheckType.WhiteList && !whiteListVal)
          }
          loading={loading}
          variant="contained"
          onClick={Submit}
        >
          Save
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

const EditClubAccessModal = ({ clubAddress, onCancel }: Props) => {
  const { account, chainId } = useActiveWeb3React()

  const onCloseCb = useCallback(() => {
    onCancel ? onCancel() : viewControl.hide('EditClubAccessModal')
  }, [onCancel])

  useEffect(() => {
    onCloseCb()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <BaseDialog title={'Set Club Access'} close>
      <EditClubAccess clubAddress={clubAddress} onCancel={onCloseCb} chainId={chainId} />
    </BaseDialog>
  )
}
export default EditClubAccessModal
