import { Box, Button, InputBase, Stack, styled, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import React, { useMemo, useState } from 'react'
import { useCreatPool } from '../../../hook/useCreatPool'
import BigNumber from 'bignumber.js'
import Image from 'next/image'
import BTCBImg from 'assets/images/boxes/bbtc.png'
import useBreakpoint from '../../../../../hooks/useBreakpoint'
import { useGetPluginTokenListData } from '../../../../../state/pluginTokenListConfig/hooks'
import { useActiveWeb3React } from '../../../../../hooks'
import { Currency, CurrencyAmount } from '../../../../../constants/token'
import { SupportedChainId } from '../../../../../constants/chains'
import { globalDialogControl } from '../../../../../components/Dialog'
import { FACTORY_ADDRESS, VALIDITY_ADDRESS_LENGTH, WBB_ADDRESS } from '../../../constants'
import { QuantosDetails } from '../../../hook/useFactory'
import { ApprovalState, useApproveCallback } from '../../../../../hooks/useApproveCallback'
import { useEditBoxPluginBitleverageData } from '../../../../../state/boxes/hooks'
import { ZERO_ADDRESS } from '../../../../../constants'
import { COMMON_BASES } from '../../../../../components/Widget2/constants/routing'

const Column = styled(Stack)({
  gap: 16,
  '& .label': {
    color: 'var(--ps-text-100)',
    fontFamily: 'SF Pro Display',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: '130%',
    textAlign: 'left'
  }
})
const InputStyle = styled(InputBase)({
  width: '100%',
  background: 'transparent',
  height: '44px',
  borderRadius: '4px',
  border: '1px solid var(--ps-text-20)',
  padding: '16px 8px 16px 16px',
  color: 'var(--ps-text-60, rgba(255, 255, 255, 0.60))',
  fontFamily: '"SF Pro Display"',
  fontSize: '16px',
  lineHeight: '140%'
})

enum ButtonText {
  ADDED = 'Already added',
  DEPOSIT = 'Deposit and create',
  AMOUNT = 'Amount must be greater 2000'
}

const CreateLiquidityDialog = ({
  boxAddress,
  allQuantos
}: {
  boxAddress: string
  allQuantos: undefined | QuantosDetails[]
}) => {
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenDecimals, setTokenDecimals] = useState(18)
  const [selectToken, setSelectToken] = useState<Currency | undefined>(undefined)
  const [initAmount, setInitAmount] = useState('')
  const { pluginTokenList } = useGetPluginTokenListData()
  const { updateBoxPluginBitleverageDataCallback } = useEditBoxPluginBitleverageData()
  const { chainId } = useActiveWeb3React()

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

  const bases = chainId !== undefined ? COMMON_BASES[chainId] ?? [] : []

  const hotTokenList = useMemo(() => {
    if (!bases.length) return undefined

    return bases
      ?.filter(b => b.symbol !== 'ETH')
      .map(v => {
        const formatSymbol = v.symbol?.toUpperCase() === 'WBB' ? 'BB' : v.symbol
        return new Currency(
          chainId || SupportedChainId.BIT_DEVNET,
          v.isNative ? ZERO_ADDRESS : v?.wrapped.address || '',
          v.decimals || 18,
          formatSymbol || '',
          v.name,
          ''
        )
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId])
  const isLg = useBreakpoint('lg')
  const openModal = () => {
    globalDialogControl.show('SelectTokenDialog', {
      tokens: TokenList.filter(t => !t.isNative),
      handleTokenSelection: v => {
        setTokenAddress(v.address)
        setTokenDecimals(v.decimals)
        setSelectToken(v)
        globalDialogControl.hide('SelectTokenDialog')
      },
      hotTokenList: hotTokenList
    })
  }
  const [approveState, approve] = useApproveCallback(
    selectToken ? CurrencyAmount.fromAmount(selectToken, initAmount) : undefined,
    FACTORY_ADDRESS,
    false,
    true
  )

  const { runWithModal } = useCreatPool(tokenAddress, boxAddress, new BigNumber(initAmount), tokenDecimals)

  const AddedTokenList = useMemo(() => {
    if (allQuantos) return allQuantos.map(q => q.tokenT)
    else return undefined
  }, [allQuantos])

  const createButtonText = useMemo(() => {
    if (AddedTokenList?.includes(tokenAddress)) return ButtonText.ADDED
    if (new BigNumber(initAmount).isLessThanOrEqualTo(2000)) return ButtonText.AMOUNT
    return ButtonText.DEPOSIT
  }, [AddedTokenList, tokenAddress, initAmount])

  return (
    <BaseDialog title="Liquidity Creation" sx={{ '& .MuiDialog-paper': { minWidth: isLg ? 'unset' : 1036 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: isLg ? '1fr' : 'auto 48px 440px' }}>
        {isLg && <Info />}
        <Stack sx={{ mt: isLg ? '16px' : '' }} component={'form'} spacing={24}>
          <Column>
            <Typography className="label">Choose Target Market</Typography>
            {/*<Select*/}
            {/*  size="small"*/}
            {/*  onChange={() => {}}*/}
            {/*  displayEmpty*/}
            {/*  inputProps={{ 'aria-label': 'Without label' }}*/}
            {/*  renderValue={v => {*/}
            {/*    return (*/}
            {/*      <Stack flexDirection={'row'}>*/}
            {/*        <Typography*/}
            {/*          mr={10}*/}
            {/*          sx={{*/}
            {/*            color: 'var(--ps-text-60))',*/}
            {/*            fontSize: '16px',*/}
            {/*            lineHeight: '140%'*/}
            {/*          }}*/}
            {/*        >*/}
            {/*          BTC*/}
            {/*        </Typography>*/}
            {/*        <Typography*/}
            {/*          sx={{*/}
            {/*            color: 'var(--ps-green)',*/}
            {/*            fontSize: '16px',*/}
            {/*            lineHeight: '140%'*/}
            {/*          }}*/}
            {/*        >*/}
            {/*          {v}*/}
            {/*        </Typography>*/}
            {/*      </Stack>*/}
            {/*    )*/}
            {/*  }}*/}
            {/*>*/}
            {/*  <MenuItem value={'62,890.23'} sx={{ borderRadius: 0 }}>*/}
            {/*    <Stack flexDirection={'row'}>*/}
            {/*      <Typography*/}
            {/*        mr={10}*/}
            {/*        sx={{*/}
            {/*          color: 'var(--ps-text-60))',*/}
            {/*          fontSize: '16px',*/}
            {/*          lineHeight: '140%'*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        BTC*/}
            {/*      </Typography>*/}
            {/*      <Typography*/}
            {/*        sx={{*/}
            {/*          color: 'var(--ps-green)',*/}
            {/*          fontSize: '16px',*/}
            {/*          lineHeight: '140%'*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        {'62,890.23'}*/}
            {/*      </Typography>*/}
            {/*    </Stack>*/}
            {/*  </MenuItem>*/}
            {/*</Select>*/}
            <Stack
              sx={{
                borderRadius: '4px',
                border: '1px solid var(--ps-text-20)',
                padding: '16px 8px 16px 16px',
                color: 'var(--ps-text-60, rgba(255, 255, 255, 0.60))'
              }}
              flexDirection={'row'}
              alignItems={'center'}
            >
              <Image src={BTCBImg.src} style={{ borderRadius: '50%' }} width={30} height={30} alt="" />
              <Typography
                mr={10}
                sx={{
                  color: 'var(--ps-text-60))',
                  fontSize: '16px',
                  lineHeight: '140%',
                  ml: '8px'
                }}
              >
                BBTC
              </Typography>
              <Typography
                sx={{
                  color: 'var(--ps-green)',
                  fontSize: '16px',
                  lineHeight: '140%'
                }}
              ></Typography>
            </Stack>
          </Column>
          <Column>
            <Typography className="label">Select Token Collateral</Typography>
            {/*            <FormItem name="tokenAddress">*/}
            {/*              <Box sx={{ position: 'relative' }}>*/}
            {/*                <InputStyle*/}
            {/*                  value={tokenAddress}*/}
            {/*                  placeholder="Enter Asset contract or select Asset*/}
            {/*My Asset"*/}
            {/*                  onChange={e => {*/}
            {/*                    console.log('onChange', e.target.value)*/}
            {/*                    setTokenAddress(e.target.value)*/}
            {/*                  }}*/}
            {/*                />*/}
            {/*              </Box>*/}
            {/*            </FormItem>*/}
            <Box sx={{ position: 'relative' }}>
              <Button
                onClick={openModal}
                variant="contained"
                sx={{
                  padding: '12px 16px',
                  color: 'var(--ps-text-60)',
                  justifyContent: 'start',
                  height: '43px',
                  background: 'transparent',
                  width: '100%',
                  border: '1px solid var(--ps-text-20)',
                  borderRadius: '4px'
                }}
              >
                {tokenAddress.length === VALIDITY_ADDRESS_LENGTH ? tokenAddress : 'Select a token'}
              </Button>
              {/*              <InputStyle*/}
              {/*                value={tokenAddress}*/}
              {/*                placeholder="Enter Asset contract or select Asset*/}
              {/*My Asset"*/}
              {/*                onChange={e => {*/}
              {/*                  console.log('onChange', e.target.value)*/}
              {/*                  setTokenAddress(e.target.value)*/}
              {/*                }}*/}
              {/*              />*/}
            </Box>
          </Column>
          <Column>
            <Typography className="label">Initial LP Provision</Typography>
            {/*<FormItem name="lp">*/}
            {/*  <InputStyle*/}
            {/*    value={initAmount}*/}
            {/*    type="number"*/}
            {/*    placeholder="The value of the input amount must be greater than 2000"*/}
            {/*    onChange={e => {*/}
            {/*      console.log('set initAmount')*/}
            {/*      setInitAmount(e.target.value)*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</FormItem>*/}
            <InputStyle
              value={initAmount}
              type="number"
              placeholder="The value of the input amount must be greater than 2000"
              onChange={e => {
                console.log('set initAmount')
                setInitAmount(e.target.value)
              }}
            />
          </Column>

          <Button
            variant="contained"
            disabled={
              createButtonText !== ButtonText.DEPOSIT ||
              tokenAddress.length !== VALIDITY_ADDRESS_LENGTH ||
              new BigNumber(initAmount).isNaN() ||
              new BigNumber(initAmount).isLessThanOrEqualTo(2000)
            }
            onClick={async () => {
              if (approveState !== ApprovalState.APPROVED && tokenAddress.toLowerCase() !== WBB_ADDRESS) await approve()
              runWithModal().then(
                async () => await updateBoxPluginBitleverageDataCallback('add', { token0: tokenAddress })
              )
            }}
            sx={{
              height: 44,
              padding: '12px 24px',
              backgroundColor: 'var(--ps-text-100)',
              marginTop: '32px !important'
            }}
          >
            {createButtonText}
          </Button>
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ width: '1px', height: '100%', background: 'var(--ps-text-10)', marginLeft: 23.5 }}></Box>
        </Box>
        {!isLg && <Info />}
      </Box>
    </BaseDialog>
  )
}
const Info = () => {
  const isSm = useBreakpoint('sm')
  return (
    <Stack
      sx={{
        width: isSm ? 'auto' : 440,
        borderRadius: '12px',
        background: 'var(--ps-neutral2)',
        padding: '24px',
        gap: 24,
        '& p,& span': {
          color: 'var(--ps-neutral3)',
          fontSize: '15px',
          fontWeight: 400,
          lineHeight: '140%'
        },
        textAlign: 'left',
        '& .title1': {
          color: 'var(--ps-neutral4)'
        },
        '& .title2': {
          color: 'var(--ps-text-100)'
        },
        '& .p': {
          color: 'var(--ps-neutral3)'
        }
      }}
    >
      <Box>
        <Typography>
          <span className="title1">Step 1 </span>
          <span className="title2" style={{ marginLeft: 8 }}>
            Choose Target Market
          </span>
        </Typography>
        <Typography className="p" mt={8}>
          With BBTC as the underlying asset, different assets are used as investment products for perpetual option
          transactions. The asset selected by the pool you created now will be used as the transaction asset.
        </Typography>
      </Box>
      <Box>
        <Typography>
          <span className="title1">Step 2 </span>
          <span className="title2" style={{ marginLeft: 8 }}>
            Select Token Collateral
          </span>
        </Typography>
        <Typography className="p" mt={8}>
          Select the token you want to use as the actual settlement, and the transaction settlement will use the token
          for transaction settlement according to the set conversion ratio with BBTC.
        </Typography>
      </Box>
      <Box>
        <Typography>
          <span className="title1">Step 3 </span>
          <span className="title2" style={{ marginLeft: 8 }}>
            Initial LP Provision
          </span>
        </Typography>
        <Typography className="p" mt={8}>
          The assets you deposit will be part of the liquidity pool and receive fees from each trade placed on the
          platform in exchange for serving as the counterparty to all trades.
        </Typography>
      </Box>
    </Stack>
  )
}
export default CreateLiquidityDialog
