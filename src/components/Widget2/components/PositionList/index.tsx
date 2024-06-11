import { Typography } from '@mui/material'
import { PositionDetails } from 'components/Widget2/types/position'
import React from 'react'
import styled from 'styled-components'
import PositionListItem from '../PositionListItem'
import { MEDIA_WIDTHS } from 'components/Widget2/theme'

const DesktopHeader = styled.div`
  display: none;
  font-size: 14px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.surface3};

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    align-items: center;
    display: flex;
    justify-content: space-between;
    & > div:last-child {
      text-align: right;
      margin-right: 12px;
    }
  }
`

const MobileHeader = styled.div`
  font-weight: medium;
  font-weight: 535;
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.surface3};

  @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
    display: none;
  }

  @media screen and (max-width: ${MEDIA_WIDTHS.deprecated_upToExtraSmall}px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`

const ToggleWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`

const ToggleLabel = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  font-size: 14px;
  font-weight: 485;
`

type PositionListProps = React.PropsWithChildren<{
  positions: PositionDetails[]
  setUserHideClosedPositions: any
  userHideClosedPositions: boolean
}>

export default function PositionList({
  positions,
  setUserHideClosedPositions,
  userHideClosedPositions
}: PositionListProps) {
  return (
    <>
      <DesktopHeader>
        <Typography>Your positions {positions && ' (' + positions.length + ')'}</Typography>
        <ToggleLabel
          id="desktop-hide-closed-positions"
          onClick={() => {
            setUserHideClosedPositions(!userHideClosedPositions)
          }}
        >
          {userHideClosedPositions ? (
            <Typography color={'#5A7FFF'}>Show closed positions</Typography>
          ) : (
            <Typography color={'#5A7FFF'}>Hide closed positions</Typography>
          )}
        </ToggleLabel>
      </DesktopHeader>
      <MobileHeader>
        <Typography>Your positions</Typography>
        <ToggleWrap>
          <ToggleLabel
            onClick={() => {
              setUserHideClosedPositions(!userHideClosedPositions)
            }}
          >
            {userHideClosedPositions ? (
              <Typography color={'#5A7FFF'}>Show closed positions</Typography>
            ) : (
              <Typography color={'#5A7FFF'}>Hide closed positions</Typography>
            )}
          </ToggleLabel>
        </ToggleWrap>
      </MobileHeader>
      {positions.map(p => (
        <PositionListItem key={p.tokenId.toString()} {...p} />
      ))}
    </>
  )
}
