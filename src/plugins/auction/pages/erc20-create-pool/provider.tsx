import { createFixedPriceVal } from 'plugins/auction/plugins/fixed-price/pages/create-fixed-price/createType'
import {
  Actions,
  AuctionTypeToStepMap,
  AuctionTypeToValueMap,
  ICreatePoolParams,
  ProviderDispatchActionType
} from 'plugins/auction/pages/erc20-create-pool/type'
import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { AuctionType, ParticipantStatus } from 'plugins/auction/plugins/fixed-price/constants/type'
interface Props {
  children: ReactNode
}

const initialPoolFormValues: ICreatePoolParams = {
  basic: {
    attachments: '',
    auctionName: '',
    dec: '',
    PCbannerUrl: '',
    MobileBannerUrl: ''
  },
  // The default is fixed price pool
  poolInfo: createFixedPriceVal,
  settings: {
    clubShare: '0',
    whiteListAddress: [],
    participantStatus: ParticipantStatus.Public,
    whitelistWithAmount: ''
  },
  activeTab: { index: 0, tabs: AuctionTypeToStepMap[AuctionType.FIXED_PRICE] },
  auth: {
    poolKey: '',
    signature: '',
    expiredTime: 0,
    merkleRoot: '',
    whiteListCount: 0
  }
}
const reducer = (state: ICreatePoolParams, auction: Actions): ICreatePoolParams => {
  const { payload, type } = auction
  switch (type) {
    case ProviderDispatchActionType.setBasicInfo: {
      return {
        ...state,
        basic: payload.basicInfo
      }
    }
    case ProviderDispatchActionType.setPoolValue: {
      return {
        ...state,
        poolInfo: payload.poolValue ?? AuctionTypeToValueMap[payload.auctionType],
        activeTab:
          state.poolInfo.auctionType === payload.auctionType
            ? state.activeTab
            : { ...state.activeTab, tabs: AuctionTypeToStepMap[payload.auctionType] }
      }
    }
    case ProviderDispatchActionType.setSettingValue: {
      return {
        ...state,
        settings: payload.settingValue
      }
    }
    case ProviderDispatchActionType.nextActive: {
      let curIndex = state.activeTab.index
      const { tabs } = state.activeTab
      return {
        ...state,
        activeTab: { tabs, index: tabs.length - 1 === curIndex ? curIndex : ++curIndex }
      }
    }
    case ProviderDispatchActionType.prevActive: {
      let curIndex = state.activeTab.index
      const { tabs } = state.activeTab
      return {
        ...state,
        activeTab: { tabs, index: !curIndex ? curIndex : --curIndex }
      }
    }
    case ProviderDispatchActionType.setAuth: {
      return {
        ...state,
        auth: { ...payload.auth }
      }
    }
    case ProviderDispatchActionType.resetVal: {
      return {
        ...initialPoolFormValues
      }
    }
    default:
      return state
  }
}
const createParamsContext = createContext<{ state: ICreatePoolParams; dispatch: Dispatch<Actions> | null }>({
  state: initialPoolFormValues,
  dispatch: null
})
const CreatePoolParamsProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialPoolFormValues)
  const val = { dispatch, state }
  return <createParamsContext.Provider value={val}>{children}</createParamsContext.Provider>
}

export const useCreateParams = () => {
  const context = useContext(createParamsContext)

  return context
}
export default CreatePoolParamsProvider
