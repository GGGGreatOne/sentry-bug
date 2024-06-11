import { createAction } from '@reduxjs/toolkit'
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
  IBoxPluginBasicItemData,
  IBoxBasicInfoValue,
  IBoxAboutSectionTypeExperienceValue
} from './type'

// basic
export const updateBoxAllData = createAction<IBoxValue>('boxes/updateBoxData')

export const updateBoxAllBasic = createAction<IBoxBasicInfoValue>('boxes/updateBoxAllBasic')

export const updateBoxEditStatus = createAction<boolean>('boxes/updateBoxEditStatus')

export const updateBoxIsTour = createAction<boolean>('boxes/updateBoxIsTour')

export const updateBoxAvatar = createAction<string>('boxes/updateBoxAvatar')

export const updateBoxBackground = createAction<IBackgroundValue>('boxes/updateBoxBackground')

export const updateBoxPluginListName = createAction<number[]>('boxes/updateBoxPluginListName')

// about
export const updateBoxPluginAboutListData = createAction<Array<IPluginAboutData<IBoxAboutSectionTypeName>>>(
  'boxes/updateBoxPluginAboutListData'
)

export const updateBoxPluginAboutHotContent = createAction<IBoxAboutSectionTypeSocialContentValue>(
  'boxes/updateBoxPluginAboutHotContent'
)

export const updateBoxPluginAboutTokenomic = createAction<IBoxAboutSectionTypeTokenomicValue>(
  'boxes/updateBoxPluginAboutTokenomic'
)

export const updateBoxPluginAboutRoadmap = createAction<IBoxAboutSectionTypeRoadmapValue>(
  'boxes/updateBoxPluginAboutRoadmap'
)

export const updateBoxPluginAboutTeam = createAction<IBoxAboutSectionTypeTeamValue>('boxes/updateBoxPluginAboutTeam')

export const updateBoxPluginAboutFriends = createAction<IBoxAboutSectionTypeTeamValue>(
  'boxes/updateBoxPluginAboutFriends'
)

export const updateBoxPluginAboutEducation = createAction<IBoxAboutSectionTypeExperienceValue>(
  'boxes/updateBoxPluginAboutEducation'
)

export const updateBoxPluginAboutExperience = createAction<IBoxAboutSectionTypeExperienceValue>(
  'boxes/updateBoxPluginAboutExperience'
)

export const updateBoxPluginSocailTeam = createAction<IBoxAboutSectionTypeSocialContentValue>(
  'boxes/updateBoxPluginSocailTeam'
)

// add is dataIndex <= -1
export const updateBoxPluginAboutSimpleData = createAction<{
  dataIndex: number
  simpleData: IBoxAboutSectionTypeSimpleValue
}>('boxes/updateBoxPluginAboutSimpleData')

export const addBoxPluginItemData = createAction<IBoxPluginBasicItemData>('boxes/addBoxPluginItemData')

export const delBoxPluginItemData = createAction<number>('boxes/delBoxPluginItemData')

export const toggleBoxPluginItemDisplay = createAction<number>('boxes/toggleBoxPluginItemDisplay')
