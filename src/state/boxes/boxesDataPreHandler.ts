import {
  IBoxValue,
  IBoxAboutSectionTypeName,
  IBackgroundValue,
  IPluginAboutData,
  IBoxAboutSectionTypeSocialContentValue,
  IBoxAboutSectionTypeTokenomicValue,
  IBoxAboutSectionTypeRoadmapValue,
  IBoxAboutSectionTypeTeamValue,
  IBoxAboutSectionTypeSimpleValue,
  // ILinksValue,
  IBoxPluginBasicItemData,
  IFlag,
  IBoxAboutSectionTypeExperienceValue
} from './type'

export function boxesDataPreHandler(
  _boxState: IBoxValue,
  {
    type,
    value
  }:
    | {
        type: 'updateBoxAvatar'
        value: string
      }
    | {
        type: 'updateBoxIsTour'
        value: boolean
      }
    | {
        type: 'updateBoxBackground'
        value: IBackgroundValue
      }
    | {
        type: 'updateBoxPluginListName'
        value: number[]
      }
    | {
        type: 'updateBoxPluginAboutListData'
        value: IPluginAboutData<IBoxAboutSectionTypeName>[]
      }
    | {
        type: 'updateBoxPluginAboutHotContent'
        value: IBoxAboutSectionTypeSocialContentValue
      }
    | {
        type: 'updateBoxPluginAboutTokenomic'
        value: IBoxAboutSectionTypeTokenomicValue
      }
    | {
        type: 'updateBoxPluginAboutRoadmap'
        value: IBoxAboutSectionTypeRoadmapValue
      }
    | {
        type: 'updateBoxPluginAboutTeam'
        value: IBoxAboutSectionTypeTeamValue
      }
    | {
        type: 'updateBoxPluginAboutFriends'
        value: IBoxAboutSectionTypeTeamValue
      }
    | {
        type: 'updateBoxPluginAboutEducation'
        value: IBoxAboutSectionTypeExperienceValue
      }
    | {
        type: 'updateBoxPluginAboutExperience'
        value: IBoxAboutSectionTypeExperienceValue
      }
    | {
        type: 'updateBoxPluginAboutSimpleData'
        value: {
          dataIndex: number
          simpleData: IBoxAboutSectionTypeSimpleValue
        }
      }
    | {
        type: 'updateBoxPluginAboutSocal'
        value: IBoxAboutSectionTypeSocialContentValue
      }
    | {
        type: 'addBoxPluginItemData'
        value: IBoxPluginBasicItemData
      }
    | {
        type: 'delBoxPluginItemData'
        value: number
      }
    | {
        type: 'toggleBoxPluginItemDisplay'
        value: number
      }
): IBoxValue {
  const boxState: IBoxValue = JSON.parse(JSON.stringify(_boxState))

  switch (type) {
    case 'updateBoxBackground':
      boxState.boxBasicInfo = {
        ...value,
        avatar: boxState.boxBasicInfo.avatar,
        boxId: boxState.boxBasicInfo.boxId,
        isTour: boxState.boxBasicInfo.isTour
      }
      break
    case 'updateBoxAvatar':
      boxState.boxBasicInfo.avatar = value
      break
    case 'updateBoxIsTour':
      boxState.boxBasicInfo.isTour = value
      break
    case 'updateBoxPluginListName':
      boxState.pluginList = value
      break
    case 'updateBoxPluginAboutListData':
      boxState.about = value
      break
    case 'updateBoxPluginAboutHotContent':
      const curList = boxState.about
      const _hotContentIndex = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.SOCIAL_CONTENT)
      const _val = {
        type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
        value: value
      }
      if (_hotContentIndex <= 1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_hotContentIndex] = _val
      }
      break
    case 'updateBoxPluginAboutTokenomic':
      const curList1 = boxState.about
      const _index1 = curList1.findIndex(item => item.type === IBoxAboutSectionTypeName.TOKENOMIC)
      const _val1 = {
        type: IBoxAboutSectionTypeName.TOKENOMIC,
        value: value
      }
      if (_index1 <= -1) {
        boxState.about.push(_val1)
      } else {
        boxState.about[_index1] = _val1
      }
      break
    case 'updateBoxPluginAboutRoadmap':
      const curList2 = boxState.about
      const _index2 = curList2.findIndex(item => item.type === IBoxAboutSectionTypeName.ROADMAP)
      const _val2 = {
        type: IBoxAboutSectionTypeName.ROADMAP,
        value: value
      }
      if (_index2 <= -1) {
        boxState.about.push(_val2)
      } else {
        boxState.about[_index2] = _val2
      }
      break
    case 'updateBoxPluginAboutTeam':
      const curList3 = boxState.about
      const _index3 = curList3.findIndex(item => item.type === IBoxAboutSectionTypeName.TEAM)
      const _val3 = {
        type: IBoxAboutSectionTypeName.TEAM,
        value: value
      }
      if (_index3 <= -1) {
        boxState.about.push(_val3)
      } else {
        boxState.about[_index3] = _val3
      }
      break
    case 'updateBoxPluginAboutSimpleData':
      const _index4 = value.dataIndex
      const _val4 = {
        type: IBoxAboutSectionTypeName.SIMPLE,
        value: value.simpleData
      }
      if (_index4 <= -1) {
        boxState.about.push(_val4)
      } else {
        boxState.about[_index4] = _val4
      }
      break
    case 'updateBoxPluginAboutSocal':
      const curList5 = boxState.about
      const _index5 = curList5.findIndex(item => item.type === IBoxAboutSectionTypeName.SOCIAL_CONTENT)
      const _val5 = {
        type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
        value: value
      }
      if (_index5 <= -1) {
        boxState.about.push(_val5)
      } else {
        boxState.about[_index5] = _val5
      }
      break
    case 'updateBoxPluginAboutFriends':
      const curList6 = boxState.about
      const _index6 = curList6.findIndex(item => item.type === IBoxAboutSectionTypeName.FRIENDS)
      const _val6 = {
        type: IBoxAboutSectionTypeName.FRIENDS,
        value: value
      }
      if (_index6 <= -1) {
        boxState.about.push(_val6)
      } else {
        boxState.about[_index6] = _val6
      }
      break
    case 'updateBoxPluginAboutEducation':
      const curList7 = boxState.about
      const _index7 = curList7.findIndex(item => item.type === IBoxAboutSectionTypeName.EDUCATION)
      const _val7 = {
        type: IBoxAboutSectionTypeName.EDUCATION,
        value: value
      }
      if (_index7 <= -1) {
        boxState.about.push(_val7)
      } else {
        boxState.about[_index7] = _val7
      }
      break
    case 'updateBoxPluginAboutExperience':
      const curList8 = boxState.about
      const _index8 = curList8.findIndex(item => item.type === IBoxAboutSectionTypeName.EXPERIENCE)
      const _val8 = {
        type: IBoxAboutSectionTypeName.EXPERIENCE,
        value: value
      }
      if (_index8 <= -1) {
        boxState.about.push(_val8)
      } else {
        boxState.about[_index8] = _val8
      }
      break
    case 'addBoxPluginItemData':
      boxState.pluginData.push(value)
      break
    case 'delBoxPluginItemData':
      boxState.pluginData[value].delFlag = IFlag.TRUE
      break
    case 'toggleBoxPluginItemDisplay':
      boxState.pluginData[value].display = boxState.pluginData[value].display ? IFlag.FALSE : IFlag.TRUE
      break
  }
  return boxState
}
