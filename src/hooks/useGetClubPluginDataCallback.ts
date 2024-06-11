import { useMemo } from 'react'
import { IBoxValue, IPluginNameType } from 'state/boxes/type'
import { usePluginListDatas } from 'state/pluginListConfig/hooks'

export function useGetClubPluginData(boxId: string, pluginName: IPluginNameType, boxData: IBoxValue) {
  const pluginList = usePluginListDatas()
  const curPlugin = pluginList.list.find(i => i.pluginName === pluginName)
  const _pluginData = useMemo(
    () => boxData?.pluginData.filter(_ => _.pluginId === curPlugin?.id),
    [curPlugin?.id, boxData?.pluginData]
  )

  return _pluginData
}
