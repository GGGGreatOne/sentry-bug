import { useCallback, useEffect, useRef, useState } from 'react'
import { isMobile } from '../utils'
import { styled } from '@mui/material'

interface InputAreaProps {
  placeholder: string
  inputFocus: any
  onKeyDown: any
  sendTimestamp: any
  showMemberList: any
  selectionIndex: any
  onSelectionChanged: any
  sendMessage: any
  onChange: any
  value: string
}

const TextArea = styled('textarea')`
  min-height: 40px;
  font-size: 13px;
  line-height: 18px;

  @media (max-width: 900px) {
    padding: 11px 12px;
  }
  @media (min-width: 900px) {
    padding: 11px 24px;
  }
  border-radius: 24px;
  flex-grow: 1;
  color: var(--message-sender-color);
  border: none;
  outline: none;
  resize: none;
  scrollbar-width: none;
  max-height: 144px;
  overflow-x: hidden;
  overflow-y: auto;
  background: var(--ps-neutral2);
  &::placeholder {
    color: white;
  }
`

export default function Page(props: InputAreaProps) {
  const {
    value,
    placeholder,
    inputFocus,
    onKeyDown,
    sendTimestamp,
    showMemberList,
    selectionIndex,
    onSelectionChanged,
    sendMessage,
    onChange
  } = props
  const inputRef = useRef<any | null>(null)
  const [nextFrameTimeout, setNextFrameTimeout] = useState(0)
  //TODO: delayResize limit overflow
  const delayResize = useCallback(() => {
    if (nextFrameTimeout) {
      clearTimeout(nextFrameTimeout)
    }
    setNextFrameTimeout(setTimeout(resize, 0) as any)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    resize()
  }, [])

  useEffect(() => {
    if (!isMobile()) {
      focusInput()
    }
  }, [])

  useEffect(() => {
    if (sendTimestamp > 0) {
      delayResize()
      focusInput()
    }
  }, [sendTimestamp, delayResize])

  useEffect(() => {
    if (inputFocus > 0) {
      focusInput()
    }
  }, [inputFocus])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current
      onSelectionChanged(selectionStart, selectionEnd)
    }
  }, [inputRef?.current?.selectionStart, inputRef?.current?.selectionEnd, onSelectionChanged])

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(selectionIndex, selectionIndex)
      delayResize()
    }
  }, [selectionIndex, delayResize])

  const focusInput = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const resize = () => {
    if (inputRef && inputRef.current) {
      // console.log('resizing...', inputRef.current)
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
    }
  }

  const handleChangeDelay = (e: any) => {
    delayResize()
    onChange(e.target.value)
  }

  const handleKeyDown = (e: any) => {
    const { keyCode, shiftKey } = e
    if (keyCode === 13 && value.trim()) {
      if (shiftKey) {
        // props.onChange(value);
        return
      } else if (!showMemberList) {
        e.stopPropagation()
        e.preventDefault()
        sendMessage()
        delayResize()
        return
      }
    }
    onKeyDown(e)
  }

  return (
    <TextArea
      className="the_text_area"
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChange={handleChangeDelay}
      onKeyDown={handleKeyDown}
      rows={1}
      autoComplete="off"
    />
  )
}
