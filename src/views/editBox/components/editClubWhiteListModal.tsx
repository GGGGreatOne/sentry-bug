import { Box, Button, Stack, Tab, Typography, styled } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
import Input from 'components/Input'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { viewControl } from '../modal'

import SearchSvg from 'assets/svg/search.svg'

import useBreakpoint from 'hooks/useBreakpoint'
import { LoadingButton, TabContext, TabList } from '@mui/lab'

import { SupportedChainId } from 'constants/chains'

import { isAddress } from 'utils'
import { useClubAuthCallback, useQueryIsMember } from 'hooks/boxes/useClubAuthCallback'
import { useActiveWeb3React } from 'hooks'

interface Props {
  clubAddress?: string | undefined
  onCancel?: () => void
}

enum TabType {
  ADD = 'Add',
  Remove = 'Remove'
}

const StyleTitleLabelLayout = styled(Box)(({}) => ({
  width: '100%',
  display: 'flex',
  gap: '8px',
  alignItems: 'center'
}))

const TitleLabel = styled(Typography)(({ theme }) => ({
  width: '100%',
  fontFamily: 'Public Sans',
  fontSize: '20px',
  fontWeight: 600,
  lineHeight: '28px',
  letterSpacing: '-0.02em',
  maxWidth: 'max-content',
  [theme.breakpoints.down('md')]: {
    fontSize: 15
  }
}))

const InputStyle = styled(Input)`
  &.MuiInputBase-root {
    height: 44px;
    border-radius: 6px;
    background: var(--ps-text-10);
    padding-left: 44px;
    padding-right: 24px;
  }

  & .MuiInputBase-input::placeholder {
    color: var(--ps-neutral3, #959595);
    /* D/body3 */
    font-family: 'SF Pro Display';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 18.2px */
  }
`

function SearchInput({
  clubAddress,
  chainId,
  boxOwner
}: {
  clubAddress: string | undefined
  chainId: SupportedChainId | undefined
  boxOwner: string | undefined
}) {
  const [searchVal, setSearchVal] = useState<string>('')
  const isMd = useBreakpoint('md')
  const queryAddress = useMemo(() => {
    if (isAddress(searchVal)) {
      return searchVal
    }
    return ''
  }, [searchVal])

  const isMembers: boolean | undefined = useQueryIsMember(clubAddress, chainId, queryAddress)
  console.log('🚀 ~ isMembers:', isMembers)

  const isClubOwner = useMemo(() => {
    return boxOwner?.toLocaleLowerCase() === queryAddress.toLocaleLowerCase()
  }, [boxOwner, queryAddress])

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20 }}>
        <SearchSvg />
      </Box>
      <InputStyle
        height={isMd ? 40 : 50}
        placeholder="Enter address to check validity."
        value={searchVal}
        onValue={e => setSearchVal(e)}
        fontSize={isMd ? 14 : 16}
      />
      {searchVal && !isClubOwner && (
        <Typography
          sx={{
            fontSize: { xs: 13, md: 14 },
            fontWeight: 500,
            color: isMembers ? 'var(--ps-green)' : 'var(--ps-red)',
            position: 'absolute',
            bottom: { xs: -20, md: -24 },
            left: 16,
            textTransform: 'capitalize'
          }}
        >
          {isMembers
            ? 'This address is on the whitelist.'
            : queryAddress
              ? 'This address is not on the whitelist.'
              : 'address error'}
        </Typography>
      )}
    </Box>
  )
}

function SetWhiteList({
  clubAddress,
  onCancel,
  chainId
}: {
  clubAddress: string | undefined
  onCancel?: () => void
  chainId?: SupportedChainId | undefined
}) {
  const isMd = useBreakpoint('md')
  const [tabVal, setTabVal] = useState<string>(TabType.ADD)
  const { addMembers, removeMembers, boxOwner } = useClubAuthCallback(clubAddress)

  const handleTab = (e: any, value: string) => {
    setTabVal(value)
    setWhiteListVal('')
  }
  const [whiteListVal, setWhiteListVal] = useState<string>('')

  const isAdd = useMemo(() => {
    return tabVal === TabType.ADD
  }, [tabVal])

  const whiteListData = useMemo(() => {
    let data: string[] = []
    if (whiteListVal.trim()) {
      const arr = whiteListVal.trim().split(/\r?\n|\r/)
      if (arr.find(v => !isAddress(v))) {
        alert('whiteList address error')
        return
      }
      data = arr
    }
    return data
  }, [whiteListVal])

  const AddMembersCb = useCallback(async () => {
    try {
      const data = whiteListData

      if (!data?.length) return

      const AddMemberRes = await addMembers(data)
      console.log('🚀 ~ AddMemberRes:', AddMemberRes)
      onCancel?.()
    } catch (error) {
      console.error('AddMemberRes', error)
      onCancel?.()
    }
  }, [addMembers, onCancel, whiteListData])

  const RemoveMembersCb = useCallback(async () => {
    try {
      const data = whiteListData

      if (!data?.length) return

      const RemoveMemberRes = await removeMembers(data)
      console.log('🚀 ~ RemoveMemberRes:', RemoveMemberRes)
      onCancel?.()
    } catch (error) {
      console.error('RemoveMemberRes', error)
      onCancel?.()
    }
  }, [onCancel, removeMembers, whiteListData])

  const Submit = useCallback(() => {
    if (isAdd) {
      AddMembersCb()
      return
    }

    if (!isAdd) {
      RemoveMembersCb()
    }
  }, [AddMembersCb, RemoveMembersCb, isAdd])

  const bt = useMemo(() => {
    if (isAdd) {
      return (
        <LoadingButton variant="contained" onClick={Submit}>
          Add
        </LoadingButton>
      )
    }
    return (
      <LoadingButton variant="contained" onClick={Submit}>
        Remove
      </LoadingButton>
    )
  }, [Submit, isAdd])

  return (
    <Stack spacing={{ xs: 16, md: 32 }} width={{ xs: '100%', md: 514 }} maxWidth={514}>
      <SearchInput clubAddress={clubAddress} chainId={chainId} boxOwner={boxOwner} />
      <TabContext value={tabVal}>
        <TabList
          onChange={handleTab}
          aria-label="lab API tabs example"
          variant="scrollable"
          sx={{
            '& .MuiTab-root': {
              padding: '4px 0',
              fontSize: { xs: 16, md: 18 },
              fontWeight: 500,
              lineHeight: isMd ? '13px' : '26px',
              color: 'var(--ps-text-100)',
              textTransform: 'initial',
              fontFamily: 'Inter',
              fontStyle: 'normal',
              minWidth: { xs: 50, md: 62 }
            }
          }}
        >
          <Tab key={-1} label={'Add'} value={'Add'} />
          <Tab key={-2} label={'Remove'} value={'Remove'} />
        </TabList>
      </TabContext>

      <Stack spacing={{ xs: 16, md: 32 }}>
        <Stack>
          <StyleTitleLabelLayout>
            <TitleLabel>Whitelist </TitleLabel>
            <Typography
              sx={{
                fontSize: 13,
                color: 'var(--ps-text-60)'
              }}
            >{`(Only one address per line)`}</Typography>
          </StyleTitleLabelLayout>

          <Box
            sx={{
              height: 180,
              overflow: 'hidden',
              transition: 'all 0.4s',
              marginTop: '16px !important'
            }}
          >
            <Input
              height={180}
              placeholder="Enter addresses"
              multiline
              type="string"
              rows={6}
              value={whiteListVal}
              onValue={e => {
                setWhiteListVal(e)
              }}
              style={{
                borderRadius: '8px'
              }}
            />
          </Box>
        </Stack>

        <Stack
          width={'100%'}
          justifyContent={isMd ? 'center' : 'flex-end'}
          direction={'row'}
          alignItems={'center'}
          spacing={16}
          sx={{
            '& button': {
              width: 133,
              height: isMd ? 36 : 44,
              fontSize: isMd ? 13 : 15,
              fontWeight: 500
            }
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              onCancel?.()
            }}
          >
            Cancel
          </Button>
          {bt}
        </Stack>
      </Stack>
    </Stack>
  )
}

const EditClubWhiteListModal = ({ clubAddress, onCancel }: Props) => {
  const { account, chainId } = useActiveWeb3React()

  const onCloseCb = useCallback(() => {
    onCancel ? onCancel() : viewControl.hide('EditClubWhiteListModal')
  }, [onCancel])

  useEffect(() => {
    onCloseCb()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])
  return (
    <BaseDialog title={'Set Club Access'} close>
      <SetWhiteList clubAddress={clubAddress} onCancel={onCloseCb} chainId={chainId} />
    </BaseDialog>
  )
}
export default EditClubWhiteListModal
