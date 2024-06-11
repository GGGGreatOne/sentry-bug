import BaseDialog from 'components/Dialog/baseDialog'
import { Tabs } from '../../tradePanel/chartTab'
import { useState } from 'react'
import InputPanel from '../InputPanel'
import { Box, Button, Stack, Switch, Typography, styled } from '@mui/material'
import { InfoPair } from '../../tradePanel/conductTrade'
const tabs = ['Deposit', 'Withdraw']
const SwitchStyle = styled(Switch)`
  & .MuiSwitch-switchBase {
    color: var(--ps-text-100);
  }
  & .MuiSwitch-track {
    background: var(--ps-text-10);
  }
  & .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    border-radius: 100px;
    background: var(--ps-text-10);
  }
`
const EditLong = () => {
  const [tab, setTab] = useState(tabs[0])
  const [amount, setAmount] = useState('0')
  return (
    <BaseDialog title="Close Long ETH" sx={{ '& .MuiDialog-paper': { minWidth: 450 } }}>
      <Tabs tabs={tabs} initTab={tab} setTab={v => setTab(v)} isLevel2 />
      <InputPanel label="Close" balance="10.95" token="B2B" amount={amount} changeAmount={v => setAmount(v)} />
      <Box mt={16}>
        <InfoPair fontSize="medium" label="Keep leverage at 1.10x" value={<SwitchStyle />} />
        <InfoPair fontSize="medium" label="Allowed Slippage" value={'0.03%'} />

        <Box my={32} sx={{ width: '100%', height: '1px', background: 'var(--ps-text-10)' }}></Box>
        <Stack mt={16} sx={{ gap: 8 }}>
          <InfoPair fontSize="medium" label="Entry Price" value={'$22456.30'} />
          <InfoPair fontSize="medium" label="Mark Price" value={'$22456.30'} />
          <InfoPair fontSize="medium" label="Liq. Price" value={'$22456.30'} />
        </Stack>
        <Box my={32} sx={{ width: '100%', height: '1px', background: 'var(--ps-text-10)' }}></Box>
        <Stack mt={16} sx={{ gap: 8 }}>
          <InfoPair fontSize="medium" label="Size" value={'$10.95'} />
          <InfoPair fontSize="medium" label="Collateral" value={'$9.9559'} />
          <InfoPair
            fontSize="medium"
            label="PnL"
            value={
              <Typography
                sx={{
                  color: 'var(--ps-green)',
                  fontFamily: '"SF Pro Display"',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '140%'
                }}
              >
                +$0.00(0.03%)
              </Typography>
            }
          />
          <InfoPair fontSize="medium" label="Fees" value={'$0.12'} />
          <InfoPair fontSize="medium" label="Receive" value={'0.0000 ETH / 0.0000DOGE ($0.00)'} />
        </Stack>
      </Box>

      <Button
        variant="contained"
        sx={{
          width: '100%',
          height: 44,
          padding: '12px 24px',
          marginTop: 32,
          background: 'var(--ps-text-100)',
          color: 'var(--ps-text-primary)',
          fontFamily: '"SF Pro Display"',
          fontSize: '15px',
          fontStyle: 'normal',
          fontWeight: '500',
          lineHeight: '100%'
        }}
      >
        {!Number(amount) ? 'Enter an amount' : `Min order：${amount} DOGE`}
      </Button>
    </BaseDialog>
  )
}
export default EditLong
