import React, { ReactNode, forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  Box,
  styled,
  FormGroup,
  ClickAwayListener,
  InputBase,
  Collapse,
  SwipeableDrawer,
  Typography,
  IconButton
} from '@mui/material'
import Checkbox from 'components/Checkbox'
import { BoxListItem, BoxTypes, IListOrder, OrderType } from 'api/boxes/type'
import SearchIcon from 'assets/svg/boxes/search_icon.svg'
import InputLose from 'assets/svg/boxes/input_lose.svg'
import SwipeableClose from 'assets/svg/swipeable_close.svg'
import FilterIcon from 'assets/svg/boxes/filter_icon.svg'
import ArrowBottom from 'assets/svg/boxes/arrow_bottom.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import { useGetSearchBoxList } from 'hooks/boxes/useGetBoxList'
import EmptyData from 'components/EmptyData'

const searchMaxNum = 50

export enum SearchType {
  None,
  ByInput,
  ByFilter
}
const SearchTitle = {
  [SearchType.ByFilter]: 'Club Filters',
  [SearchType.ByInput]: 'Search for Club',
  [SearchType.None]: ''
}

const FilterLable = {
  [BoxTypes.PROJECT]: 'Project Clubs',
  [BoxTypes.USER]: 'User Clubs'
}

export type SearchParam = {
  inputValue: string
  checkbox: {
    [BoxTypes.PROJECT]: boolean
    [BoxTypes.USER]: boolean
    // [BoxFilterType.VerifiedOnly]: boolean
  }
}

export type SearchFilter = {
  [BoxTypes.PROJECT]: boolean
  [BoxTypes.USER]: boolean
  // [BoxFilterType.VerifiedOnly]: boolean
}

interface SearchProps {
  onChange?: (item: BoxListItem | null, filter: SearchFilter | null, clear?: () => void) => void
  option?: (item: BoxListItem) => ReactNode
}

const CusInputPopup = styled(InputBase)`
  width: 100%;
  padding: 10px 12px;
  border-radius: 5px;
  justify-content: start;
  background-color: var(--ps-text-10);
  border: 1px solid var(--ps-text-10);
  transition: all 0.3s;

  &:hover {
    border: 1px solid var(--ps-text-100);
  }

  & {
    & input {
      ::-webkit-input-placeholder {
        color: var(--ps-neutral3);
      }
    }
    svg {
      width: 35px;
      path {
        transition: all 0.3s;
      }
    }

    svg:first-of-type path {
      stroke: var(--ps-text-100);
    }
    svg:last-of-type:hover {
      cursor: pointer;
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

  & .Mui-disabled {
    cursor: not-allowed;
    svg path {
      cursor: not-allowed;
    }
  }
`

const CusInputBar = styled(InputBase)`
  ${props => props.theme.breakpoints.down('md')} {
    max-width: 160px;
  }
  height: 44px;
  padding: 0px 12px;
  border-radius: 5px;
  justify-content: start;
  flex: 1;
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

const CusSearchBtn = styled(Box)`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: var(--ps-neutral);
  cursor: pointer;
  transition: all 0.3s;
`

const Container = styled(Box)`
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 8px;
  background: var(--ps-text-primary-40);
  backdrop-filter: blur(5px);

  ${props => props.theme.breakpoints.down('md')} {
    padding: 4px;
    gap: 4px;
  }
`
const BlurBox = styled(Box)`
  padding: 8px 8px 0;
  width: 100%;
  border-radius: 8px 8px 0 0;
  background: var(--ps-text-primary-40);
  backdrop-filter: blur(5px);
`
const SearchBox = styled(Box)`
  height: 100%;
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  border-radius: 6px;
  background: var(--ps-neutral);
`

const Title = styled(Box)`
  width: 100%;
  font-size: 15px;
  color: var(--ps-neutral3);
  padding-bottom: 15px;
  border-bottom: 1px solid var(--ps-text-10);
  background-color: var(--ps-neutral);

  ${props => props.theme.breakpoints.down('md')} {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }
`

const OptionsBox = styled(Box)`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--ps-neutral);
  border-radius: 0 0 6px 6px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0px;
  }

  ${props => props.theme.breakpoints.down('md')} {
    height: 100%;
  }
`

const FormBox = styled(Box)`
  width: 100%;
  display: flex;
  gap: 4px;
`

const Search = ({ option, onChange }: SearchProps, ref: any) => {
  const isMd = useBreakpoint('md')

  const [searchParam, setSearchParam] = useState<SearchParam>({
    inputValue: '',
    checkbox: {
      [BoxTypes.PROJECT]: false,
      [BoxTypes.USER]: false
      // [BoxFilterType.VerifiedOnly]: false
    }
  })

  const [searchValue, setSearchValue] = useState<string>('')

  const filterValue = useRef({
    [BoxTypes.PROJECT]: false,
    [BoxTypes.USER]: false
    // [BoxFilterType.VerifiedOnly]: false
  })

  const showFilterValue = useCallback(() => {
    return Object.entries(filterValue.current)
      .map(_ => {
        const isTyue = _[1]
        const value: BoxTypes = Number(_[0])
        return isTyue ? FilterLable[value] : null
      })
      .filter(_ => !!_)
      .join(' / ')
  }, [filterValue])

  const [searchBtnValue, setSearchBtnValue] = useState<any>({
    input: '',
    filter: ''
  })

  const checkBoxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filterValue.current = {
        ...filterValue.current,
        [e.target.name]: e.target.checked
      }

      onChange && onChange(null, filterValue.current)

      setSearchParam({
        ...searchParam,
        checkbox: {
          ...searchParam.checkbox,
          [e.target.name]: e.target.checked
        }
      })
    },
    [filterValue, onChange, searchParam]
  )

  const [searchType, setSearchType] = useState<SearchType>(SearchType.None)
  const formHandle = useCallback(
    (type: SearchType) => {
      if (type === SearchType.ByInput) {
        setSearchValue('')
        setSearchParam({
          inputValue: '',
          checkbox: {
            ...searchParam.checkbox
          }
        })
      }
      if (type === SearchType.ByFilter) {
        setSearchValue('')
        setSearchParam({
          inputValue: '',
          checkbox: {
            ...searchParam.checkbox
          }
        })
      }
      setSearchBtnValue({
        input: '',
        filter: ''
      })
      setSearchType(type)
    },
    [searchParam.checkbox]
  )

  const clearHandle = useCallback(
    (type: SearchType, e?: any) => {
      e?.stopPropagation()
      if (type === SearchType.ByInput) {
        onChange && onChange(null, filterValue.current)
        setSearchValue('')
        setSearchBtnValue({
          ...searchBtnValue,
          input: ''
        })
      }

      if (type === SearchType.ByFilter) {
        filterValue.current = {
          [BoxTypes.PROJECT]: false,
          [BoxTypes.USER]: false
          // [BoxFilterType.VerifiedOnly]: false
        }

        onChange &&
          onChange(null, {
            [BoxTypes.PROJECT]: false,
            [BoxTypes.USER]: false
            // [BoxFilterType.VerifiedOnly]: false
          })

        setSearchParam({
          ...searchParam,
          checkbox: {
            [BoxTypes.PROJECT]: false,
            [BoxTypes.USER]: false
            // [BoxFilterType.VerifiedOnly]: false
          }
        })
      }
    },
    [filterValue, onChange, searchBtnValue, searchParam]
  )
  useImperativeHandle(ref, () => {
    return { clearHandle }
  })

  const optionHandle = useCallback(
    (item: BoxListItem) => {
      filterValue.current = {
        [BoxTypes.PROJECT]: false,
        [BoxTypes.USER]: false
        // [BoxFilterType.VerifiedOnly]: false
      }
      onChange &&
        onChange(item, filterValue.current, () => {
          clearHandle(SearchType.ByInput)
        })
      setSearchValue(item.projectName)
      setSearchType(SearchType.None)
      setSearchBtnValue({
        input: item.boxId,
        filter: item.boxType
      })
    },
    [clearHandle, onChange]
  )

  const clearSearchParamHandle = useCallback(() => {
    setSearchParam({
      inputValue: '',
      checkbox: {
        ...searchParam.checkbox
      }
    })
  }, [searchParam.checkbox])

  const params = {
    pageNum: 0,
    pageSize: searchMaxNum,
    projectName: searchParam.inputValue,
    orderByColumn: OrderType.TVL,
    isAsc: IListOrder.DESC
  }
  const { data: inputFilterList } = useGetSearchBoxList(params)
  const options = useMemo(() => {
    return option && inputFilterList?.total === 0 ? (
      <EmptyData color={'var(--ps-text-20)'} />
    ) : (
      inputFilterList?.list?.map((_, index) => (
        <Box key={_.boxId + index} onClick={() => optionHandle(_)}>
          {option && option(_)}
        </Box>
      ))
    )
  }, [option, inputFilterList, optionHandle])

  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          setSearchType(SearchType.None)
        }}
      >
        <Container>
          {isMd ? (
            <SwipeableDrawer
              anchor="bottom"
              open={searchType === SearchType.ByInput || searchType === SearchType.ByFilter}
              onClose={() => {
                setSearchType(SearchType.None)
              }}
              onOpen={() => {}}
              PaperProps={{
                style: {
                  width: '100vw',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  height: searchType === SearchType.None ? 'auto' : searchType === SearchType.ByInput ? '100vh' : 'auto'
                }
              }}
            >
              <Title>
                <Typography>{SearchTitle[searchType]}</Typography>
                <IconButton
                  onClick={() => {
                    setSearchType(SearchType.None)
                  }}
                >
                  <SwipeableClose />
                </IconButton>
              </Title>

              <SearchBox>
                {searchType === SearchType.ByInput && (
                  <>
                    <CusInputPopup
                      startAdornment={<SearchIcon />}
                      placeholder="Search by Name, ID"
                      value={searchParam.inputValue}
                      onChange={e => {
                        setSearchParam({ ...searchParam, inputValue: e.target.value })
                      }}
                    />
                    <OptionsBox> {options && options}</OptionsBox>
                  </>
                )}
                {searchType === SearchType.ByFilter && (
                  <FormGroup
                    sx={{
                      width: '100%',
                      display: 'flex',
                      // justifyContent: 'space-between',
                      flexDirection: isMd ? 'column' : 'row',
                      gap: isMd ? 15 : 20
                    }}
                  >
                    <Checkbox
                      checked={filterValue.current[BoxTypes.PROJECT]}
                      label={FilterLable[BoxTypes.PROJECT]}
                      name={BoxTypes.PROJECT.toString()}
                      onChange={checkBoxChange}
                    />
                    <Checkbox
                      checked={filterValue.current[BoxTypes.USER]}
                      label={FilterLable[BoxTypes.USER]}
                      name={BoxTypes.USER.toString()}
                      onChange={checkBoxChange}
                    />
                    {/* <Checkbox
                    checked={filterValue.current[BoxFilterType.VerifiedOnly]}
                    label={BoxFilterType.VerifiedOnly}
                    name={BoxFilterType.VerifiedOnly}
                    onChange={checkBoxChange}
                  /> */}
                  </FormGroup>
                )}
              </SearchBox>
            </SwipeableDrawer>
          ) : (
            <Collapse
              style={{ width: '100%', position: 'absolute', bottom: 52, left: -2 }}
              in={searchType !== SearchType.None}
              onMouseLeave={() => {
                setSearchType(SearchType.None)
              }}
              mountOnEnter
              unmountOnExit
            >
              <BlurBox>
                <SearchBox>
                  <Title>{SearchTitle[searchType]}</Title>
                  {searchType === SearchType.ByInput && (
                    <>
                      <CusInputPopup
                        startAdornment={<SearchIcon />}
                        placeholder="Search by Name, ID"
                        value={searchParam.inputValue}
                        onChange={e => setSearchParam({ ...searchParam, inputValue: e.target.value })}
                        endAdornment={searchParam.inputValue && <InputLose onClick={() => clearSearchParamHandle()} />}
                      />
                      <OptionsBox>{options && options}</OptionsBox>
                    </>
                  )}
                  {searchType === SearchType.ByFilter && (
                    <FormGroup
                      sx={{
                        width: '100%',
                        display: 'flex',
                        //  justifyContent: 'space-between',
                        flexDirection: 'row',
                        gap: 20
                      }}
                    >
                      <Checkbox
                        checked={filterValue.current[BoxTypes.PROJECT]}
                        label={FilterLable[BoxTypes.PROJECT]}
                        name={BoxTypes.PROJECT.toString()}
                        onChange={checkBoxChange}
                      />
                      <Checkbox
                        checked={filterValue.current[BoxTypes.USER]}
                        label={FilterLable[BoxTypes.USER]}
                        name={BoxTypes.USER.toString()}
                        onChange={checkBoxChange}
                      />
                      {/* <Checkbox
                      checked={filterValue.current[BoxFilterType.VerifiedOnly]}
                      label={BoxFilterType.VerifiedOnly}
                      name={BoxFilterType.VerifiedOnly}
                      onChange={checkBoxChange}
                    /> */}
                    </FormGroup>
                  )}
                </SearchBox>
              </BlurBox>
            </Collapse>
          )}

          <FormBox>
            {isMd ? (
              <CusSearchBtn onClick={() => formHandle(SearchType.ByInput)}>
                <SearchIcon />
              </CusSearchBtn>
            ) : (
              <CusInputBar
                startAdornment={<SearchIcon onClick={() => formHandle(SearchType.ByInput)} />}
                endAdornment={searchValue && <InputLose onClick={e => clearHandle(SearchType.ByInput, e)} />}
                onFocus={() => {
                  formHandle(SearchType.ByInput)
                }}
                disabled={searchType === SearchType.ByInput}
                value={searchValue}
                placeholder="Search by Name, ID"
                readOnly
              ></CusInputBar>
            )}

            <CusInputBar
              startAdornment={<FilterIcon></FilterIcon>}
              endAdornment={
                showFilterValue() ? <InputLose onClick={e => clearHandle(SearchType.ByFilter, e)} /> : <ArrowBottom />
              }
              onClick={() => {
                formHandle(SearchType.ByFilter)
              }}
              disabled={searchType === SearchType.ByFilter}
              value={showFilterValue()}
              placeholder="Filter"
              readOnly
            ></CusInputBar>
          </FormBox>
        </Container>
      </ClickAwayListener>
    </>
  )
}

export default forwardRef(Search)
