import { useRouter } from 'next/router'
import { ROUTES } from 'constants/routes'
import { useCallback } from 'react'
import { ToolsBox } from './index'
import GridSvg from 'assets/svg/boxes/grid.svg'
import ListSvg from 'assets/svg/boxes/list.svg'
const ModelChange = () => {
  const route = useRouter()
  const changeHandle = useCallback(() => {
    if (route.route === ROUTES.clubs.index) {
      route.push(ROUTES.clubs.allClub)
    }
    if (route.route === ROUTES.clubs.allClub) {
      route.push(ROUTES.clubs.index)
    }
  }, [route])

  return (
    <ToolsBox onClick={changeHandle}>
      {route.route === ROUTES.clubs.index && <ListSvg />}
      {route.route === ROUTES.clubs.allClub && <GridSvg />}
    </ToolsBox>
  )
}

export default ModelChange
