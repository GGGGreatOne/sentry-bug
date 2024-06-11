import { useDispatch, useSelector } from 'react-redux'
import { AppState } from 'state'
import {
  IBackgroundValue,
  IBoxAboutSectionTypeSocialContentValue,
  IBoxAboutSectionTypeName,
  IBoxAboutSectionTypeRoadmapValue,
  IBoxAboutSectionTypeSimpleValue,
  IBoxAboutSectionTypeTeamValue,
  IBoxAboutSectionTypeTokenomicValue,
  IBoxValue,
  IPluginAboutData,
  IPluginNameType,
  IBoxPluginBasicItemData,
  IBoxAboutSectionTypeExperienceValue
} from './type'
import {
  updateBoxAvatar,
  updateBoxBackground,
  updateBoxEditStatus,
  updateBoxPluginAboutHotContent,
  updateBoxPluginAboutListData,
  updateBoxPluginAboutRoadmap,
  updateBoxPluginAboutSimpleData,
  updateBoxPluginAboutTeam,
  updateBoxPluginAboutFriends,
  updateBoxPluginAboutEducation,
  updateBoxPluginAboutExperience,
  updateBoxPluginSocailTeam,
  updateBoxPluginAboutTokenomic,
  updateBoxPluginListName,
  addBoxPluginItemData,
  delBoxPluginItemData,
  toggleBoxPluginItemDisplay,
  updateBoxIsTour
} from './actions'
import { useCallback, useMemo } from 'react'
import { boxesDataPreHandler } from './boxesDataPreHandler'
import { getBoxJsonData, updateBoxJsonData } from 'api/boxes'
import { toast } from 'react-toastify'
import { usePluginListDatas } from 'state/pluginListConfig/hooks'
import { useRequest } from 'ahooks'

export function useEditBoxInfo(): IBoxValue {
  const info = useSelector<AppState, AppState['boxes']>(state => state.boxes)
  return info
}

async function saveMyselfBoxJsonData(data: IBoxValue) {
  // todo
  const { code, msg } = await updateBoxJsonData(data.boxBasicInfo.boxId, data)
  if (code !== 200) {
    toast.error(msg)
    throw msg
  }
  toast.warning('You need to submit your changes to update your club information!', {
    className: 'foo-bar'
  })
  return undefined
}

export function useBoxEditStatus() {
  const dispatch = useDispatch()
  const { editing } = useEditBoxInfo()

  const updateBoxEditStatusCallback = useCallback(
    async (editing: boolean) => {
      dispatch(updateBoxEditStatus(editing))
    },
    [dispatch]
  )

  return { editing, updateBoxEditStatusCallback }
}

export function useEditBoxBasicInfo() {
  const dispatch = useDispatch()
  const boxesState = useEditBoxInfo()

  const updateBoxBackgroundCallback = useCallback(
    async (backgroundValue: IBackgroundValue) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxBackground', value: backgroundValue })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxBackground(backgroundValue))
    },
    [boxesState, dispatch]
  )

  const updateBoxAvatarCallback = useCallback(
    async (avatar: string) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxAvatar', value: avatar })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxAvatar(avatar))
    },
    [boxesState, dispatch]
  )

  const updateBoxIsTourCallback = useCallback(
    async (isTour: boolean) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxIsTour', value: isTour })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxIsTour(isTour))
    },
    [boxesState, dispatch]
  )

  return {
    boxBasicInfo: boxesState.boxBasicInfo,
    updateBoxBackgroundCallback,
    updateBoxAvatarCallback,
    updateBoxIsTourCallback
  }
}

export function useEditBoxPluginListName() {
  const dispatch = useDispatch()
  const boxesState = useEditBoxInfo()

  const updateBoxPluginListNameCallback = useCallback(
    async (pluginIds: number[]) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginListName', value: pluginIds })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginListName(pluginIds))
    },
    [boxesState, dispatch]
  )

  return { pluginList: boxesState.pluginList, updateBoxPluginListNameCallback }
}

export function useEditBoxAboutData() {
  const dispatch = useDispatch()
  const boxesState = useEditBoxInfo()
  const aboutDataList: any = useMemo(() => boxesState.about, [boxesState.about])

  const updateBoxAboutSortCallback = useCallback(
    async (aboutData: IPluginAboutData<IBoxAboutSectionTypeName>[]) => {
      dispatch(updateBoxPluginAboutListData(aboutData))
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginAboutListData', value: aboutData })
      await saveMyselfBoxJsonData(preData)
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutHotContentCallback = useCallback(
    async (hotContent: IBoxAboutSectionTypeSocialContentValue) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginAboutHotContent', value: hotContent })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutHotContent(hotContent))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutTokenomicCallback = useCallback(
    async (tokenomicValue: IBoxAboutSectionTypeTokenomicValue) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginAboutTokenomic', value: tokenomicValue })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutTokenomic(tokenomicValue))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutRoadmapCallback = useCallback(
    async (roadmapValue: IBoxAboutSectionTypeRoadmapValue) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginAboutRoadmap', value: roadmapValue })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutRoadmap(roadmapValue))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutTeamCallback = useCallback(
    async (teamValue: IBoxAboutSectionTypeTeamValue) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginAboutTeam', value: teamValue })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutTeam(teamValue))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutFriendsCallback = useCallback(
    async (friendlist: IBoxAboutSectionTypeTeamValue) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginAboutFriends', value: friendlist })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutFriends(friendlist))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutEducationCallback = useCallback(
    async (educationList: IBoxAboutSectionTypeExperienceValue) => {
      const preData = boxesDataPreHandler(boxesState, {
        type: 'updateBoxPluginAboutEducation',
        value: educationList
      })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutEducation(educationList))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutExperienceCallback = useCallback(
    async (educationList: IBoxAboutSectionTypeExperienceValue) => {
      const preData = boxesDataPreHandler(boxesState, {
        type: 'updateBoxPluginAboutExperience',
        value: educationList
      })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutExperience(educationList))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutSimpleDataCallback = useCallback(
    async (dataIndex: number, simpleData: IBoxAboutSectionTypeSimpleValue) => {
      const preData = boxesDataPreHandler(boxesState, {
        type: 'updateBoxPluginAboutSimpleData',
        value: {
          dataIndex,
          simpleData
        }
      })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginAboutSimpleData({ dataIndex, simpleData }))
    },
    [boxesState, dispatch]
  )

  const updateBoxAboutSocalCallback = useCallback(
    async (socalList: IBoxAboutSectionTypeSocialContentValue) => {
      const preData = boxesDataPreHandler(boxesState, { type: 'updateBoxPluginAboutSocal', value: socalList })
      await saveMyselfBoxJsonData(preData)
      dispatch(updateBoxPluginSocailTeam(socalList))
    },
    [boxesState, dispatch]
  )

  return {
    aboutDataList,
    updateBoxAboutSortCallback,
    updateBoxAboutHotContentCallback,
    updateBoxAboutTokenomicCallback,
    updateBoxAboutRoadmapCallback,
    updateBoxAboutTeamCallback,
    updateBoxAboutSimpleDataCallback,
    updateBoxAboutSocalCallback,
    updateBoxAboutFriendsCallback,
    updateBoxAboutEducationCallback,
    updateBoxAboutExperienceCallback
  }
}

export function useEditBoxPluginBitswapData() {
  const dispatch = useDispatch()
  const boxesState = useEditBoxInfo()
  const pluginList = usePluginListDatas()
  const curPlugin = pluginList.list.find(i => i.pluginName === IPluginNameType.Bitswap)
  const _pluginData = useMemo(
    () => boxesState.pluginData.filter(_ => _.pluginId === curPlugin?.id),
    [boxesState.pluginData, curPlugin?.id]
  )

  const updateBoxPluginSwapDataCallback = useCallback(
    async (
      type: 'add' | 'del' | 'toggleDisplay',
      option?: { index?: number; token0?: string; token0Name?: string }
    ) => {
      if (!curPlugin) throw 'Current plugin not found'

      if (type === 'add') {
        if (!option?.token0 || !option.token0Name) throw 'token not found'
        if (_pluginData.some(_ => _.token0Contract?.toLowerCase() === option.token0?.toLowerCase())) {
          return
        }
        if (_pluginData.some(_ => _.token1Contract?.toLowerCase() === option.token0?.toLowerCase())) {
          return
        }
        const swapData: IBoxPluginBasicItemData = {
          boxId: Number(boxesState.boxBasicInfo.boxId),
          sort: 10,
          pluginId: curPlugin.id,
          token0Contract: option.token0,
          token0Name: option.token0Name,
          display: 1
        }

        const preData = boxesDataPreHandler(boxesState, { type: 'addBoxPluginItemData', value: swapData })
        await saveMyselfBoxJsonData(preData)
        dispatch(addBoxPluginItemData(swapData))
      }

      if (!option?.index) throw 'index not found'
      let trueIndex = 0
      for (const key in boxesState.pluginData) {
        if (Object.prototype.hasOwnProperty.call(boxesState.pluginData, key)) {
          const item = boxesState.pluginData[key]
          if (item.pluginId === curPlugin.id) {
            trueIndex = trueIndex + 1
            if (trueIndex === option.index) {
              break
            }
          }
        }
      }
      if (!trueIndex) throw 'True index not found'

      if (type === 'del') {
        const preData = boxesDataPreHandler(boxesState, { type: 'delBoxPluginItemData', value: trueIndex })
        await saveMyselfBoxJsonData(preData)
        dispatch(delBoxPluginItemData(trueIndex))
      }

      if (type === 'toggleDisplay') {
        const preData = boxesDataPreHandler(boxesState, { type: 'toggleBoxPluginItemDisplay', value: trueIndex })
        await saveMyselfBoxJsonData(preData)
        dispatch(toggleBoxPluginItemDisplay(trueIndex))
      }
    },
    [_pluginData, boxesState, curPlugin, dispatch]
  )

  return { swapDataList: _pluginData, updateBoxPluginSwapDataCallback }
}

export function useEditBoxPluginBitleverageData() {
  const dispatch = useDispatch()
  const boxesState = useEditBoxInfo()
  const pluginList = usePluginListDatas()
  const curPlugin = pluginList.list.find(i => i.pluginName === IPluginNameType.Bitleverage)
  const _pluginData = useMemo(
    () => boxesState.pluginData.filter(_ => _.pluginId === curPlugin?.id),
    [boxesState.pluginData, curPlugin?.id]
  )

  const updateBoxPluginBitleverageDataCallback = useCallback(
    async (type: 'add' | 'del', option?: { index?: number; token0?: string }) => {
      if (!curPlugin) throw 'Current plugin not found'

      if (type === 'add') {
        if (!option?.token0) throw 'token not found'
        if (_pluginData.some(_ => _.token0Contract?.toLowerCase() === option.token0?.toLowerCase())) {
          return
        }
        const pluData: IBoxPluginBasicItemData = {
          boxId: Number(boxesState.boxBasicInfo.boxId),
          sort: 10,
          pluginId: curPlugin.id,
          token0Contract: option.token0,
          display: 1
        }
        const preData = boxesDataPreHandler(boxesState, { type: 'addBoxPluginItemData', value: pluData })
        await saveMyselfBoxJsonData(preData)
        dispatch(addBoxPluginItemData(pluData))
      }

      if (type === 'del') {
        if (!option?.index) throw 'index not found'
        let trueIndex = 0
        for (const key in boxesState.pluginData) {
          if (Object.prototype.hasOwnProperty.call(boxesState.pluginData, key)) {
            const item = boxesState.pluginData[key]
            if (item.pluginId === curPlugin.id) {
              trueIndex = trueIndex + 1
              if (trueIndex === option.index) {
                break
              }
            }
          }
        }
        const preData = boxesDataPreHandler(boxesState, { type: 'delBoxPluginItemData', value: trueIndex })
        await saveMyselfBoxJsonData(preData)
        dispatch(delBoxPluginItemData(trueIndex))
      }
    },
    [_pluginData, boxesState, curPlugin, dispatch]
  )

  return { dataList: _pluginData, updateBoxPluginBitleverageDataCallback }
}

export function useEditBoxPluginBitstakingData(): {
  stakingData: IBoxPluginBasicItemData | undefined
  updateBoxPluginStakingDataCallback: (type: 'add') => Promise<void>
} {
  const dispatch = useDispatch()
  const boxesState = useEditBoxInfo()
  const pluginList = usePluginListDatas()
  const curPlugin = pluginList.list.find(i => i.pluginName === IPluginNameType.Bitstaking)
  const _pluginData = useMemo(
    () => boxesState.pluginData.filter(_ => _.pluginId === curPlugin?.id),
    [boxesState.pluginData, curPlugin?.id]
  )

  const updateBoxPluginStakingDataCallback = useCallback(
    async (type: 'add') => {
      if (!curPlugin) throw 'Current plugin not found'
      if (_pluginData.length) return
      if (!boxesState.boxBasicInfo.boxId) return

      if (type === 'add') {
        const stakingData: IBoxPluginBasicItemData = {
          boxId: Number(boxesState.boxBasicInfo.boxId),
          sort: 10,
          pluginId: curPlugin.id,
          display: 1
        }
        const preData = boxesDataPreHandler(boxesState, { type: 'addBoxPluginItemData', value: stakingData })
        await saveMyselfBoxJsonData(preData)
        dispatch(addBoxPluginItemData(stakingData))
      }
    },
    [_pluginData.length, boxesState, curPlugin, dispatch]
  )

  return { stakingData: _pluginData?.[0], updateBoxPluginStakingDataCallback }
}

export function useEditBoxPluginBitstableData(): {
  stableData: IBoxPluginBasicItemData | undefined
  updateBoxPluginStableDataCallback: (
    type: 'add',
    option: {
      sourceBoxAddress?: string
      token0Name?: string
      token0?: string
    }
  ) => Promise<void>
} {
  const dispatch = useDispatch()
  const boxesState = useEditBoxInfo()
  const pluginList = usePluginListDatas()
  const curPlugin = pluginList.list.find(i => i.pluginName === IPluginNameType.Bitstable)
  const _pluginData = useMemo(
    () => boxesState.pluginData.filter(_ => _.pluginId === curPlugin?.id),
    [boxesState.pluginData, curPlugin?.id]
  )

  const updateBoxPluginStableDataCallback = useCallback(
    async (
      type: 'add',
      option: {
        sourceBoxAddress?: string
        token0Name?: string
        token0?: string
      }
    ) => {
      if (!curPlugin) throw 'Current plugin not found'
      if (_pluginData.length) return
      if (!boxesState.boxBasicInfo.boxId) return

      if (type === 'add') {
        const stableData: IBoxPluginBasicItemData = {
          boxId: Number(boxesState.boxBasicInfo.boxId),
          sort: 10,
          pluginId: curPlugin.id,
          sourceBoxAddress: option?.sourceBoxAddress || '',
          token0Name: option?.token0Name || '',
          token0Contract: option?.token0 || '',
          display: 1
        }
        const preData = boxesDataPreHandler(boxesState, { type: 'addBoxPluginItemData', value: stableData })
        await saveMyselfBoxJsonData(preData)
        dispatch(addBoxPluginItemData(stableData))
      }
    },
    [_pluginData.length, boxesState, curPlugin, dispatch]
  )

  return { stableData: _pluginData?.[0], updateBoxPluginStableDataCallback }
}

export const useGetPluginList = (boxId: string, changeNum: number, refresh?: number) => {
  return useRequest(
    async () => {
      if (!boxId) return
      try {
        const res = await getBoxJsonData(boxId)
        return res.data
      } catch (error) {
        return null
      }
    },
    {
      manual: false,
      refreshDeps: [boxId, changeNum, refresh]
    }
  )
}

export const useGetBoxDraftInfo = (boxId: string | number | undefined, refresh?: number) => {
  return useRequest(
    async () => {
      if (!boxId) return
      try {
        const res = await getBoxJsonData(boxId)
        return res.data
      } catch (error) {
        return null
      }
    },
    {
      manual: false,
      refreshDeps: [boxId, refresh],
      ready: !!boxId
    }
  )
}
