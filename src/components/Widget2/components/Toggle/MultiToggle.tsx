import styled from 'styled-components'

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'};
  padding: 1px;
  background: #ffffff1a;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  outline: none;
`

export const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0.5rem;
  border-radius: 6px;
  justify-content: center;
  height: 100%;
  background: ${({ isActive }) => (isActive ? 'none' : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.neutral1 : theme.neutral3)};
  font-size: ${({ fontSize }) => fontSize ?? '1rem'};
  font-weight: 535;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.neutral2 : theme.neutral3)};
  }
`
