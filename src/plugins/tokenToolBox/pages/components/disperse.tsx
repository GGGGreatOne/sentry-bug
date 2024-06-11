import BaseDialog from 'components/Dialog/baseDialog'
import { NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import { useActiveWeb3React } from 'hooks'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useETHBalance, useToken } from 'hooks/useToken'
import { DISPERSE_CONTRACT_ADDRESSES } from 'plugins/tokenToolBox/constants'
import { useDisperseEther, useDisperseToken } from 'plugins/tokenToolBox/hook/useDisperse'
import { useDisperseErc20TokenDetail } from 'plugins/tokenToolBox/hook/useTokenLocakCallback'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { Currency, CurrencyAmount } from 'constants/token'
import { isAddress } from 'utils'
import { Box, Input, Stack, Typography, styled } from '@mui/material'
import { Form, Formik } from 'formik'
import JSBI from 'jsbi'
import FormItem from 'components/FormItem'
import DropZone from 'components/DropZone/DropZone'
import Papa from 'papaparse'
import ConnectWalletButton from 'plugins/tokenToolBox/pages/components/ConnectWalletButton'
import SwitchNetworkButton from 'plugins/tokenToolBox/pages/components/SwitchNetworkButton'
import SelectToken, { useGetPairToken } from './SelectToken'
import Image from 'next/image'
import { LineCom, SectionItem } from './ComonComponents'
import { useIsSsr } from 'plugins/tokenToolBox/hook/useIsSsr'
import LoadingButton from '@mui/lab/LoadingButton'
// import { read, utils } from 'xlsx'
import useBreakpoint from 'hooks/useBreakpoint'
import BigNumber from 'bignumber.js'
import CurrencyLogo from 'components/essential/CurrencyLogo'

interface IDisperse {
  chainId: number
  type: string
  recipients: string
  tokenAddress: string
}

interface Props {
  disperseType: string
  token?: Currency
  urlChainParam: string
  boxAddress: string
  rKey: number
}

const RecipientItem = ({ lable, value }: { lable: string | undefined; value: ReactNode }) => {
  return (
    <Stack gap={8}>
      <Typography fontFamily={'IBM Plex Sans'} fontSize={12} color="var(--ps-neutral3)">
        {lable}
      </Typography>
      <Typography
        sx={{
          wordWrap: `break-word`
        }}
        fontFamily={'IBM Plex Sans'}
        fontSize={15}
        color="var(--ps-neutral4)"
      >
        {value}
      </Typography>
    </Stack>
  )
}

const Disperse = ({ disperseType, token, urlChainParam, boxAddress, rKey }: Props) => {
  const isMd = useBreakpoint('md')
  const isSSR = useIsSsr()
  const { chainId, account } = useActiveWeb3React()
  const [currentChain, setCurrentChain] = useState(Number(urlChainParam))
  const isCurrentChainEqualChainOfPool = useMemo(() => {
    return currentChain === Number(chainId)
  }, [chainId, currentChain])
  const myChainBalance = useETHBalance(account || undefined, chainId)

  const [checkToken, setCheckToken] = useState<Currency | undefined>()
  const [disperse, setDisperse] = useState<IDisperse>({
    chainId: Number(chainId as SupportedChainId),
    type: (disperseType as string) || 'chain',
    recipients: '',
    tokenAddress: checkToken?.address || ''
  })

  const { token0Address, token1Address } = useGetPairToken(checkToken?.address || '')
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  useEffect(() => {
    if (!token) {
      setCheckToken(undefined)
      return
    }
    setCheckToken(token)
  }, [token])

  useEffect(() => {
    if (!token) return
    setDisperse({
      chainId: Number(chainId as SupportedChainId),
      type: (disperseType as string) || 'chain',
      recipients: '',
      tokenAddress: token?.address || ''
    })
  }, [chainId, disperseType, token])

  const { tokenCurrency, balance } = useDisperseErc20TokenDetail(checkToken?.address || '', chainId || NETWORK_CHAIN_ID)

  const { disperseEther, submitted: etherSubmitted } = useDisperseEther(chainId as SupportedChainId, boxAddress)
  const { disperseToken, submitted: tokenSubmitted } = useDisperseToken(boxAddress)

  const [needApprove, setNeedApprove] = useState('0')
  const [approvalState, approveACallback] = useApproveCallback(
    balance ? CurrencyAmount.fromRawAmount(balance?.currency, needApprove) : undefined,
    DISPERSE_CONTRACT_ADDRESSES[chainId || NETWORK_CHAIN_ID],
    true
  )

  const toDisperseEther = useCallback(
    async (recipients: string[], values: string[]) => {
      if (myChainBalance) {
        const amount = values.reduce((sum, current) => {
          const cur = new BigNumber(sum)
          return cur.plus(current)
        }, new BigNumber('0'))
        return disperseEther(
          CurrencyAmount.fromAmount(myChainBalance.currency, amount.toString())?.raw.toString() || '',
          recipients,
          values.map(v => CurrencyAmount.fromAmount(myChainBalance?.currency, v)?.raw.toString() || '')
        )
      }
    },
    [disperseEther, myChainBalance]
  )

  const toDisperseToken = useCallback(
    async (token: string, recipients: string[], values: string[]) => {
      if (balance) {
        return disperseToken(
          token,
          recipients,
          values.map(v => CurrencyAmount.fromAmount(tokenCurrency, v)?.raw.toString() || '')
        )
      }
    },
    [balance, disperseToken, tokenCurrency]
  )

  const confirmBtn: {
    disabled?: boolean
    loading?: boolean
    text?: string
    run?: () => void
  } = useMemo(() => {
    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return {
          text: `Approving use of token...`,
          loading: true
        }
      }
      if (approvalState === ApprovalState.UNKNOWN) {
        return {
          text: 'Approve use of token',
          loading: true
        }
      }
      if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          text: `Approve use of token`,
          run: approveACallback
        }
      }
    }
    return {
      text: 'Approved'
    }
  }, [approvalState, approveACallback])

  function formatInput(input: string) {
    const regexNumber = /\b\d+(\.\d+)?\b/g
    return input
      .split('\n')
      .filter(v => v.length > 42)
      .filter(v => isAddress(v.substring(0, 42)))
      .filter(v => v.substring(42).match(regexNumber)) // contain number
      .map(v => [v.substring(0, 42), v.substring(42).match(regexNumber)?.[0]])
  }

  const onSubmit = useCallback(
    async (value: IDisperse) => {
      const recipients: string[] = []
      const amount: string[] = []

      formatInput(value.recipients).forEach(v => {
        if (!v[1] || v[1] === '0') return
        v[0] && recipients.push(v[0])
        v[1] && amount.push(v[1])
      })

      if (value.type == 'token') {
        await toDisperseToken(value.tokenAddress, recipients, amount)
        // setCheckToken(undefined)
      } else {
        toDisperseEther(recipients, amount)
      }
    },
    [toDisperseEther, toDisperseToken]
  )

  return (
    <BaseDialog
      minWidth={650}
      title={'Disperse'}
      onClose={() => {
        setCheckToken(undefined)
      }}
    >
      <Formik
        initialValues={disperse}
        onSubmit={onSubmit}
        key={rKey}

        // setValue={(value: any) => {
        //   if (disperse.tokenAddress) {
        //     return { ...value, disperse: checkToken?.address }
        //   }
        // }}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          console.log('🚀 ~ Disperse ~ values:', values, token, rKey)
          const currentBalance: CurrencyAmount = values.type == 'chain' ? myChainBalance : balance
          const amount = formatInput(values.recipients)
            .map(v => Number(v[1]))
            .reduce((sum, current) => sum + current, 0)
            .toFixed(10)
          const currencyAmount = CurrencyAmount.fromAmount(currentBalance?.currency, amount)
          const validAmount =
            currentBalance && currencyAmount && JSBI.lessThanOrEqual(currencyAmount.raw, currentBalance.raw)
          setNeedApprove(currencyAmount?.raw.toString() || '0')
          setCurrentChain(Number(values?.chainId))

          return (
            <Form onSubmit={handleSubmit}>
              <Stack gap={32}>
                <Stack flexDirection={'row'} gap={24}>
                  <Tab
                    type={'button'}
                    className={values.type == 'chain' ? 'active' : ''}
                    onClick={() => {
                      setFieldValue('type', 'chain')
                    }}
                  >
                    BB
                  </Tab>
                  <Tab
                    type={'button'}
                    className={values.type == 'token' ? 'active' : ''}
                    onClick={() => {
                      setFieldValue('type', 'token')
                    }}
                  >
                    ERC20
                  </Tab>
                </Stack>

                {values.type == 'token' && (
                  <FormItem name={'tokenAddress'}>
                    <SelectToken
                      onSelect={val => {
                        setFieldValue('tokenAddress', val?.address)
                      }}
                      checkToken={checkToken}
                      setCheckToken={setCheckToken}
                    />
                  </FormItem>
                )}

                <SectionItem label="You have">
                  <FormItem name={'balance'}>
                    <BalancaToolbox>
                      <Typography fontSize={isMd ? 15 : 16} color={'var(--ps-text-100)'} lineHeight={1.4}>
                        {currentBalance?.toFixed(6) || '-'}
                      </Typography>
                      {values.type == 'chain' && (
                        <Box display={'flex'} alignItems={'center'} gap={8}>
                          {myChainBalance?.currency?.logo && (
                            <Image src={myChainBalance?.currency?.logo || ''} width={28} height={28} alt="" />
                          )}
                          <Typography
                            fontSize={isMd ? 15 : 16}
                            color={'var(--ps-text-100)'}
                            fontFamily={'IBM Plex Sans'}
                          >
                            {myChainBalance?.currency?.symbol}
                          </Typography>
                        </Box>
                      )}
                      {values.type == 'token' && (
                        <Box display={'flex'} alignItems={'center'} gap={8}>
                          <CurrencyLogo currencyOrAddress={checkToken?.address} size={'28px'} />
                          <Typography
                            color={'var(--ps-text-100)'}
                            fontSize={isMd ? 15 : 16}
                            fontFamily={'IBM Plex Sans'}
                          >
                            {token0 ? `${token0?.symbol} / ${token1?.symbol}` : balance?.currency?.symbol || '--'}
                          </Typography>
                        </Box>
                      )}
                    </BalancaToolbox>
                  </FormItem>
                </SectionItem>

                <SectionItem label="Recipients and amounts">
                  <FormItem name={'Recipients'}>
                    <Stack gap={16}>
                      <Typography mt={-8} color={'var(--ps-grey-03)'} fontSize={isMd ? 15 : 16} lineHeight={1.4}>
                        Enter one recipient’s wallet address and the corresponding token amount in each line.
                      </Typography>
                      <Input
                        maxRows={10}
                        multiline={true}
                        sx={{
                          padding: '20px 24px',
                          color: 'var(--ps-text-100)',
                          minHeight: '200px',
                          alignItems: 'flex-start',
                          border: '1px solid var(--ps-text-20)',
                          fontSize: isMd ? '15px' : '16px',
                          borderRadius: '8px',
                          '&::after': {
                            display: 'none'
                          },
                          '&::before': {
                            display: 'none'
                          }
                        }}
                        value={values.recipients}
                        onChange={event => {
                          setFieldValue('recipients', event.target.value)
                        }}
                        placeholder={`0x9ce8cF8b818F8D996cCE32F123F96C8836a95174 3.141592\n0xb68b78d420F18BE8dE6EdBF3dD3d8d4f3B515552,2.7182\n0xEFcf1f9d55159bC9440127Ed7A81F11Cc71864Ff=1.41421
                        `}
                      />
                      <DropZone
                        accept={{
                          'text/csv': []
                          // 'application/vnd.ms-excel': [],
                          // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': []
                        }}
                        getFile={file => {
                          // const acceptedExcelTypes = [
                          //   'application/vnd.ms-excel',
                          //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                          // ]
                          const acceptedCsvTypes = ['text/csv']

                          // if (acceptedExcelTypes.includes(file.type)) {
                          //   const reader = new FileReader()
                          //   reader.onload = event => {
                          //     const data = event.target?.result
                          //     const workbook = read(data, { type: 'binary' })
                          //     const sheetName = workbook.SheetNames[0]
                          //     const sheet = workbook.Sheets[sheetName]
                          //     const jsonData = utils.sheet_to_json(sheet, { header: 'A' })
                          //     const entries = Object.values(jsonData).map((_: any) => {
                          //       return Object.values(_)
                          //     })
                          //     setFieldValue('recipients', entries.join('\n').replaceAll(',', ' '))
                          //   }
                          //   reader.readAsBinaryString(file)
                          //   return
                          // }

                          if (acceptedCsvTypes.includes(file.type)) {
                            Papa.parse(file, {
                              skipEmptyLines: true,
                              complete: function (results: any) {
                                setFieldValue('recipients', results.data.join('\n').replaceAll(',', ' '))
                              }
                            })
                          }
                        }}
                      />
                      <Typography
                        color={'var(--ps-neutral3)'}
                        fontSize={isMd ? 12 : 15}
                        lineHeight={1.4}
                        fontWeight={400}
                      >
                        We accept documents in the form of CSV. The document size limit is 10MB
                      </Typography>
                    </Stack>
                  </FormItem>
                </SectionItem>

                <SectionItem label="Confirm">
                  <Stack gap={16}>
                    {!isMd && (
                      <>
                        <Stack flexDirection={'row'} justifyContent={'space-between'}>
                          <Typography
                            color={'var(--ps-neutral3)'}
                            fontSize={12}
                            lineHeight={1.4}
                            fontFamily={'IBM Plex Sans'}
                          >
                            Address
                          </Typography>
                          <Typography
                            color={'var(--ps-neutral3)'}
                            fontSize={12}
                            lineHeight={1.4}
                            fontFamily={'IBM Plex Sans'}
                          >
                            Amount
                          </Typography>
                        </Stack>
                        {values.recipients && (
                          <Stack
                            sx={{
                              maxHeight: 200,
                              overflowY: 'scroll',
                              '::-webkit-scrollbar': {
                                width: 0,
                                display: 'none'
                              },
                              WebkitOverflowScrolling: 'touch',
                              '-ms-overflow-style': 'none',
                              'scrollbar-width': 'none'
                            }}
                            gap={16}
                          >
                            {formatInput(values.recipients).map((v, idx) => {
                              if (!v[1] || v[1] === '0') return
                              return (
                                <Stack justifyContent={'space-between'} flexDirection={'row'} key={idx}>
                                  <Typography
                                    color={'var(--ps-neutral4)'}
                                    fontSize={16}
                                    lineHeight={1}
                                    fontFamily={'IBM Plex Sans'}
                                  >
                                    {v[0]}
                                  </Typography>
                                  <Typography
                                    color={'var(--ps-text-100)'}
                                    fontSize={16}
                                    lineHeight={1}
                                    fontFamily={'IBM Plex Sans'}
                                  >
                                    {CurrencyAmount.fromAmount(currentBalance?.currency, v[1])?.toExact() || '--'}{' '}
                                    <>
                                      {values.type == 'chain' ? (
                                        currentBalance?.currency?.symbol || '--'
                                      ) : (
                                        <>
                                          {token0
                                            ? `${token0?.symbol} / ${token1?.symbol}`
                                            : currentBalance?.currency?.symbol || '--'}
                                        </>
                                      )}
                                    </>
                                  </Typography>
                                </Stack>
                              )
                            })}
                          </Stack>
                        )}
                        <LineCom />
                      </>
                    )}

                    {isMd && values.recipients && (
                      <Stack
                        sx={{
                          maxHeight: 200,
                          overflowY: 'scroll',
                          '::-webkit-scrollbar': {
                            width: 0,
                            display: 'none'
                          },
                          WebkitOverflowScrolling: 'touch',
                          '-ms-overflow-style': 'none',
                          'scrollbar-width': 'none'
                        }}
                      >
                        {formatInput(values.recipients).map((v, idx) => {
                          if (!v[1] || v[1] === '0') return
                          return (
                            <Stack gap={12} key={idx}>
                              <RecipientItem lable={'Address'} value={v[0]} />
                              <RecipientItem
                                lable={'Amount'}
                                value={
                                  <>
                                    {CurrencyAmount.fromAmount(currentBalance?.currency, v[1])?.toExact() || '--'}{' '}
                                    {values.type == 'chain' ? (
                                      <>{currentBalance?.currency?.symbol || '--'}</>
                                    ) : (
                                      <>
                                        {token0
                                          ? `${token0?.symbol} / ${token1?.symbol}`
                                          : currentBalance?.currency?.symbol || '--'}
                                      </>
                                    )}
                                  </>
                                }
                              />
                              <MdLine />
                            </Stack>
                          )
                        })}
                      </Stack>
                    )}

                    <Stack
                      mt={isMd ? (values.recipients.length <= 1 ? 16 : 16) : -16}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                    >
                      <Typography
                        color={'var(--ps-neutral4)'}
                        fontSize={isMd ? 15 : 16}
                        lineHeight={1}
                        fontFamily={'IBM Plex Sans'}
                      >
                        Total
                      </Typography>
                      <Box display={'flex'} gap={8}>
                        <Typography
                          color={'var(--ps-text-100)'}
                          fontSize={isMd ? 15 : 16}
                          lineHeight={1}
                          fontFamily={'IBM Plex Sans'}
                        >
                          {currencyAmount?.toExact()}
                        </Typography>
                        <Typography
                          color={'var(--ps-text-100)'}
                          fontSize={isMd ? 15 : 16}
                          lineHeight={1}
                          fontFamily={'IBM Plex Sans'}
                        >
                          {values.type == 'chain' ? (
                            currentBalance?.currency?.symbol || '--'
                          ) : (
                            <>
                              {token0
                                ? `${token0?.symbol} / ${token1?.symbol}`
                                : currentBalance?.currency?.symbol || '--'}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack flexDirection={'row'} justifyContent={'space-between'}>
                      <Typography
                        color={'var(--ps-neutral4)'}
                        fontSize={isMd ? 15 : 16}
                        lineHeight={1}
                        fontFamily={'IBM Plex Sans'}
                      >
                        Remaining
                      </Typography>
                      <Box display={'flex'} gap={8}>
                        {validAmount ? (
                          <Typography
                            color={'var(--ps-text-100)'}
                            fontSize={isMd ? 15 : 16}
                            lineHeight={1}
                            fontFamily={'IBM Plex Sans'}
                          >
                            {currentBalance.subtract(currencyAmount).toFixed(6)}
                          </Typography>
                        ) : currencyAmount ? (
                          <Typography fontSize={isMd ? 15 : 16} color={'#FD3333'}>{`-${currencyAmount
                            ?.subtract(currentBalance)
                            .toFixed(6)}`}</Typography>
                        ) : (
                          ''
                        )}
                        <Typography
                          color={'var(--ps-text-100)'}
                          fontSize={isMd ? 15 : 16}
                          lineHeight={1}
                          fontFamily={'IBM Plex Sans'}
                        >
                          {values.type == 'chain' ? (
                            currentBalance?.currency?.symbol || '--'
                          ) : (
                            <>
                              {token0
                                ? `${token0?.symbol} / ${token1?.symbol}`
                                : currentBalance?.currency?.symbol || '--'}
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </SectionItem>
                {!isSSR && (
                  <>
                    {!account && <ConnectWalletButton />}
                    {account && values.type === 'chain' && !isCurrentChainEqualChainOfPool && (
                      <SwitchNetworkButton targetChain={Number(currentChain) || 0} />
                    )}
                    {account && (
                      <Stack flexDirection={isMd ? 'column' : 'row'} gap={16}>
                        {values.type == 'token' && approvalState != ApprovalState.APPROVED && values.tokenAddress && (
                          <LoadingButton
                            loadingPosition="start"
                            loading={confirmBtn.loading}
                            sx={{ width: '100%' }}
                            variant="outlined"
                            type="button"
                            onClick={confirmBtn.run}
                          >
                            {confirmBtn.text}
                          </LoadingButton>
                        )}
                        <LoadingButton
                          sx={{ width: '100%' }}
                          variant="contained"
                          type="submit"
                          loading={etherSubmitted.pending || tokenSubmitted.pending}
                          disabled={
                            !validAmount ||
                            formatInput(values.recipients).length === 0 ||
                            (values.type === 'chain' && !isCurrentChainEqualChainOfPool) ||
                            (values.type === 'token' && approvalState !== ApprovalState.APPROVED)
                          }
                        >
                          {formatInput(values.recipients).length > 0
                            ? values.tokenAddress || values.type === 'chain'
                              ? validAmount
                                ? 'Disperse' + (values.type == 'token' ? ' token' : '')
                                : amount
                                  ? 'Disperse' + (values.type == 'token' ? ' token' : '')
                                  : 'Insufficient balance'
                              : values.type === 'chain'
                                ? 'Disperse'
                                : 'Please input token address'
                            : 'Please input recipients and amounts'}
                        </LoadingButton>
                      </Stack>
                    )}
                  </>
                )}
              </Stack>
            </Form>
          )
        }}
      </Formik>
    </BaseDialog>
  )
}

const BalancaToolbox = styled(Box)`
  width: max-content;
  display: flex;
  justify-content: space-between;
  height: 44px;
  padding: 14px 16px;
  align-items: center;
  border-radius: 4px;
  background: var(--ps-text-10);
`

const SolidBtn = styled(`button`)`
  display: flex;
  padding: 20px 40px;
  justify-content: center;
  align-items: center;
  flex: 1;
  cursor: pointer;
  border-radius: 8px;
  /* background: var(--gray-04, #d7d6d9); */
  border: transparent;

  &.hover {
    cursor: pointer;
  }

  &.active {
    border-radius: 8px;
    background: var(--ps-text-100);
    color: var(--ps-text-primary);
  }
`

const Tab = styled(SolidBtn)`
  padding: 10px 20px;
`
const MdLine = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: var(--ps-text-10);
  margin: 4px 0 16px;
`
export default Disperse
