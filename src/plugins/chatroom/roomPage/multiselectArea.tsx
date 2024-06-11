import { useMemo } from 'react'
import { Box, styled } from '@mui/material'
import dayjs from 'dayjs'
import CrossIcon from '../assets/svg/closeIcon.svg'
import CopyIcon from '../assets/svg/copy_icon.svg'
import copy from 'copy-to-clipboard'
import { SendingNetworkEvent } from 'sendingnetwork-js-sdk'

export interface SelectSendingNetworkEvent extends SendingNetworkEvent {
  viewIndex: number
}

interface MultiselectAreaProps {
  selectedMessages: SelectSendingNetworkEvent[]
  onStopSelect: any
  // setShowForward: any
}

const MultiSelectedBox = styled(Box)`
  .multiselect-area {
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    height: 52px;
    background-color: black;
    display: flex;
    flex-direction: column;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 2;
  }

  .multiselect-area .content {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .content .svg-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 12px;
  }
  .content .svg-btn.disabled svg {
    stroke: #999;
  }
  .content .svg-btn.disabled:hover svg {
    stroke: #999;
  }
  .content .svg-btn.btn-delete {
    margin-right: 0;
  }
  .content .tip {
    font-size: 12px;
    flex: 1;
  }
`

export default function Page({
  selectedMessages,
  onStopSelect // , setShowForward
}: MultiselectAreaProps) {
  const len = useMemo(() => {
    return selectedMessages?.length || 0
  }, [selectedMessages])
  // const handleForward = () => {
  //   // click forward btn
  //   if (selectedMessages.length) {
  //     setShowForward()
  //   }
  // }

  const handleCopy = () => {
    // click copy btn
    if (selectedMessages.length) {
      let result = ''
      let sdnEvent
      const arr = selectedMessages.sort((a, b) => {
        return (a.viewIndex || 0) - (b.viewIndex || 0)
      })
      for (let i = 0; i < arr.length; i++) {
        sdnEvent = arr[i]
        result += '> ' + sdnEvent.sender?.name || sdnEvent.getSender()
        result += ` [${renderTime(sdnEvent.getTs())}]`
        result += '\n' + sdnEvent.getContent().body + '\n\n'
      }
      result = result.slice(0, result.length - 2)
      copy(result)
      // const tip = `${len} ${len > 1 ? 'messages' : 'message'} copied`
      // // showMessage({
      // //   type: 'success',
      // //   msg: tip,
      // // });
      onStopSelect()
    }
  }

  const renderTime = (ts: string | number) => {
    return dayjs(ts).format('MM/DD/YYYY HH:mm')
  }

  return (
    <MultiSelectedBox>
      <div className="multiselect-area">
        <div className="content">
          <Box className="btn-cancel svg-btn svg-btn-fill" onClick={onStopSelect}>
            <CrossIcon />
          </Box>
          <span className="tip">{`${len} ${len > 1 ? 'messages' : 'message'} selected`}</span>
          {/* <Box className={`btn-forward svg-btn svg-btn-stroke ${len ? '' : 'disabled'}`} onClick={handleForward}>
            <ForwardIcon />
          </Box> */}
          <Box className={`btn-copy svg-btn svg-btn-stroke ${len ? '' : 'disabled'}`} onClick={handleCopy}>
            <CopyIcon />
          </Box>
          {/* <div className={`btn-delete svg-btn ${len ? '' : 'disabled'}`}
          onClick={handleDelete}>
          {deleteIcon}
        </div> */}
        </div>
      </div>
    </MultiSelectedBox>
  )
}
