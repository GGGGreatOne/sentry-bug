import FormItem from 'components/FormItem'
import { FormLayout } from '../../comps'
import { globalDialogControl } from 'components/Dialog'
import { Currency } from 'constants/token'
import CurrencyLogo from 'components/essential/CurrencyLogo'
import { FormControl, Input, InputLabel, styled } from '@mui/material'
import { FormikErrors } from 'formik'
import { CreatePoolInfo } from 'plugins/auction/pages/erc20-create-pool/type'
import SelectTokenDialog from 'components/Dialog/selectTokenDialog'
import DownArrowWhite from 'assets/svg/auction/arrow-down-white.svg'

interface Props extends Partial<React.ComponentProps<typeof SelectTokenDialog>> {
  title: string
  name: string
  curToken: Currency | undefined
  onChange: (v: Currency) => void
  errors: FormikErrors<CreatePoolInfo>
}
const FormControlStyle = styled(FormControl)`
  border-radius: 0px;
  border: 1px solid var(--text-20, rgba(255, 255, 229, 0.2));
  .MuiFormLabel-root {
    left: 40px;
    top: 12px;
  }
`

const InputStyle = styled(Input)`
  &::before,
  &::after,
  &:hover:not(.Mui-disabled, .Mui-error):before {
    border: none;
  }
  & .MuiInputBase-input {
    position: relative;
    left: 54px;
    color: var(--text-100, #ffffe5);
    font-family: 'IBM Plex Sans';
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    padding-right: 110px;
  }
  & > img,
  & > .MuiSvgIcon-root {
    position: absolute;
    left: 20px !important;
    top: -50%;
    transform: translateY(50%);
  }
  & > svg {
    position: absolute;
    right: 16px;
    top: 1px;
  }
`
const FormSelectToken = ({ curToken, onChange, name, title, ...props }: Props) => {
  return (
    <FormLayout
      title1={title}
      childForm={
        <>
          <FormItem name={name} fieldType="custom">
            <FormControlStyle sx={{ padding: !curToken ? '10px 0' : '0' }}>
              {curToken && <InputLabel htmlFor="select-token">Select Token</InputLabel>}
              <InputStyle
                id="select-token"
                value={curToken?.symbol}
                placeholder="Select Token"
                sx={{
                  '& .MuiInputBase-input': {
                    left: curToken?.symbol ? '54px' : '16px'
                  },
                  '& > svg': {
                    top: curToken?.symbol ? '1px' : 'unset'
                  }
                }}
                startAdornment={curToken ? <CurrencyLogo currencyOrAddress={curToken} /> : <></>}
                endAdornment={<DownArrowWhite />}
                onClick={() =>
                  globalDialogControl.show('SelectTokenDialog', {
                    curSelectToken: curToken,
                    handleTokenSelection(c) {
                      onChange(c)
                    },
                    ...props
                  })
                }
              />
            </FormControlStyle>
          </FormItem>
        </>
      }
    />
  )
}
export default FormSelectToken
