import { LoadingRows as BaseLoadingRows } from '../Loader/styled'
import styled from 'styled-components'

import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'

const SearchIcon = `url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z" fill="%239B9B9B" /></svg>')`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
`

export const MenuItem = styled(RowBetween)<{ dim?: boolean }>`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme }) => theme.deprecated_hoverDefault};
  }
  opacity: ${({ disabled, selected, dim }) => (dim || disabled || selected ? 0.4 : 1)};
`

export const SearchInput = styled.input`
  background: no-repeat scroll 7px 7px;
  background-image: ${SearchIcon};
  background-size: 20px 20px;
  background-position: 12px center;
  position: relative;
  display: flex;
  padding: 16px;
  padding-left: 40px;
  height: 40px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background-color: ${({ theme }) => theme.surface2};
  border: none;
  outline: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.neutral1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.surface3};
  -webkit-appearance: none;
  font-weight: 485;

  font-size: 16px;

  ::placeholder {
    color: ${({ theme }) => theme.neutral3};
    font-size: 16px;
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.surface3};
    background-color: ${({ theme }) => theme.surface2};
    outline: none;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.surface3};
`

export const LoadingRows = styled(BaseLoadingRows)`
  grid-column-gap: 0.5em;
  grid-template-columns: repeat(12, 1fr);
  max-width: 960px;
  padding: 12px 20px;

  & > div:nth-child(4n + 1) {
    grid-column: 1 / 8;
    height: 1em;
    margin-bottom: 0.25em;
  }
  & > div:nth-child(4n + 2) {
    grid-column: 12;
    height: 1em;
    margin-top: 0.25em;
  }
  & > div:nth-child(4n + 3) {
    grid-column: 1 / 4;
    height: 0.75em;
  }
`
