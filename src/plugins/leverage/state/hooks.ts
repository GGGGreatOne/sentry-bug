import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import { ILeverageData, saveLeverageData } from '.'

export function useLeverageStateData() {
  const dispatch = useDispatch()
  const data = useSelector<AppState, AppState['leverageData']>(state => state.leverageData)

  const updateLeverageStateCallback = useCallback(
    (_leverageData: ILeverageData) => {
      dispatch(saveLeverageData(_leverageData))
    },
    [dispatch]
  )

  return { data, updateLeverageStateCallback }
}
