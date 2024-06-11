import {
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Box,
  styled,
  IconButton,
  Collapse,
  TableSortLabel,
  Table
} from '@mui/material'
import { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import React from 'react'
import EmptyData from 'components/EmptyData'

const Profile = styled('div')(`
  display: flex;
  align-items: center;
`)

export const TableProfileImg = styled('div', {
  shouldForwardProp: () => true
})(({ url }: { url?: string }) => ({
  height: '24px',
  width: '24px',
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: '8px',
  background: `#000000 ${url ? `url(${url})` : ''}`
}))

export function OwnerCell({ url, name }: { url?: string; name: string }) {
  return (
    <Profile>
      <TableProfileImg url={url} />
      {name}
    </Profile>
  )
}

const StyledTableContainer = styled(TableContainer)({
  '&::-webkit-scrollbar': { width: 0 }
})

const StyledTableHead = styled(TableHead)(({}) => ({
  '& .MuiTableCell-root': {
    borderBottom: 'none'
  }
}))

const StyledTableRow = styled(TableRow, { shouldForwardProp: () => true })<{
  variant: 'outlined' | 'grey'
  fontSize?: string
}>(({ variant, fontSize }) => ({
  '& .MuiTableCell-root': {
    fontSize: fontSize ?? '16px',
    justifyContent: 'flex-start',
    paddingLeft: 0,

    borderColor: variant === 'outlined' ? '#00000010' : 'transparent',
    borderRight: 'none',
    borderLeft: 'none',
    '& .MuiTypography-root': {
      fontSize: fontSize ?? '16px'
    }
  }
}))

const sortIcon = ({ className }: { className: string }) => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      className="sort-down"
      d="M1.0875 6.5791L3 8.48743L4.9125 6.5791L5.5 7.1666L3 9.6666L0.5 7.1666L1.0875 6.5791Z"
      fill="#00000099"
    />
    <path
      className="sort-up"
      d="M1.0875 3.421L3 1.51266L4.9125 3.421L5.5 2.8335L3 0.333496L0.5 2.8335L1.0875 3.421Z"
      fill="#00000099"
    />
  </svg>
)

export default function CusTable({
  header,
  rows,
  variant = 'grey',
  collapsible,
  hiddenParts,
  fontSize,
  sortHeaders,
  order,
  orderBy,
  createSortfunction,
  maxHeight,
  stickyHeader = false,
  noDataHeight = 135
}: {
  sortHeaders?: string[]
  header: string[]
  rows: (string | number | JSX.Element)[][]
  variant?: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenParts?: JSX.Element[]
  fontSize?: string
  order?: 'asc' | 'desc'
  orderBy?: string
  createSortfunction?: (label: string) => () => void
  maxHeight?: number
  stickyHeader?: boolean
  noDataHeight?: number
}) {
  return (
    <StyledTableContainer sx={{ maxHeight: maxHeight }}>
      {rows.length === 0 && <EmptyData height={noDataHeight} color="var(--ps-neutral3)" />}

      {rows.length > 0 && (
        <Table stickyHeader={stickyHeader}>
          <StyledTableHead>
            <TableRow>
              {header.map((string, idx) => (
                <TableCell key={idx}>
                  {sortHeaders && sortHeaders.includes(string) && order && orderBy && createSortfunction ? (
                    <TableSortLabel
                      active={orderBy === string}
                      direction={orderBy === string ? order : 'asc'}
                      onClick={createSortfunction(string)}
                      IconComponent={sortIcon}
                      sx={{
                        '& .MuiTableSortLabel-icon': {
                          transform: 'none',
                          opacity: 1
                        },
                        '& .MuiTableSortLabel-iconDirectionDesc .sort-down': {
                          fill: theme =>
                            orderBy === string
                              ? order === 'desc'
                                ? theme.palette.primary.main
                                : '#00000099'
                              : '#00000099'
                        },
                        '& .MuiTableSortLabel-iconDirectionAsc .sort-up': {
                          fill: theme =>
                            orderBy === string
                              ? order === 'asc'
                                ? theme.palette.primary.main
                                : '#00000099'
                              : '#00000099'
                        }
                      }}
                    >
                      {string}

                      {/* <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box> */}
                    </TableSortLabel>
                  ) : (
                    string
                  )}
                </TableCell>
              ))}
            </TableRow>
          </StyledTableHead>

          <TableBody>
            {rows.map((row, idx) => (
              <Row
                fontSize={fontSize}
                row={row}
                collapsible={collapsible}
                key={row[0].toString() + idx}
                variant={variant}
                hiddenPart={hiddenParts && hiddenParts[idx]}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </StyledTableContainer>
  )
}

function Row({
  row,
  variant,
  collapsible,
  hiddenPart,
  fontSize
}: {
  row: (string | number | JSX.Element)[]
  variant: 'outlined' | 'grey'
  collapsible?: boolean
  hiddenPart?: JSX.Element
  fontSize?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <StyledTableRow
        fontSize={fontSize}
        variant={variant}
        sx={
          isOpen
            ? {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                '& .MuiTableCell-root': {
                  '&:first-of-type': { borderBottomLeftRadius: 0 },
                  '&:last-child': { borderBottomRightRadius: 0 }
                }
              }
            : undefined
        }
      >
        {row.map((data, idx) => (
          <TableCell key={idx}>{data}</TableCell>
        ))}
        {collapsible && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setIsOpen(open => !open)}
              sx={{ flexGrow: 0 }}
            >
              {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
      </StyledTableRow>
      {collapsible && (
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={row.length + 5}>
            <Collapse
              in={isOpen}
              timeout="auto"
              sx={{
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                width: '100%',
                marginTop: -8
              }}
            >
              <Box
                sx={{
                  padding: 28,
                  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                  transition: '.5s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {hiddenPart}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
