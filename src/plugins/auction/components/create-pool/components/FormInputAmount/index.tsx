import { styled, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import FormItem from 'components/FormItem'
import { Currency } from 'constants/token'
import { useFormikContext, Field, FieldProps } from 'formik'
import { useActiveWeb3React } from 'hooks'
import { useCurrencyBalance } from 'hooks/useToken'
import FormNumberInput from 'plugins/auction/components/FormNumberInput'
import { useCallback, useMemo } from 'react'

export const OutlinedInput = styled(FormNumberInput)`
  &.MuiInputBase-root {
    color: rgba(230, 230, 206, 0.6);
    background-color: transparent !important;
    border-color: rgba(255, 255, 229, 0.2) !important;
    border-radius: 0px !important;
    &.Mui-focused {
      border-color: rgba(255, 255, 229, 0.2) !important;
    }
    & .MuiButtonBase-root {
      border: 1px solid rgba(255, 255, 229, 0.2);
    }
    & button ~ span {
      display: block;
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`
interface Props extends Omit<React.ComponentProps<typeof OutlinedInput>, 'name' | 'value' | 'onChange' | 'onBlur'> {
  name: string
  tokenField: string
}
const FormInputAmount = ({ name, tokenField, ...props }: Props) => {
  const { values, setFieldValue } = useFormikContext<any>()

  const tokenCurrency = useMemo(() => {
    return values[tokenField] as Currency | undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values[tokenField]?.address, tokenField])

  const amount = values[name]
  const { account, chainId } = useActiveWeb3React()
  const totalBalance = useCurrencyBalance(account, tokenCurrency, chainId)
  const handleMax = useCallback(() => {
    setFieldValue(name, totalBalance?.toExact())
  }, [name, setFieldValue, totalBalance])

  const validate = useCallback(
    (value: string) => {
      let errorMessage = ''
      if (new BigNumber(value).gt(new BigNumber(totalBalance?.toExact() || 0))) {
        errorMessage = 'The quantity cannot be greater than the balance'
      }
      return errorMessage
    },
    [totalBalance]
  )
  return (
    <>
      <FormItem name={name} fieldType="custom">
        <Field name={name} validate={validate}>
          {({ field }: FieldProps) => {
            return (
              <>
                <Typography sx={{ color: 'rgba(230, 230, 206, 0.60)', textAlign: 'right' }} variant="body2" pb={5}>
                  balance:{totalBalance?.toSignificant() || '--'}{' '}
                </Typography>
                <OutlinedInput
                  {...field}
                  onMax={handleMax}
                  unit={tokenCurrency ? tokenCurrency.symbol : ''}
                  placeholder="Enter  amount"
                  value={amount}
                  {...props}
                />
              </>
            )
          }}
        </Field>
      </FormItem>
    </>
  )
}
export default FormInputAmount
