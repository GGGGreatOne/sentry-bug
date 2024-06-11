import Column from '../../Column'
// import UniswapXBrandMark from '../../Logo/UniswapXBrandMark'
import { RowBetween, RowFixed } from '../../Row'
import Toggle from '../../Toggle'
import { RouterPreference } from '../../../state/routing/types'
import { useRouterPreference } from '../../../state/user/hooks'
import { ThemedText } from '../../../theme/components'

export default function RouterPreferenceSettings() {
  const [routerPreference, setRouterPreference] = useRouterPreference()

  return (
    <RowBetween gap="sm">
      <RowFixed>
        <Column gap="xs">
          {/* <ThemedText.BodySecondary>
            <UniswapXBrandMark />
          </ThemedText.BodySecondary> */}
          <ThemedText.BodySmall color="neutral2">
            <>When available, aggregates liquidity sources for better prices and gas free swaps.</>{' '}
          </ThemedText.BodySmall>
        </Column>
      </RowFixed>
      <Toggle
        id="toggle-uniswap-x-button"
        isActive={routerPreference === RouterPreference.X}
        toggle={() => {
          setRouterPreference(routerPreference === RouterPreference.X ? RouterPreference.API : RouterPreference.X)
        }}
      />
    </RowBetween>
  )
}
