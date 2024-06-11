import { useRequest } from 'ahooks'
import { getBoxJsonData, updateBoxJsonData } from 'api/boxes'
import React from 'react'
import { useDispatch } from 'react-redux'
import { updateBoxAllData } from './actions'
import { IBoxBasicInfoValue, IBoxValue } from './type'
import { initialState, userAbout } from './reducer'
import { toast } from 'react-toastify'
import { useUserInfo } from 'state/user/hooks'
import { BoxTypes } from 'api/boxes/type'

const getBoxBasicInfo = (
  id: string,
  boxId: string | number,
  avatar: string,
  projectName: string,
  introduction?: string,
  bgImage?: string
): IBoxBasicInfoValue => {
  return {
    isTour: true,
    id: id,
    boxId: boxId,
    avatar: avatar,
    projectName: projectName,
    title1: '',
    backgroundImg: bgImage,
    backgroundMobileImg: '',
    textColor: '#D9D9D9',
    introduction: introduction || '',
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
    ]
  }
}
export default function Updater({ selfBoxId, changeNum }: { selfBoxId?: string | number; changeNum: number }) {
  if (!selfBoxId) return null
  return <UpdaterBoxesData selfBoxId={selfBoxId} changeNum={changeNum} />
}

function UpdaterBoxesData({ selfBoxId, changeNum }: { selfBoxId: string | number; changeNum: number }) {
  const dispatch = useDispatch()
  // const [isFirst, setIsFirst] = useState(false)
  const { box } = useUserInfo()
  useRequest(
    async () => {
      const { data, code, msg } = await getBoxJsonData(selfBoxId)
      if (code === 200) {
        const _pluginNameList = data.plugins ? JSON.parse(data.plugins) : initialState.pluginList
        const pluginNameList: number[] = typeof _pluginNameList?.[0] === 'number' ? _pluginNameList : []
        const pluginData = !data.pluginInfo ? initialState.pluginData : JSON.parse(data.pluginInfo)

        const boxValue: IBoxValue = {
          editing: true,
          boxBasicInfo: data.page
            ? { ...JSON.parse(data.page), boxId: selfBoxId }
            : getBoxBasicInfo(
                data.id,
                data.boxId,
                data.avatar,
                data.projectName,
                data.description || '',
                data?.bgImage || ''
              ),
          about: data.about
            ? JSON.parse(data.about)
            : box?.boxType === BoxTypes.PROJECT
              ? initialState.about
              : userAbout,
          pluginList: pluginNameList,
          pluginData
        }
        // if (!data.about) {
        // const initialize = async (boxValue: IBoxValue) => {
        //   const { data: boxInfo } = await getBoxInfo(selfBoxId)

        //   const basicInfo = getBoxBasicInfo(
        //     '',
        //     boxInfo.id,
        //     boxInfo?.avatar || '',
        //     boxInfo?.projectName || '',
        //     boxInfo.description || '',
        //     boxInfo?.bgImage || ''
        //   )
        //   if (boxInfo.plugins) {
        //     boxValue.pluginList = JSON.parse(boxInfo.plugins)
        //   }
        //   boxValue.boxBasicInfo = basicInfo
        //   dispatch(updateBoxAllData(boxValue))
        //   setIsFirst(true)
        // }
        // initialize(boxValue)
        // setIsFirst(true)
        // }
        dispatch(updateBoxAllData(boxValue))
        await updateBoxJsonData(data.boxId, boxValue)
      } else {
        toast.error(msg)
      }
    },
    { refreshDeps: [selfBoxId, changeNum], retryCount: 2, retryInterval: 1000 }
  )

  // useEffect(() => {
  //   if (!isFirst) {
  //     return
  //   }
  //   if (!BoxValue.boxBasicInfo.projectName) {
  //     return
  //   }
  //   const func = async () => {
  //     const { code } = await updateBoxJsonData(BoxValue.boxBasicInfo.boxId, BoxValue)
  //     if (code === 200) {
  //       setIsFirst(false)
  //     }
  //   }
  //   func()
  // }, [BoxValue, isFirst])
  return null
}
