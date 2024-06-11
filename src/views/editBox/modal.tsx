import { DialogControl } from 'components/Dialog'
import EditBasicInfoModal from './components/editBasicInfoModal'
import CreateStablecoin from './components/createStableCoin'
import CreateStakingStablecoinPool from './components/createStakingStableCoinPool'
import EditAvatar from './components/editAvatar'
import EditUserInfo from './components/editUserInfo'
import StakeModal from '../../plugins/liquity/pages/components/stabilityPool/StakeModal'
import PluginListModal from '../../plugins/farm/pages/staking/pluginListModal'
import UnstakeModal from '../../plugins/liquity/pages/components/stabilityPool/UnstakeModal'
import SimpleDialog from './components/about/simple/SimpleDialog'
import TeamDialog from './components/about/team/TeamDialog'
import FriendsDialog from './components/about/friends/FriendsDialog'
import SocialDialog from './components/about/social/SocialDialog'
import TokenomicDialog from './components/about/tokenomic/TokenomicDialog'
import RoadmapDialog from './components/about/roadmap/RoadmapDialog'
import EducationDialog from './components/about/education/EducationDialog'
import ExperienceDialog from './components/about/experience/ExperienceDialog'
import AddSection from './components/about/AddSection'
import CreateProjectBoxModal from './components/createProjectBoxModal'
import SelectTokenModal from './components/selectStablecoinModal'
import ClubHistoryModal from './components/ClubHistoryModal'
import IntermediatePageModal from './components/intermediatePageModal'
import GuidanceModal from '../../components/QuickTour/GuidanceModal'
import HomeGuidanceModal from '../../components/QuickTour/HomeGuidanceModal'
import HomeEndModal from '../../components/QuickTour/HomeEndModal'
import AddPlugin from './components/addPlugin'
import MyDisperse from 'plugins/tokenToolBox/pages/components/MyDisperse'
import TokenMinter from 'plugins/tokenToolBox/pages/components/TokenMinter'
import MyLock from 'plugins/tokenToolBox/pages/components/MyLock'
import EditTokenImage from 'plugins/tokenToolBox/pages/components/EditTokenImage'
import TokenInfo from 'plugins/tokenToolBox/pages/components/tokenInfo'
import Transfer from 'plugins/tokenToolBox/pages/components/transfer'
import TokenLock from 'plugins/tokenToolBox/pages/components/tokenLock'
import Disperse from 'plugins/tokenToolBox/pages/components/disperse'
import TokenLockerInfo from 'plugins/tokenToolBox/pages/components/tokenLockerInfo'
import EditClubAccessModal from './components/editClubAccessModal'
import ClubAccessModal from './components/ClubAccessModal'
import EditClubWhiteListModal from './components/editClubWhiteListModal'
import CreatePoolModal from '../../plugins/bitFarm/pages/staking/createPoolModal'
import StakeTokenModal from '../../plugins/bitFarm/pages/staking/stakeTokenModal'
import UnStakeTokenModal from '../../plugins/bitFarm/pages/staking/unStakeTokenModal'
import SelectTokenDialog from 'plugins/tokenToolBox/pages/components/selectTokenDialog'

export const viewControl = new DialogControl({
  AddPlugin,
  EditBasicInfoModal,
  EditAvatar,
  CreateStablecoin,
  SelectTokenModal,
  CreateStakingStablecoinPool,
  SimpleDialog,
  TeamDialog,
  StakeModal,
  PluginListModal,
  UnstakeModal,
  AddSection,
  CreateProjectBoxModal,
  SocialDialog,
  TokenomicDialog,
  RoadmapDialog,
  ClubHistoryModal,
  IntermediatePageModal,
  EditUserInfo,
  FriendsDialog,
  EducationDialog,
  ExperienceDialog,
  GuidanceModal,
  HomeGuidanceModal,
  HomeEndModal,
  MyDisperse,
  TokenMinter,
  MyLock,
  EditTokenImage,
  TokenInfo,
  Transfer,
  TokenLock,
  Disperse,
  TokenLockerInfo,
  EditClubAccessModal,
  ClubAccessModal,
  EditClubWhiteListModal,
  CreatePoolModal,
  StakeTokenModal,
  UnStakeTokenModal,
  SelectTokenDialog
})
