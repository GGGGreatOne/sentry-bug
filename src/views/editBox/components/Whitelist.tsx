import { Box, Typography, styled } from '@mui/material'
import { Card } from './MainDashboard'
import Input from 'components/Input'
import { useMemo, useState } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import { isAddress } from 'utils'
import SearchSvg from 'assets/svg/search.svg'
import Table from 'components/Table'

const StyleBox = styled(Box)(() => ({
  width: '100%',
  display: 'grid',
  gap: 16
}))

const InputStyle = styled(Input)`
  &.MuiInputBase-root {
    height: 44px;
    color: #0d0d0d !important;
    border-radius: 6px;
    background: var(--ps-text-100);
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

const StyleTable = styled(Box)(() => ({
  '.MuiTableCell-root': {
    background: 'transparent !important',
    padding: '0 !important'
  },
  '.MuiTableRow-root': {
    background: 'transparent !important',
    padding: '0 !important'
  },
  thead: {
    tr: {
      '.MuiTableCell-root': {
        color: '#8492A6'
      }
    }
  },
  tbody: {
    tr: {
      height: 32,
      ':hover': {
        opacity: 0.7,
        cursor: 'pointer'
      }
    },
    'tr:first-child td': {
      border: 'none !important'
    }
  }
}))

function SearchInput() {
  const [searchVal, setSearchVal] = useState<string>('')
  const isMd = useBreakpoint('md')
  const queryAddress = useMemo(() => {
    if (isAddress(searchVal)) {
      return searchVal
    }
    return ''
  }, [searchVal])
  console.log('🚀 ~ queryAddress ~ queryAddress:', queryAddress)

  return (
    <Box sx={{ position: 'relative', maxWidth: 400 }}>
      <Box
        sx={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 20,
          height: 20,
          zIndex: 9,
          svg: {
            path: {
              stroke: '#B0B7C3'
            }
          }
        }}
      >
        <SearchSvg />
      </Box>
      <InputStyle
        height={isMd ? 36 : 42}
        placeholder="Enter address to check validity."
        value={searchVal}
        onValue={e => setSearchVal(e)}
        fontSize={isMd ? 14 : 16}
      />
    </Box>
  )
}

const testList = [
  {
    address: '0x1f7a4680e2d6a5c9724e5c2f2171c56bf1bf5b5e',
    createTime: new Date()
  },
  {
    address: '0x1f7a4680e2d6a5c9724e5c2f2171c56bf1bf5b5e',
    createTime: new Date()
  }
]

const Whitelist = () => {
  const list = useMemo(() => {
    return testList.map((item, index) => [
      <Box key={item.address + index.toString()} minWidth={'100px'}>
        <Typography>{index}</Typography>
      </Box>,
      <Box key={item.address + index.toString()}>
        <Typography>{item.address}</Typography>
      </Box>,
      <Box key={item.address + index.toString()}>del set</Box>
    ])
  }, [])

  return null

  return (
    <Card>
      <StyleBox>
        <SearchInput />
        <StyleTable>
          <Table header={['ID', 'ACCOUNT', 'OPERATION']} rows={list} />
        </StyleTable>
      </StyleBox>
    </Card>
  )
}

export default Whitelist
