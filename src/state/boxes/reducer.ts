import { createReducer } from '@reduxjs/toolkit'
import {
  IBoxValue,
  IBoxAboutSectionTypeName,
  IBoxAboutSectionTypeValue,
  IFlag,
  IPluginAboutData,
  IClubPluginId
} from './type'
import BG from 'assets/images/boxes/default-edit-bg.png'
import {
  updateBoxAllBasic,
  updateBoxAllData,
  updateBoxAvatar,
  updateBoxIsTour,
  updateBoxBackground,
  updateBoxEditStatus,
  updateBoxPluginAboutHotContent,
  updateBoxPluginAboutListData,
  updateBoxPluginAboutRoadmap,
  updateBoxPluginAboutSimpleData,
  updateBoxPluginAboutTeam,
  updateBoxPluginAboutTokenomic,
  addBoxPluginItemData,
  updateBoxPluginListName,
  updateBoxPluginSocailTeam,
  delBoxPluginItemData,
  toggleBoxPluginItemDisplay,
  updateBoxPluginAboutExperience,
  updateBoxPluginAboutEducation,
  updateBoxPluginAboutFriends
} from './actions'

export const initialState: IBoxValue = {
  editing: true,
  boxBasicInfo: {
    isTour: false,
    id: '',
    boxId: '',
    avatar: '',
    backgroundImg: BG.src,
    backgroundMobileImg: '',
    textColor: '#D9D9D9',
    introduction: 'Revolutionize the way we experience defi.',
    links: [
      {
        typeName: 'twitter',
        url: ''
      },
      {
        typeName: 'telegram',
        url: ''
      },
      {
        typeName: 'medium',
        url: ''
      },
      {
        typeName: 'discord',
        url: ''
      },
      {
        typeName: 'facebook',
        url: ''
      },
      {
        typeName: 'youtube',
        url: ''
      }
    ],
    projectName: 'ProjectName',
    title1: 'Your DeFi Dreams.'
  },
  about: [
    {
      type: IBoxAboutSectionTypeName.SIMPLE,
      value: {
        title: 'About',
        content: ''
      } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.SIMPLE]
    },
    {
      type: IBoxAboutSectionTypeName.ROADMAP,
      value: {
        style: '0',
        roadmapItem: []
      } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.ROADMAP]
    },
    {
      type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
      value: {
        style: '0',
        socialItem: []
      } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.SOCIAL_CONTENT]
    },
    {
      type: IBoxAboutSectionTypeName.TEAM,
      value: {
        style: '0',
        teamItem: []
      } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.TEAM]
    }
  ],
  pluginList: [IClubPluginId.SendingMe],
  pluginData: []
  // pluginData: {
  //   Bitleverage: {
  //     tradeQuantosIndex: 0,
  //     tradePairIndex: 0
  //   }
  // }
}
export const userAbout: IPluginAboutData<IBoxAboutSectionTypeName>[] = [
  {
    type: IBoxAboutSectionTypeName.SIMPLE,
    value: {
      title: 'About',
      content: ''
    } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.SIMPLE]
  },
  {
    type: IBoxAboutSectionTypeName.EDUCATION,
    value: {
      style: '0',
      experienceItem: []
    } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.EDUCATION]
  },
  {
    type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
    value: {
      style: '0',
      socialItem: []
    } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.SOCIAL_CONTENT]
  },
  {
    type: IBoxAboutSectionTypeName.EXPERIENCE,
    value: {
      style: '0',
      experienceItem: []
    } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.EXPERIENCE]
  },
  {
    type: IBoxAboutSectionTypeName.FRIENDS,
    value: {
      style: '0',
      teamItem: []
    } as IBoxAboutSectionTypeValue[IBoxAboutSectionTypeName.FRIENDS]
  }
]
export default createReducer(initialState, builder =>
  builder
    .addCase(updateBoxEditStatus, (boxState, { payload: editing }) => {
      boxState.editing = editing
    })
    .addCase(updateBoxAllData, (boxState, { payload }) => {
      boxState.editing = payload.editing
      boxState.boxBasicInfo = payload.boxBasicInfo
      boxState.pluginData = payload.pluginData
      boxState.pluginList = payload.pluginList
      boxState.about = payload.about
    })
    .addCase(updateBoxAllBasic, (boxState, { payload }) => {
      boxState.boxBasicInfo = {
        ...payload
      }
    })
    .addCase(updateBoxBackground, (boxState, { payload: backgroundValue }) => {
      boxState.boxBasicInfo = {
        ...backgroundValue,
        avatar: boxState.boxBasicInfo.avatar,
        boxId: boxState.boxBasicInfo.boxId,
        isTour: boxState.boxBasicInfo.isTour
      }
    })
    .addCase(updateBoxAvatar, (boxState, { payload: avatar }) => {
      boxState.boxBasicInfo.avatar = avatar
    })
    .addCase(updateBoxIsTour, (boxState, { payload: isTour }) => {
      boxState.boxBasicInfo.isTour = isTour
    })
    .addCase(updateBoxPluginListName, (boxState, { payload: pluginIds }) => {
      boxState.pluginList = pluginIds
    })
    .addCase(updateBoxPluginAboutListData, (boxState, { payload: listData }) => {
      boxState.about = listData
    })
    .addCase(updateBoxPluginAboutHotContent, (boxState, { payload: hotContentValues }) => {
      const curList = boxState.about
      const _hotContentIndex = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.SOCIAL_CONTENT)
      const _val = {
        type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
        value: hotContentValues
      }
      if (_hotContentIndex <= 1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_hotContentIndex] = _val
      }
    })
    .addCase(updateBoxPluginAboutTokenomic, (boxState, { payload: tokenomicValue }) => {
      const curList = boxState.about
      const _index = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.TOKENOMIC)
      const _val = {
        type: IBoxAboutSectionTypeName.TOKENOMIC,
        value: tokenomicValue
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(updateBoxPluginAboutRoadmap, (boxState, { payload: roadmapValue }) => {
      const curList = boxState.about
      const _index = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.ROADMAP)
      const _val = {
        type: IBoxAboutSectionTypeName.ROADMAP,
        value: roadmapValue
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(updateBoxPluginAboutExperience, (boxState, { payload: value }) => {
      const curList = boxState.about
      const _index = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.EXPERIENCE)
      const _val = {
        type: IBoxAboutSectionTypeName.EXPERIENCE,
        value: value
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(updateBoxPluginAboutEducation, (boxState, { payload: value }) => {
      const curList = boxState.about
      const _index = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.EDUCATION)
      const _val = {
        type: IBoxAboutSectionTypeName.EDUCATION,
        value: value
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(updateBoxPluginAboutFriends, (boxState, { payload: value }) => {
      const curList = boxState.about
      const _index = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.FRIENDS)
      const _val = {
        type: IBoxAboutSectionTypeName.FRIENDS,
        value: value
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(updateBoxPluginAboutTeam, (boxState, { payload: teamValue }) => {
      const curList = boxState.about
      const _index = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.TEAM)
      const _val = {
        type: IBoxAboutSectionTypeName.TEAM,
        value: teamValue
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(updateBoxPluginAboutSimpleData, (boxState, { payload: { dataIndex, simpleData } }) => {
      const _index = dataIndex
      const _val = {
        type: IBoxAboutSectionTypeName.SIMPLE,
        value: simpleData
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(updateBoxPluginSocailTeam, (boxState, { payload: teamValue }) => {
      const curList = boxState.about
      const _index = curList.findIndex(item => item.type === IBoxAboutSectionTypeName.SOCIAL_CONTENT)
      const _val = {
        type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
        value: teamValue
      }
      if (_index <= -1) {
        boxState.about.push(_val)
      } else {
        boxState.about[_index] = _val
      }
    })
    .addCase(addBoxPluginItemData, (boxState, { payload }) => {
      boxState.pluginData.push(payload)
    })
    .addCase(delBoxPluginItemData, (boxState, { payload: index }) => {
      boxState.pluginData[index].delFlag = IFlag.TRUE
    })
    .addCase(toggleBoxPluginItemDisplay, (boxState, { payload: index }) => {
      boxState.pluginData[index].display = boxState.pluginData[index].display ? IFlag.FALSE : IFlag.TRUE
    })
)
