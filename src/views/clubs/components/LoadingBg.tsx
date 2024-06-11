import { Box, styled } from '@mui/material'
import LoadingBgImg from 'assets/images/boxes/pointer.png'
const LoadingCom = styled(Box)(() => ({
  '#shape': {
    position: 'relative',
    width: 'calc(10vw + 10vh)',
    height: 'calc(10vw + 10vh)',
    animation: 'rotate 60s linear infinite',
    transformStyle: 'preserve-3d',
    div: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      border: '3px solid white',
      // boxShadow: `0 0 20px 0px lightgreen`,
      borderRadius: '3px',
      '&.front': { transform: `translateZ(calc(-5vw - 5vh))` },
      '&.back': { transform: `translateZ(calc(5vw + 5vh))` },
      '&.right': { transform: `translateX(calc(5vw + 5vh))    rotateY(90deg)` },
      '&.left': { transform: `translateX(calc(-5vw - 5vh))   rotateY(90deg)` },
      '&.top': { transform: `translateY(calc(5vw + 5vh))    rotateX(90deg)` },
      '&.bottom': { transform: `translateY(calc(-5vw - 5vh))   rotateX(90deg)` }
    }
  },
  '@keyframes rotate': {
    '0%': { transform: `rotateX(0deg) rotateY(0deg) rotateZ(0deg)` },
    '100%': { transform: `rotateX(360deg) rotateY(360deg) rotateZ(360deg)` }
  }
}))
const LoadingBg = ({ loading }: { loading: boolean }) => {
  if (!loading) return <></>
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
        background: '#000'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: `url(${LoadingBgImg.src}) repeat left top`
        }}
      >
        <LoadingCom>
          <div id={'shape'}>
            <div className="front"></div>
            <div className="left"></div>
            <div className="right"></div>
            <div className="top"></div>
            <div className="bottom"></div>
            <div className="back"></div>
          </div>
        </LoadingCom>
      </Box>
    </Box>
  )
}
export default LoadingBg
