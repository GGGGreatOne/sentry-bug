import { styled, Pagination, Typography, Box, ButtonBase } from '@mui/material'
import React from 'react'

export const PaginationButton = styled(ButtonBase)`
  height: 44px;
  padding: 13px 24px;
  background-color: var(--ps-neutral);
  border-radius: 6px;
  white-space: nowrap;
`

export const StyledPagination = styled(Pagination)`
  & .MuiPaginationItem-root {
    color: var(--ps-neutral3);
    border: none;
    padding: 10px 12px;
    font-size: 13px;
    line-height: 140%;
    margin: 0 8px;
  }
  & .MuiPaginationItem-page.Mui-selected {
    color: var(--ps-text-100);
    background-color: var(--ps-neutral);
  }
`

interface PaginationProps {
  count: number
  page: number
  siblingCount?: number
  boundaryCount?: number
  // setPage: (page: number) => void
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange?: (event: object, page: number) => void
  perPage?: number
  total?: number
}
export default function BoxPagination({
  count,
  page,
  onChange,
  // setPage,
  siblingCount,
  boundaryCount,
  perPage,
  total
}: PaginationProps) {
  return (
    <>
      {count > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 20, sm: 26 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          {perPage && (
            <Box
              sx={{
                width: { xs: '100%', sm: 'fit-content' }
              }}
            >
              <Typography
                sx={{
                  opacity: 0.4
                }}
              >
                {(page - 1) * perPage + 1} - {total && page * perPage > total ? total : page * perPage} items of {total}
              </Typography>
            </Box>
          )}
          <StyledPagination
            count={count}
            page={page}
            siblingCount={siblingCount || 1}
            boundaryCount={boundaryCount || 1}
            hideNextButton
            hidePrevButton
            variant="outlined"
            shape="rounded"
            onChange={onChange}
          />
        </Box>
      )}
    </>
  )
}
