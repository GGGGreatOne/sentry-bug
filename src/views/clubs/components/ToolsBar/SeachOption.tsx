/* eslint-disable @next/next/no-img-element */
import { ReactNode } from 'react'
import { Box, styled, Typography } from '@mui/material'
import { BoxListItem } from 'api/boxes/type'
// import PatchCheckFll from 'assets/svg/home/patchCheckFll.svg'
import VerifyIcon from 'assets/svg/verifiedIconSm.svg'
import DefaultImage from 'assets/images/account/default_followings_item.png'

export interface SeachOptionProps {
  children?: ReactNode
  item: BoxListItem
}
const OptionBox = styled(Box)`
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: row;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background-color: var(--ps-text-10);
  }
`
const BorderBox = styled(Box)`
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: 6px;
`
const SeachOption = ({ children, item }: SeachOptionProps) => {
  return (
    <OptionBox>
      <BorderBox>
        <img
          src={item.avatar}
          width={36}
          height={36}
          alt=""
          onError={(e: any) => {
            e.target.onerror = null
            e.target.src = DefaultImage.src
          }}
        />
      </BorderBox>

      <Box display="flex" flexDirection={'column'} justifyContent={'center'} gap={4}>
        <Box display="flex" alignItems={'center'} gap={4}>
          <Typography lineHeight={'140%'} fontSize={13}>
            {item.projectName}
          </Typography>
          {item.verified && <VerifyIcon width={17} />}
        </Box>
        <Box>
          <Typography lineHeight={'140%'} fontSize={13} color={'var(--ps-neutral3)'}>
            Club ID #{item.rewardId} · {item.followCount} Followers
          </Typography>
        </Box>
      </Box>
      {children}
    </OptionBox>
  )
}
export default SeachOption
