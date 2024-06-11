import { Box, Checkbox, ClickAwayListener, Collapse, FormControlLabel, InputBase, Stack, styled } from '@mui/material'
import React, { useState } from 'react'
import FilterIcon from 'assets/svg/boxes/filter_icon.svg'
import ArrowBottom from 'assets/svg/boxes/arrow_bottom.svg'

const CusInputBar = styled(InputBase)`
  width: 192px;
  height: 44px;
  padding: 0px 12px;
  border-radius: 5px;
  justify-content: start;
  background-color: var(--ps-neutral);
  border: 1px solid var(--ps-neutral);
  cursor: pointer;
  transition: all 0.3s;

  & input {
    cursor: pointer;
    ::-webkit-input-placeholder {
      color: var(--ps-neutral3);
    }
  }

  &:hover {
    border: 1px solid var(--ps-text-100);
  }

  & {
    color: var(--ps-text-100);

    svg {
      width: 30px;
      path {
        transition: all 0.3s;
      }
    }

    svg:first-of-type path {
      stroke: var(--ps-text-100);
    }
    svg:last-of-type:hover path {
      stroke: var(--ps-text-100);
    }
  }

  &:has([value='']) {
    svg path {
      stroke: var(--ps-neutral3);
    }
  }

  &.Mui-disabled {
    background-color: var(--ps-text-primary);
    border: 1px solid var(--ps-neutral);
  }
  & .Mui-disabled {
    cursor: not-allowed;

    svg path {
      cursor: not-allowed;
    }
  }

  &:has([value='']):hover {
    svg path {
      stroke: var(--ps-neutral3);
    }
  }
`

type FilterProps = {
  onChange?: (value: number) => void
}

const filterItems = [
  {
    label: 'Newest',
    value: 0
  },
  {
    label: 'Club ranking',
    value: 1
  },
  {
    label: 'Price low to high',
    value: 2
  },
  {
    label: 'Price high to low',
    value: 3
  }
]
export function Filters({ onChange }: FilterProps) {
  const [filtering, setFiltering] = useState(false)
  const [selected, setSelected] = useState(filterItems[0])

  return (
    <ClickAwayListener
      onClickAway={() => {
        setFiltering(false)
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CusInputBar
          placeholder="Filter"
          startAdornment={<FilterIcon />}
          endAdornment={<ArrowBottom />}
          onClick={ev => {
            ev.preventDefault()
            setFiltering(true)
          }}
          disabled={filtering}
          value={selected.label}
          readOnly
        />
        <Collapse
          in={filtering}
          sx={{
            position: 'absolute',
            zIndex: 10,
            bgcolor: 'var(--ps-text-primary)',
            p: 16,
            width: '100%',
            borderRadius: '0 0 6px 6px'
          }}
        >
          <Stack>
            {filterItems.map(item => (
              <FormControlLabel
                key={item.value}
                label={item.label}
                sx={{ mr: 0 }}
                control={
                  <Checkbox
                    checked={selected.value === item.value}
                    onChange={(ev, checked) => {
                      if (checked) {
                        setSelected(item)
                        onChange?.(item.value)
                        setFiltering(false)
                      }
                    }}
                  />
                }
              />
            ))}
          </Stack>
        </Collapse>
      </Box>
    </ClickAwayListener>
  )
}
