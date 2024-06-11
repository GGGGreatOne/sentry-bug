import { Button, FormControlLabel, Stack, Switch, SwitchProps, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import BTCIcon from 'assets/svg/boxes/btc.svg'
import PlusIcon from 'assets/svg/boxes/plus.svg'
import SubtractIcon from 'assets/svg/boxes/subtract.svg'
import InputNumerical from 'components/Input/InputNumerical'
import { useState } from 'react'

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
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500
    })
  }
}))

const CreateStakingStableCoinPool = () => {
  const [borrowRate, setBorrowRate] = useState('0.5')
  const [apr, setApr] = useState('')
  return (
    <BaseDialog title="Create Staking Pool">
      <Stack>
        <Typography textAlign={'left'} fontSize={20} fontWeight={500}>
          Staking Asset Selection
        </Typography>
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
          <Typography fontSize={16}>BTC</Typography>
        </Stack>
      </Stack>
      <Stack mt={20}>
        <Typography textAlign={'left'} fontSize={20} fontWeight={500}>
          Rewarding Asset Selection
        </Typography>
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
          <Typography fontSize={16}>BTC</Typography>
        </Stack>
      </Stack>
      <Stack mt={20} spacing={10}>
        <Typography textAlign={'left'} fontSize={20} fontWeight={500}>
          APR Setting
        </Typography>
        <InputNumerical
          value={apr}
          backgroundColor="transparent"
          hasBorder
          outlined
          onChange={e => setApr(e.target.value)}
          placeholder="0.0"
        />
      </Stack>
      <Stack
        mt={20}
        sx={{
          width: '100%',
          border: '0.5px solid #FFFFFF33'
        }}
      ></Stack>
      <Stack
        spacing={10}
        mt={20}
        sx={{
          background: 'var(--ps-neutral2)',
          borderRadius: '12px',
          padding: 24
        }}
      >
        <Stack direction={'row'} spacing={50} justifyContent={'flex-start'}>
          <Typography>Liquidation Gain Reward Rate</Typography>
          <FormControlLabel control={<IOSSwitch defaultChecked />} label=" Active"></FormControlLabel>
        </Stack>
        <Typography textAlign={'left'}>
          The Liquidation Gain Reward rate can be manually adjusted after the pool is created. After this switch is
          turned off, it cannot be turned on again
        </Typography>
        <Stack
          direction={'row'}
          spacing={20}
          justifyContent={'flex-start'}
          alignItems={'center'}
          sx={{
            padding: '0 20px 0 0',
            border: '1px solid #FFFFFF33',
            borderRadius: '4px'
          }}
        >
          <InputNumerical
            backgroundColor="transparent"
            value={borrowRate}
            hasBorder={false}
            fontSize={20}
            onChange={e => setBorrowRate(e.target.value)}
          />
          <>
            <Stack
              direction={'column'}
              spacing={5}
              sx={{
                '& svg': {
                  cursor: 'pointer'
                }
              }}
            >
              <PlusIcon
                onClick={() => {
                  if (Number(borrowRate) < 100) {
                    setBorrowRate((parseFloat(borrowRate) + 0.1).toFixed(1))
                  }
                }}
              />
              <SubtractIcon
                onClick={() => {
                  if (Number(borrowRate) > 0) {
                    setBorrowRate((parseFloat(borrowRate) - 0.1).toFixed(1))
                  }
                }}
              />
            </Stack>
            <Typography fontSize={20} fontWeight={500}>
              %
            </Typography>
          </>
        </Stack>
      </Stack>
      <Button sx={{ marginTop: 32, width: '100%', height: 44 }} variant="contained">
        Create
      </Button>
    </BaseDialog>
  )
}

export default CreateStakingStableCoinPool
