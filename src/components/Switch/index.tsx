import { styled } from '@mui/material/styles'
import MuiSwitch from '@mui/material/Switch'

const AntSwitch = styled(MuiSwitch)(({ theme }) => ({
  width: 40,
  height: 24,
  padding: 0,
  borderRadius: '60px',
  display: 'flex',
  alignItems: 'center',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 18
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(17px)'
    }
  },
  '& .MuiSwitch-switchBase': {
    padding: 3,
    '&.Mui-checked': {
      transform: 'translateX(17px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 18,
    height: 18,
    borderRadius: '50%',
    transition: theme.transitions.create(['width'], {
      duration: 200
    })
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? 'var(--ps-neutral3)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box'
  }
}))

export default function Switch({ value, onChange }: { value: boolean; onChange: () => void }) {
  const handleChange = (e: any) => {
    e.stopPropagation()
    onChange()
  }
  return <AntSwitch onClick={handleChange} value={value} inputProps={{ 'aria-label': 'ant design' }} />
}
