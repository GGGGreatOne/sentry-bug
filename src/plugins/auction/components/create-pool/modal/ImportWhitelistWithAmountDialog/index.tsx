import { Form, Formik } from 'formik'
import { Box, FormHelperText, Stack, Typography, styled } from '@mui/material'
import DropZone from 'components/DropZone/DropZone'
import Papa from 'papaparse'
import BaseDialog from 'components/Dialog/baseDialog'
import { ToolBoxInput } from 'plugins/tokenToolBox/pages/components/tokenLockerForm'
import { formatInput } from 'plugins/auction/plugins/fixed-price/constants/utils'
import { NextBtnStyle } from '../../components/createSubmitBtn'
import auctionDialogControl from '..'
interface FormValues {
  whitelistWithAmount: string
}

export const ConfirmBox = styled(Box)`
  border-radius: 16px;
  margin-top: 32px;
  padding: 24px;
  background: var(--grey-06, #f6f6f3);
`
export const ConfirmDetailBox = styled(Box)`
  padding: 24px;
  border-radius: 16px;
  margin-top: 16px;
  background: var(--white-100, #fff);
`
export const BoxSpaceBetween = styled(Box)`
  display: flex;
  justify-content: space-between;
`
export const LineCom = styled(Box)(() => ({
  width: '100%',
  height: '1px',
  background: '#D4D6CF',
  margin: '24px 0'
}))
const isEqLength = (str1: string, str2: string[]) => {
  const s1 = str1
    .split('\n')
    .join('')
    .split('')
    .map(i => i.trim())
    .join('')
  const s2 = str2.join('')
  return s1 === s2
}

const ImportWhitelistWithAmountDialog = ({
  whitelistWithAmount,
  onSubmit
}: {
  whitelistWithAmount: string
  onSubmit: (value: string) => void
}) => {
  const handleResolve = (whitelistWithAmount: string) => {
    onSubmit(whitelistWithAmount)
    auctionDialogControl.hide('ImportWhitelistWithAmountDialog')
  }

  const initialValues: FormValues = {
    whitelistWithAmount: whitelistWithAmount
  }

  return (
    <BaseDialog
      title="Import whitelist with amount"
      minWidth={1000}
      sx={{
        '& .MuiDialog-paper': { backgroundColor: '#fff', width: 1000, margin: { xs: 16, md: 32 } },
        '& .MuiDialogTitle-root h3': {
          color: 'var(--black-100, #121212)',
          fontWeight: 600
        }
      }}
    >
      <Typography variant="h4" sx={{ fontSize: { xs: 14, md: 16 }, color: '#20201e' }}>
        Enter one address and amount per line.{' '}
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          handleResolve(values.whitelistWithAmount)
        }}
      >
        {({ values, setFieldValue, handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Box
                sx={{
                  width: '100%',
                  '& .MuiInputBase-root': { width: '100%', padding: 0, maxHeight: 250, overflow: 'auto' }
                }}
              >
                <ToolBoxInput
                  multiline={true}
                  sx={{
                    width: '100%',
                    minHeight: '200px',
                    marginTop: 20,
                    marginBottom: 12,
                    alignItems: 'flex-start',
                    backgroundColor: '#fff',
                    padding: 10,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid var(--ps-grey-04, #D7D6D9)',
                      borderColor: 'var(--ps-grey-04, #D7D6D9) !important'
                    }
                  }}
                  value={values.whitelistWithAmount}
                  onChange={event => {
                    setFieldValue('whitelistWithAmount', event.target.value)
                  }}
                />
                <DropZone
                  getFile={file => {
                    Papa.parse(file, {
                      skipEmptyLines: true,
                      complete: function (results: any) {
                        setFieldValue('whitelistWithAmount', results.data.join('\n').replaceAll(',', ' '))
                      }
                    })
                  }}
                />
              </Box>

              <ConfirmBox>
                <Typography sx={{ color: '#20201e' }}>Confirm</Typography>
                <ConfirmDetailBox sx={{ maxHeight: 250, overflow: 'auto' }}>
                  <BoxSpaceBetween>
                    <Typography sx={{ color: '#20201e' }}>Address</Typography>
                    <Typography sx={{ color: '#20201e' }}>Amount</Typography>
                  </BoxSpaceBetween>
                  <LineCom />
                  {values.whitelistWithAmount &&
                    formatInput(values.whitelistWithAmount)[2].map((v, idx) => {
                      return (
                        <BoxSpaceBetween
                          key={idx}
                          sx={{
                            alignItems: 'center'
                          }}
                        >
                          <Typography sx={{ color: '#20201e' }}>{v?.[0]}</Typography>
                          <Typography
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 250,
                              paddingLeft: 20,
                              color: '#20201e'
                            }}
                          >
                            {v?.[1]}
                          </Typography>
                        </BoxSpaceBetween>
                      )
                    })}
                </ConfirmDetailBox>
              </ConfirmBox>
              {!isEqLength(
                values.whitelistWithAmount,
                (formatInput(values.whitelistWithAmount)?.[2] as string[]).flat()
              ) && (
                <FormHelperText style={{ marginTop: 10, color: '#FA0E0E' }}>
                  Some invalid data has been filtered out
                </FormHelperText>
              )}
              <Stack justifyContent={'center'}>
                <NextBtnStyle
                  type="submit"
                  variant="contained"
                  sx={{ margin: '0 auto', width: '100%', maxWidth: 300, marginTop: 20 }}
                >
                  Submit
                </NextBtnStyle>
              </Stack>
            </Form>
          )
        }}
      </Formik>
    </BaseDialog>
  )
}

export default ImportWhitelistWithAmountDialog
