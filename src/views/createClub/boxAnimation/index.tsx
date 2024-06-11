import { Box, styled } from '@mui/material'
import { BoxTypes } from 'api/boxes/type'
import { useEffect, useState } from 'react'
import { viewControl } from 'views/editBox/modal'
const Container = styled(Box)`
  & {
    width: 130px;
    height: 130px;
    /* border: 1px solid red; */
    transform-style: preserve-3d;
    margin: auto;
    transform: rotateX(-17deg) translateY(20px);
    ${props => props.theme.breakpoints.down('md')} {
      transform: rotateX(-17deg) translateY(0px) scale(0.8);
    }
  }
  #cube {
    width: 130px;
    height: 130px;
    border: 0px solid red;
    /* margin: 150px 0 0 150px; */
    transform-style: preserve-3d;
    transform: rotateX(-23deg) rotateY(-17deg) rotateZ(0deg);
    animation: cubeDrunk 7s linear infinite;
    /* -moz-animation: cubeDrunk 7s linear infinite; /* Firefox */
    /* -webkit-animation: cubeDrunk 7s linear infinite; Safari and Chrome  */
  }

  .wall {
    width: 130px;
    height: 130px;
    border: 2px solid var(--ps-neutral5);
    background-color: var(--ps-neutral2);
    position: absolute;
    transition: all 1s ease-out;
  }

  #front {
    transform: rotateX(0deg) rotateY(0deg) translateZ(65px);
    transform-origin: 50% 100%;
  }

  #right {
    height: 130px;
    transform-style: preserve-3d;
    transform: translateX(65px) rotateY(90deg);
    transform-origin: 50% 100%;
  }
  #top {
    /* #background-color: skyblue; */
    transform-origin: 50% 50%;
    transform: translateY(-65px) rotateX(90deg);
    transform-origin: 100% 50%;
  }
  #back {
    /* #background-color: green; */
    transform: rotateX(0deg) translateY(0px) rotateY(0deg) translateZ(-65px);
    transform-origin: 50% 100%;
  }

  #left {
    /* #background-color: yellow; */
    transform: rotateX(0deg) translateX(-65px) rotateY(-90deg);
    transform-origin: 50% 100%;
  }

  #bottom {
    /* #background-color: grey; */
    transform: rotateX(-90deg) rotateY(0deg) translateZ(65px);
  }

  /**-----------------------------OPEN BOX-----------------------------**/
  &.open {
    &  #front/**front**/ {
      transform-origin: 0% 100%;
      transform: translateZ(65px) rotateX(-90deg);
    }
    & #right /**right**/ {
      transform-origin: 50% 100%;
      transform: translateX(65px) rotateY(90deg) rotateX(-90deg);
    }
    & #back /**back**/ {
      transform-origin: 50% 100%;
      transform: translateZ(-65px) rotateX(90deg) rotateY(0deg);
    }

    & #left /**left**/ {
      transform-origin: 50% 100%;
      transform: translateX(-65px) rotateY(-90deg) rotateX(-90deg);
    }
    & #top {
      display: none;
    }
    & #msg {
      opacity: 1;
      transform: rotateY(61deg) rotateX(-10deg) rotateZ(-6deg);
      background: transparent;
    }
  }

  @keyframes cubeDrunk {
    from {
      transform: rotateX(-23deg) rotateY(-17deg) rotateZ(0deg);
    }
    to {
      transform: rotateX(-23deg) rotateY(343deg) rotateZ(0deg);
    }
  }

  .wallna {
    width: 130px;
    height: 130px;
    padding-top: 50px;
    color: var(--ps-text-100);
    font-size: 30px;
    border: 0px solid pink;
    position: absolute;
    opacity: 0;
    background: transparent;
  }
`

export default function Page({ boxType }: { boxType: BoxTypes }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let time1: any, timer2: any
    new Promise(res => {
      time1 = setTimeout(() => {
        setOpen(true)
        res(true)
      }, 500)
    }).then(() => {
      timer2 = setTimeout(() => {
        // setOpen(false)
        viewControl.show('CreateProjectBoxModal', { boxType: boxType })
      }, 1500)
    })
    return () => {
      clearTimeout(time1)
      clearTimeout(timer2)
    }
  }, [boxType])

  return (
    <Container id="viewport" className={open ? 'open' : ''}>
      <div id="cube">
        <div id="front" className="wall">
          {/* front */}
        </div>
        <div id="right" className="wall">
          {/* right */}
        </div>
        <div id="back" className="wall">
          {/* back */}
        </div>
        <div id="left" className="wall">
          {/* left */}
        </div>
        <div id="top" className="wall">
          {/* top */}
        </div>
        <div id="bottom" className="wall">
          {/* bottom */}
        </div>
        <div id="msg" className="wallna wall">
          WELCOME!
        </div>
      </div>
    </Container>
  )
}
