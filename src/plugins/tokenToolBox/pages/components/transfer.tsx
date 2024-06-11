import { Button, Stack } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import { useMemo, useState } from 'react'
// import { viewControl } from 'views/editBox/modal'
import Input from 'components/Input'
import { useToken } from 'hooks/useToken'
import { isAddress } from 'utils'
import { SectionItem } from './ComonComponents'
import { Form, Formik, FormikErrors } from 'formik'
import * as yup from 'yup'
import FormItem from 'components/FormItem'
import { useActiveWeb3React } from 'hooks'
import ConnectWalletButton from './ConnectWalletButton'
import { NETWORK_CHAIN_ID, SupportedChainId } from 'constants/chains'
import SwitchNetworkButton from './SwitchNetworkButton'
import { CurrencyAmount } from 'constants/token'
import JSBI from 'jsbi'
import { useTransfer, useTransferErc20TokenDetail } from 'plugins/tokenToolBox/hook/useTokenTransfer'
import { viewControl } from 'views/editBox/modal'

interface Props {
  tokenAddr: string
}

interface Itransfer {
  amount: string
  address: string
}
const Block = ({
  tokenAddr,
  formValues,
  errors
}: {
  tokenAddr: string
  formValues: Itransfer
  errors: FormikErrors<Itransfer>
}) => {
  console.log('🚀 ~ formValues:', formValues)
  const { chainId, account } = useActiveWeb3React()
  const isCurrentChainEqualChainOfPool = useMemo(() => {
    return NETWORK_CHAIN_ID === chainId
  }, [chainId])

  const { tokenCurrency, balance } = useTransferErc20TokenDetail(
    tokenAddr as string,
    chainId || SupportedChainId.SEPOLIA
  )

  const currencyAmount = CurrencyAmount.fromAmount(tokenCurrency, formValues.amount)

  const validAmount = useMemo(() => {
    return balance && currencyAmount && JSBI.lessThanOrEqual(currencyAmount.raw, balance.raw)
  }, [balance, currencyAmount])

  if (!account) {
    return <ConnectWalletButton />
  }
  if (!isCurrentChainEqualChainOfPool) {
    return <SwitchNetworkButton targetChain={NETWORK_CHAIN_ID} />
  }

  return (
    <Stack width={'min-contend'} flexDirection={'row'} gap={16} alignSelf={'end'}>
      <Button variant="outlined" onClick={() => viewControl.hide('Transfer')}>
        Cancel
      </Button>
      <Button disabled={JSON.stringify(errors) !== '{}' || !validAmount} variant="contained" type="submit">
        {validAmount ? 'Transfer' : formValues.amount ? 'Insufficient balance' : 'Transfer'}
      </Button>
    </Stack>
  )
}

const Transfer = ({ tokenAddr }: Props) => {
  const token = useToken(tokenAddr)

  const initialValues = {
    amount: '',
    address: ''
  }
  const [amount, setAmount] = useState('')
  const currencyAmount = useMemo(() => {
    return token ? CurrencyAmount.fromAmount(token, amount)?.raw.toString() : undefined
  }, [amount, token])

  const { runWithModal } = useTransfer(tokenAddr)
  const onSubmit = (value: Itransfer) => {
    if (!currencyAmount) return
    runWithModal({ to: value.address, amount: currencyAmount })
  }

  const sellerValidationSchema = yup.object({
    address: yup
      .string()
      .required('Address is a required')
      .test('is-address', 'Please input a valid address', value => {
        return !!isAddress(value || '')
      }),
    amount: yup.number().typeError('Please input valid number').required('Amount is a required')
  })

  return (
    <BaseDialog title={`Transfer ${token?.symbol}`} onClose={() => {}}>
      <Formik initialValues={initialValues} validationSchema={sellerValidationSchema} onSubmit={onSubmit}>
        {({ values, handleSubmit, errors }) => {
          console.log('🚀 ~ Transfer ~ values:', values)
          setAmount(values.amount)
          // setFieldValue('currencyAmount', token ? CurrencyAmount.fromAmount(token, values.amount) : '')
          // setFieldValue('currencyAmount', token ? CurrencyAmount.fromAmount(token, values.amount)?.raw.toString() : '')
          return (
            <Form onSubmit={handleSubmit}>
              <Stack flexDirection={'column'} alignItems={'center'} gap={24}>
                <SectionItem label="Amount">
                  <FormItem onChange={() => {}} name="amount">
                    <Input type="unumber" value={values.amount}></Input>
                  </FormItem>
                </SectionItem>

                <SectionItem label="Address">
                  <FormItem name="address">
                    <Input value={values.address}></Input>
                  </FormItem>
                </SectionItem>

                <Block tokenAddr={tokenAddr} formValues={values} errors={errors} />
              </Stack>
            </Form>
          )
        }}
      </Formik>
    </BaseDialog>
  )
}

export default Transfer
