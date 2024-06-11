import BaseDialog from 'components/Dialog/baseDialog'
import { Tabs } from '../../tradePanel/chartTab'
import { useState } from 'react'
import InputPanel from '../InputPanel'
import { Box, Button, Stack } from '@mui/material'
import { InfoPair } from '../../tradePanel/conductTrade'
const tabs = ['Deposit', 'Withdraw']
const EditLong = () => {
  const [tab, setTab] = useState(tabs[0])
  const [amount, setAmount] = useState('0')
  return (
    <BaseDialog title="Edit Long ETH" sx={{ '& .MuiDialog-paper': { minWidth: 450 } }}>
      <Tabs tabs={tabs} initTab={tab} setTab={v => setTab(v)} isLevel2 />
      <InputPanel label="Close" balance="10.95" token="B2B" amount={amount} changeAmount={v => setAmount(v)} />
      <Box mt={16}>
        <InfoPair fontSize="medium" label="Leverage" value={'43x'} />
        <Box my={32} sx={{ width: '100%', height: '1px', background: 'var(--ps-text-10)' }}></Box>
        <Stack mt={16} sx={{ gap: 8 }}>
          <InfoPair fontSize="medium" label="Entry Price" value={'$22456.30'} />
          <InfoPair fontSize="medium" label="Mark Price" value={'$22456.30'} />
          <InfoPair fontSize="medium" label="Liq. Price" value={'$22456.30'} />
        </Stack>
        <Box my={32} sx={{ width: '100%', height: '1px', background: 'var(--ps-text-10)' }}></Box>
        <Stack mt={16} sx={{ gap: 8 }}>
          <InfoPair fontSize="medium" link="http://localhost:3000/club/editBox" label="Size" value={'35 DOGE'} />
          <InfoPair fontSize="medium" label="Collateral" value={'335 DOGE(≈0.5BTC)'} />
          <InfoPair fontSize="medium" link="http://localhost:3000/club/editBox" label="Fees" value={'335 DOGE'} />
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
