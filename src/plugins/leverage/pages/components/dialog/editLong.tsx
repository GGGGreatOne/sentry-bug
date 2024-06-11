import BaseDialog from 'components/Dialog/baseDialog'
import { Tabs } from '../../tradePanel/chartTab'
import { useState } from 'react'
import InputPanel from '../InputPanel'
import { Button, Stack } from '@mui/material'
import { InfoPair } from '../../tradePanel/conductTrade'
const tabs = ['Deposit', 'Withdraw']
const EditLong = () => {
  const [tab, setTab] = useState(tabs[0])
  const [amount, setAmount] = useState('0')
  return (
    <BaseDialog title="Edit Long ETH" sx={{ '& .MuiDialog-paper': { minWidth: 450 } }}>
      <Tabs tabs={tabs} initTab={tab} setTab={v => setTab(v)} isLevel2 />
      <InputPanel label="Close" balance="10.95" token="USDT" amount={amount} changeAmount={v => setAmount(v)} />
      <Stack mt={16} sx={{ gap: 8 }}>
        <InfoPair fontSize="medium" label="Size" value={'$10.95'} />
        <InfoPair fontSize="medium" label="Collateral(DOGE)" value={'$9.9559'} />
        <InfoPair fontSize="medium" label="Leverage" value={'1.10x'} />
        <InfoPair fontSize="medium" label="Mark Price" value={'$25456.30'} />
        <InfoPair fontSize="medium" label="Lip. Price" value={'$663.11'} />
        <InfoPair fontSize="medium" label="Execution Fee" value={'0.002 DOGE'} />
      </Stack>
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
        Enter an amount
      </Button>
    </BaseDialog>
  )
}
export default EditLong
