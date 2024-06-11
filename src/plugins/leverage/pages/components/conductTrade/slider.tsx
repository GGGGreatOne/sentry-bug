import { Box, Typography, Slider as MuiSlider, styled } from '@mui/material'
import { TRADE_MODE } from '../../tradePanel'

const marks = [
  { value: 2, label: '2x' },
  { value: 5, label: '5x' },
  { value: 10, label: '10x' },
  { value: 15, label: '15x' },
  { value: 20, label: '20x' },
  { value: 25, label: '25x' },
  { value: 30, label: '30x' },
  { value: 35, label: '35x' },
  { value: 40, label: '40x' },
  { value: 45, label: '45x' },
  { value: 50, label: '50x' }
]

const DegenMarks = [
  {
    value: 51,
    label: '51x'
  },
  {
    value: 65,
    label: '65x'
  },
  {
    value: 80,
    label: '80x'
  },
  {
    value: 95,
    label: '95x'
  },
  {
    value: 110,
    label: '110x'
  },
  {
    value: 125,
    label: '125x'
  },
  {
    value: 140,
    label: '140x'
  },
  {
    value: 155,
    label: '155x'
  },
  {
    value: 170,
    label: '170x'
  },
  {
    value: 185,
    label: '185x'
  },
  {
    value: 200,
    label: '200x'
  }
]
const SliderStyle = styled(MuiSlider)({
  '& .MuiSlider-rail': {
    backgroundColor: 'var(--ps-neutral3)',
    height: 2
  },
  '& .MuiSlider-track ': {
    backgroundColor: 'var(--ps-text-100)',
    height: 2
  },
  '& .MuiSlider-markLabel': {
    color: 'var(--ps-neutral3)',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '0.2px'
  },
  '& .MuiSlider-mark': {
    width: '2px',
    height: '6px',
    borderRadius: '2px',
    background: 'var(--ps-neutral3)'
  },
  '& .MuiSlider-markActive.MuiSlider-mark': {
    background: 'var(--ps-text-100)'
  },
  '& .MuiSlider-thumb': {
    width: '8.201px',
    height: '8px'
  }
})
const Slider = ({
  value,
  setValue,
  tradeMode
}: {
  value: number
  setValue: (v: number) => void
  tradeMode: TRADE_MODE
}) => {
  return (
    <Box sx={{ color: 'var(--ps-text-100)', fontSize: 13, fontWeight: 400, lineHeight: 1.4 }}>
      <Typography>Leverage slider</Typography>
      <Box>
        <SliderStyle
          value={value}
          onChange={(v: any) => {
            setValue(v.target.value)
          }}
          aria-label="Custom marks"
          defaultValue={tradeMode === TRADE_MODE.DEGEN ? 51 : 2}
          step={1}
          min={tradeMode === TRADE_MODE.DEGEN ? 51 : 2}
          max={tradeMode === TRADE_MODE.DEGEN ? 200 : 50}
          marks={tradeMode === TRADE_MODE.DEGEN ? DegenMarks : marks}
        />
      </Box>
    </Box>
  )
}
export default Slider
