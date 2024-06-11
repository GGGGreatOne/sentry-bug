import BaseDialog from 'components/Dialog/baseDialog'
import { globalDialogControl } from 'components/Dialog'
import { Box, Button, Stack, Typography, styled } from '@mui/material'
import FormItem from 'components/FormItem'
import { NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import { Formik } from 'formik'
import { useActiveWeb3React } from 'hooks'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useTokenMinter } from 'plugins/tokenToolBox/hook/useTokenMinter'
import { useCallback, useMemo } from 'react'
import { isAddress } from 'utils'
import Input from 'components/Input'
import { useIsSsr } from 'plugins/tokenToolBox/hook/useIsSsr'
import LoadingButton from '@mui/lab/LoadingButton'
import useBreakpoint from 'hooks/useBreakpoint'
import BigNumber from 'bignumber.js'
import { IBoxesJsonData } from 'state/boxes/type'

interface IMinter {
  chainId: number
  name: string
  symbol: string
  decimals: string
  initial_supply: string
}

interface Props {
  draftInfo?: IBoxesJsonData | null | undefined
  boxAddress: string
}
const TokenMinter = ({ draftInfo, boxAddress }: Props) => {
  const isMd = useBreakpoint('md')
  const { chainId, account } = useActiveWeb3React()
  const switchChain = useSwitchNetwork()
  const { toTokenMinter, submitted } = useTokenMinter(chainId as SupportedChainId, boxAddress)
  const showLoginModal = useCallback(() => {
    globalDialogControl.show('SignLoginDialog')
  }, [])

  const minter: IMinter = useMemo(() => {
    return {
      chainId: NETWORK_CHAIN_ID,
      name: '',
      symbol: '',
      decimals: '',
      initial_supply: ''
    }
  }, [])

  const onSubmit = async (value: IMinter) => {
    return toTokenMinter(
      value.name,
      value.symbol,
      value.decimals ? value.decimals.toString() : '',
      value.initial_supply
    )
  }

  const isSSR = useIsSsr()
  return (
    <BaseDialog minWidth={650} title={'Token minter'} onClose={() => {}}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Formik
          enableReinitialize
          initialValues={minter}
          onSubmit={onSubmit}
          validate={values => {
            const errors: any = {}

            if (!values.name || values.name.trim() === '') {
              errors.name = 'Name must have at least 1 character'
            }
            if (values.name.length > 100) {
              errors.name = 'Please enter a name with a maximum length of 100 characters.'
            }
            if (!values.symbol || values.name.trim() === '') {
              errors.symbol = 'Token symbol must have at least 1 character'
            }
            if (values.symbol.length > 100) {
              errors.symbol = 'Please enter a symbol with a maximum length of 100 characters.'
            }
            if (!values.initial_supply) {
              errors.initial_supply = 'Token supply must have at least 1 token'
            }
            if (!Number.isInteger(values.initial_supply)) {
              errors.initial_supply = 'Please enter integers only'
            }
            if (Number(values.decimals) < 1) {
              errors.decimals = 'Decimals can not less than 1'
            }

            return errors
          }}
        >
          {({ values, errors, setFieldValue, handleSubmit }) => {
            const decimalsSupply = new BigNumber(values.initial_supply || '0')
              .shiftedBy(Number(values.decimals) >= 1 ? Number(values.decimals) : 18)
              .toString()

            return (
              <Box component={'form'} onSubmit={handleSubmit}>
                <Stack gap={16}>
                  <FormItem name={'name'}>
                    <CusOutLineInput
                      value={values.name}
                      onChange={e => {
                        if (isAddress(e.target.value)) {
                          setFieldValue('name', e.target.value)
                        }
                      }}
                      placeholder={'Token name'}
                    />
                  </FormItem>
                  <FormItem name={'symbol'}>
                    <CusOutLineInput
                      value={values.symbol}
                      onChange={e => setFieldValue('symbol', e.target.value)}
                      placeholder={'Token symbol'}
                    />
                  </FormItem>
                  <Box>
                    <FormItem name={'initial_supply'}>
                      <CusOutLineInput
                        type={'number'}
                        style={{ width: '100%' }}
                        value={values.initial_supply}
                        onChange={e => setFieldValue('initial_supply', e.target.value)}
                        placeholder={'Total supply'}
                      />
                    </FormItem>
                    <Typography mt={8} fontSize={isMd ? 12 : 15} lineHeight={1.4} color={'var(--ps-neutral3)'}>
                      Total supply (excluding decimals, e.g. 100 tokens)
                    </Typography>
                  </Box>
                  <Box width={'100%'}>
                    <FormItem name={'decimals'}>
                      <CusOutLineInput
                        type={'number'}
                        value={values.decimals}
                        onChange={e => setFieldValue('decimals', e.target.value)}
                        placeholder={'Token decimal'}
                      />
                    </FormItem>
                    <Typography mt={8} fontSize={isMd ? 12 : 15} lineHeight={1.4} color={'var(--ps-neutral3)'}>
                      Token decimal (recommendation: 18)
                    </Typography>
                  </Box>
                  <Stack mt={8} gap={8}>
                    <Typography fontSize={isMd ? 12 : 15} lineHeight={1.4} color={'var(--ps-neutral3)'}>
                      Total supply (including decimals - raw amount)
                    </Typography>
                    <Typography fontSize={isMd ? 12 : 15} lineHeight={1.4} color={'var(--ps-tedt-100)'}>
                      {decimalsSupply !== '0' && decimalsSupply}
                    </Typography>
                  </Stack>
                </Stack>

                <Box mt={32}>
                  {!isSSR && account ? (
                    chainId !== values.chainId && values.chainId ? (
                      <Button
                        style={{ width: '100%' }}
                        className={'active'}
                        type={'button'}
                        onClick={() => switchChain(values.chainId)}
                      >
                        Switch Network
                      </Button>
                    ) : (
                      <LoadingButton
                        loading={submitted.pending}
                        variant="contained"
                        type={'submit'}
                        disabled={draftInfo?.listingStatus}
                        className={
                          errors.name || errors.symbol || errors.initial_supply || errors.decimals ? '' : 'active'
                        }
                        style={{
                          width: '100%'
                        }}
                      >
                        {draftInfo?.listingStatus ? 'On Sale' : 'Mint a new token'}
                      </LoadingButton>
                    )
                  ) : (
                    <Button style={{ width: '100%' }} className={'active'} type={'button'} onClick={showLoginModal}>
                      Connect wallet
                    </Button>
                  )}
                </Box>
              </Box>
            )
          }}
        </Formik>
      </Box>
    </BaseDialog>
  )
}

export const CusOutLineInput = styled(Input)`
  border: 1px solid var(--ps-text-20) !important;

  &.Mui-focused {
    border: 1px solid var(--ps-text-20) !important;
  }

  ${props => props.theme.breakpoints.down('md')} {
    padding: 0;
    &.MuiInputBase-input {
      padding: 0;
    }
  }
`

export default TokenMinter
