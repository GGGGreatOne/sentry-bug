import { Button, FormControlLabel, Stack, Switch, SwitchProps, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Upload from 'components/Upload'
import BTCIcon from 'assets/svg/boxes/btc.svg'
import Input from 'components/Input'
import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import FormItem from 'components/FormItem'
import { useCreateStablecoin } from 'hooks/useCreateStablecoinCallback'
import { viewControl } from '../modal'
import { toast } from 'react-toastify'
import { upload } from 'api/common'
import { useUserInfo } from 'state/user/hooks'
import CurrencyLogo from 'components/essential/CurrencyLogo'

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? 'var(--ps-neutral3)' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 13,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

export default function CreateStableCoin({
  selectedStablecoin,
  setSelectedStablecoin,
  setBoxAddress,
  setStablecoinName,
  boxId,
  boxContractAddr,
  troveFactoryAddr,
  cb
}: {
  selectedStablecoin: any
  setSelectedStablecoin: Dispatch<SetStateAction<any>>
  setBoxAddress: Dispatch<SetStateAction<string | undefined>>
  setStablecoinName: Dispatch<SetStateAction<string>>
  boxId: string | number
  boxContractAddr?: string
  troveFactoryAddr: string
  cb: () => void
}) {
  const userInfo = useUserInfo()
  const { runWithModal: create } = useCreateStablecoin(troveFactoryAddr, cb, boxContractAddr)

  const validationSchema = yup.object({
    logo: yup
      .string()
      .nullable(true)
      .when('isCustomize', {
        is: true,
        then: yup.string().required('Please select your stablecoin logo')
      }),
    stablecoinName: yup
      .string()
      .nullable(true)
      .when('isCustomize', {
        is: true,
        then: yup
          .string()
          .min(2)
          .max(10)
          .matches(/^[a-zA-Z0-9s]+$/, 'Name should only contain letters, numbers, and spaces')
          .required('Please enter your stablecoin name')
      }),
    isCustomize: yup.boolean().required('Please select your stablecoin status'),
    borrowFee: yup.number().min(0).max(100).required('Please enter your correct borrowing fee')
  })

  const initialValues = {
    logo: '',
    stablecoinName: '',
    isCustomize: true,
    borrowFee: '0.5'
  }

  const handleSubmit = useCallback(
    async (values: any) => {
      let args: any[] = []
      if (values.isCustomize) {
        args = [values.stablecoinName, values.stablecoinName, values.logo]
        setSelectedStablecoin(undefined)
        await create(args)
        setBoxAddress('')
      }
      if (!values.isCustomize && selectedStablecoin) {
        args = [selectedStablecoin.token0Symbol, selectedStablecoin.token0Name, '']
        await create(args)
        setBoxAddress(selectedStablecoin.boxAddress)
      }
    },
    [create, selectedStablecoin, setBoxAddress, setSelectedStablecoin]
  )

  useEffect(() => {
    if (!userInfo.token) {
      viewControl.hide('CreateStablecoin')
    }
  }, [userInfo.token])

  return (
    <BaseDialog title="Create Stablecoin">
      <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => {
          return (
            <Stack component={Form} spacing={16}>
              <Stack>
                <Typography textAlign={'left'}>Collateral Asset</Typography>
                <Stack
                  direction={'row'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  p={16}
                  spacing={10}
                  mt={10}
                  sx={{
                    border: '1px solid #FFFFFF33',
                    borderRadius: '4px'
                  }}
                >
                  <BTCIcon />
                  <Typography fontSize={16}>BBTC</Typography>
                </Stack>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography fontSize={20} fontWeight={500} textAlign={'left'}>
                  {values.isCustomize ? 'Stablecoin Logo' : 'Stablecoin Selection'}
                </Typography>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      value={values.isCustomize}
                      defaultChecked
                      onChange={e => {
                        setFieldValue('isCustomize', e.target.checked)
                      }}
                    />
                  }
                  label="&nbsp;&nbsp;Customize"
                ></FormControlLabel>
              </Stack>
              {values.isCustomize && (
                <Stack spacing={6} mt={20}>
                  <Typography
                    textAlign={'left'}
                    fontSize={12}
                    color={'#FFFFFF99'}
                  >{`(JPEG, PNG, WEBP Files, Size < 2M)`}</Typography>
                </Stack>
              )}
              {!values.isCustomize && (
                <Stack
                  direction={'row'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  p={16}
                  spacing={10}
                  mt={10}
                  onClick={() => {
                    viewControl.show('SelectTokenModal', {
                      setSelectedStablecoin,
                      boxId
                    })
                  }}
                  sx={{
                    cursor: 'pointer',
                    border: '1px solid #FFFFFF33',
                    borderRadius: '4px'
                  }}
                >
                  {selectedStablecoin ? (
                    <CurrencyLogo currencyOrAddress={selectedStablecoin.token0Contract || ''} />
                  ) : (
                    <></>
                  )}
                  <Typography fontSize={16}>
                    {selectedStablecoin ? selectedStablecoin.token0Symbol?.toLocaleUpperCase() : 'Click to select'}
                  </Typography>
                </Stack>
              )}
              {values.isCustomize && (
                <>
                  <FormItem name="logo" fieldType="custom">
                    <Upload
                      styles={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%'
                      }}
                      isImgAlignCenter={false}
                      onDelete={() => {
                        setSelectedStablecoin(undefined)
                      }}
                      onSuccess={async ({ file }) => {
                        try {
                          const uploadRes = await upload({
                            file
                          })
                          if (uploadRes.code === 200) {
                            setFieldValue('logo', uploadRes.data?.url)
                            return
                          }
                          if (uploadRes.code === 401) {
                            toast.error('Sorry, you do not have permission.')
                            return
                          }
                        } catch (error) {}
                      }}
                      file={values.logo}
                    >
                      <Stack>
                        <Button
                          variant="contained"
                          sx={{
                            width: 133,
                            height: 44,
                            fontSize: 15,
                            fontWeight: 500,
                            textAlign: 'left',
                            marginRight: 'auto!important'
                          }}
                        >
                          + Add file
                        </Button>
                      </Stack>
                    </Upload>
                  </FormItem>
                  <FormItem name="stablecoinName" fieldType="custom">
                    <Stack mt={10} spacing={10}>
                      <Typography textAlign={'left'} fontSize={20} fontWeight={500}>
                        Stablecoin Name
                      </Typography>
                      <Input
                        value={values.stablecoinName}
                        backgroundColor="transparent"
                        hasBorder
                        outlined
                        placeholder="Name of Stablecoin"
                        onChange={e => {
                          setFieldValue('stablecoinName', e.target.value)
                          setStablecoinName(e.target.value)
                        }}
                      />
                    </Stack>
                  </FormItem>
                </>
              )}
              <Stack
                mt={20}
                sx={{
                  width: '100%',
                  border: '0.5px solid #FFFFFF33'
                }}
              />
              <Stack
                spacing={10}
                mt={20}
                sx={{
                  background: 'var(--ps-neutral2)',
                  borderRadius: '12px',
                  padding: 24
                }}
              >
                <Stack direction={'column'} spacing={20} justifyContent={'flex-start'}>
                  <Typography>Borrowing Fee</Typography>
                  <Typography>0.50%</Typography>
                </Stack>
              </Stack>
              <Button sx={{ marginTop: 32, width: '100%', height: 44 }} variant="contained" type="submit">
                Create
              </Button>
            </Stack>
          )
        }}
      </Formik>
    </BaseDialog>
  )
}
