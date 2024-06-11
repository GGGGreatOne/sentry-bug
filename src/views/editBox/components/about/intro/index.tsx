import { Typography, styled, Box, Stack } from '@mui/material'
import EastIcon from '@mui/icons-material/East'
import SouthIcon from '@mui/icons-material/South'
import WestIcon from '@mui/icons-material/West'
import { IntroValueItem } from 'state/boxes/type'
const StepBox = styled(Typography)(() => ({
  background: 'var(--ps-neutral)',
  display: 'flex',
  padding: '32px 20px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 16
}))

const StepTip = styled(Typography)(({ theme }) => ({
  color: 'var(--ps-text-80)',
  fontWeight: 500,
  textAlign: 'center',
  fontSize: 15,
  lineHeight: '19.5px',
  [theme.breakpoints.down('md')]: {}
}))
const StepName = styled(Typography)(({ theme }) => ({
  color: 'var(--ps-text-100)',
  fontWeight: 700,
  textAlign: 'center',
  fontSize: 24,
  lineHeight: '33.6px',
  margin: '0 0 32px',
  [theme.breakpoints.down('md')]: {}
}))
const StepText = styled(Typography)(({ theme }) => ({
  color: 'var(--ps-text-60)',
  fontWeight: 400,
  textAlign: 'center',
  fontSize: 15,
  lineHeight: '21px',
  maxHeight: 42,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  [theme.breakpoints.down('md')]: {}
}))

const Intro = ({ data }: { data: IntroValueItem[] }) => {
  return (
    <Stack flexDirection={'column'} alignItems={data.length > 3 ? 'flex-end' : 'flex-start'}>
      <Stack
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={data.length > 3 ? 'flex-end' : 'flex-start'}
        gap={20}
      >
        {data.slice(0, 3).map((item, index) => {
          return (
            <Stack key={index} flexDirection={'row'} alignItems={'center'} gap={20}>
              <StepBox width={224}>
                <StepTip>Step{index + 1}</StepTip>
                <StepName>{item.name}</StepName>
                <StepText>{item.text}</StepText>
              </StepBox>
              {index + 1 < data.length && index !== 2 ? <EastIcon /> : <Box sx={{ width: 24, height: 24 }}></Box>}
            </Stack>
          )
        })}
      </Stack>
      {data.length > 3 && <SouthIcon sx={{ margin: '20px 143px 20px 0' }} />}
      {data.length > 3 && (
        <Stack flexDirection={'row-reverse'} alignItems={'center'} justifyContent={'flex-end'} gap={20}>
          {data.slice(3, data.length).map((item, index) => {
            return (
              <Stack key={index} flexDirection={'row'} alignItems={'center'} gap={20}>
                <StepBox width={224}>
                  <StepTip>Step{index + 4}</StepTip>
                  <StepName>{item.name}</StepName>
                  <StepText>{item.text}</StepText>
                </StepBox>
                {index !== 0 ? <WestIcon /> : <Box sx={{ width: 24, height: 24 }}></Box>}
              </Stack>
            )
          })}
        </Stack>
      )}
    </Stack>
  )
}

export default Intro
