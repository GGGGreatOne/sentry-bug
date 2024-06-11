import { Box, Stack, Typography, styled } from '@mui/material'
import React from 'react'
import { TooltipRenderProps } from 'react-joyride'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
const ButtonBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#333333',
  borderRadius: '50%',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(51 , 51 , 51, .8)'
  }
}))
interface CustomTooltipProps extends TooltipRenderProps {
  totalSteps: number
  setStepIndex: (e: number) => void
  handleSkip?: (e: boolean) => void
  isMd: boolean
  showStart?: boolean
  setFirstWeb?: () => void
}

const getStepWidth = (total: number, isMd: boolean) => {
  if (total < 5) {
    return isMd ? 55 : 64
  }
  return isMd ? (window.innerWidth - 104 - (total - 1) * 12) / total : (292 - (total - 1) * 12) / total
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  index,
  step,
  // backProps,
  // closeProps,
  // primaryProps,
  showStart,
  skipProps,
  totalSteps,
  setStepIndex,
  handleSkip,
  isMd,
  setFirstWeb
}) => (
  <Box
    sx={{
      background: 'linear-gradient(89.82deg, #FF2626 30.81%, #FF9314 46.29%, #C369FF 67.28%, #7270FF 83.86%)',
      padding: 2,
      borderRadius: 16
    }}
  >
    <Box
      sx={{
        background: 'var(--ps-neutral)',
        padding: isMd ? '30px 30px 20px' : 30,
        width: isMd ? 'calc(100vw - 40px)' : 533,
        borderRadius: 16,
        position: 'relative'
      }}
    >
      <Typography
        variant={isMd ? 'h5' : 'h4'}
        sx={{
          fontWeight: 500,
          lineHeight: isMd ? '19.5px' : '26px'
        }}
      >
        {index + 1}/{totalSteps} {step.title}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          position: 'absolute',
          fontWeight: 400,
          color: 'var(--ps-text-80)',
          lineHeight: '18.2px',
          cursor: 'pointer',
          top: isMd ? 'none' : 35,
          bottom: isMd ? 32 : 'none',
          right: 30
        }}
        onClick={e => {
          skipProps.onClick(e)
          handleSkip && handleSkip(false)
          setFirstWeb && setFirstWeb()
        }}
      >
        Skip
      </Typography>
      <Box
        sx={{
          margin: '30px 0',
          fontWeight: 400,
          color: 'var(--ps-text-80)',
          lineHeight: isMd ? '16.8px' : '18.2px',
          fontSize: isMd ? 12 : 13
        }}
      >
        {step.content}
      </Box>
      <Stack
        flexDirection={isMd ? 'column' : 'row'}
        alignItems={isMd ? 'flex-start' : 'center'}
        justifyContent={'space-between'}
      >
        <Stack flexDirection={'row'} alignItems={'center'} gap={12}>
          {Array(totalSteps)
            .fill(0)
            .map((item, i) => {
              return (
                <Box
                  key={item + i}
                  width={getStepWidth(totalSteps || 0, isMd)}
                  height={4}
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 4,
                    background: i === index ? '#ffffff' : '#333333',
                    ':hover': {
                      background: i === index ? 'rgba(255 , 255 , 255, .8)' : 'rgba(51 , 51 , 51, .8)'
                    }
                  }}
                  onClick={() => {
                    setStepIndex && setStepIndex(i)
                  }}
                ></Box>
              )
            })}
        </Stack>
        <Stack flexDirection={'row'} alignItems={'center'} gap={16} marginTop={isMd ? 24 : 0}>
          <ButtonBox
            sx={{
              width: isMd ? 24 : 36,
              height: isMd ? 24 : 36,
              cursor: index > 0 ? 'pointer' : 'not-allowed'
            }}
            onClick={() => {
              if (index > 0) setStepIndex(index - 1)
            }}
          >
            <ArrowBackIosNewIcon
              sx={{
                width: isMd ? 12 : 20,
                height: isMd ? 12 : 20,
                color: index > 0 ? 'var(--ps-text-100)' : 'var(--ps-text-40)'
              }}
            />
          </ButtonBox>
          {index + 1 < totalSteps && (
            <ButtonBox
              sx={{
                width: isMd ? 24 : 36,
                height: isMd ? 24 : 36
              }}
              onClick={() => {
                setStepIndex(index + 1)
              }}
            >
              <ArrowForwardIosIcon sx={{ width: isMd ? 12 : 20, height: isMd ? 12 : 20 }} />
            </ButtonBox>
          )}
          {index + 1 === totalSteps &&
            (showStart ? (
              <ButtonBox
                sx={{
                  width: 72,
                  height: isMd ? 24 : 36,
                  borderRadius: '50px'
                }}
                onClick={e => {
                  skipProps.onClick(e)
                  handleSkip && handleSkip(false)
                  setFirstWeb && setFirstWeb()
                }}
              >
                Start
              </ButtonBox>
            ) : (
              <ButtonBox
                sx={{
                  cursor: 'pointer',
                  width: isMd ? 24 : 36,
                  height: isMd ? 24 : 36
                }}
                onClick={() => {
                  setStepIndex(index + 1)
                  handleSkip && handleSkip(false)
                  setFirstWeb && setFirstWeb()
                }}
              >
                <ArrowForwardIosIcon sx={{ width: isMd ? 12 : 20, height: isMd ? 12 : 20 }} />
              </ButtonBox>
            ))}
        </Stack>
      </Stack>
    </Box>
  </Box>
)
export default CustomTooltip
