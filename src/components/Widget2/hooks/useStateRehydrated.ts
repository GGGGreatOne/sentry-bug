import { useAppSelector } from 'state/hooks'

export function useStateRehydrated() {
  return useAppSelector(state => state.swap2._persist.rehydrated)
}
