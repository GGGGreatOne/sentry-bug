import { Box, styled } from '@mui/material'
import useBreakpoint from 'hooks/useBreakpoint'
import dynamic from 'next/dynamic'
const Account = dynamic(() => import('./Account'), { ssr: false })
import { ReactNode } from 'react'

const Container = styled(Box)`
  position: relative;
  display: grid;
  flex-direction: row;
  gap: 40px;
  grid-template-columns: 1fr 334px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 100px;
`

const ContainerMd = styled(Box)`
  display: flex;
  flex-direction: column;
`

interface AccountLayoutProps {
  children: ReactNode
}
const Main = styled(Box)`
  position: relative;
  flex: 1;

  ${props => props.theme.breakpoints.down('md')} {
    padding: 40px 20px;
  }
`
const SideBox = styled(Box)`
  position: relative;
  width: 250px;

  ${props => props.theme.breakpoints.down('lg')} {
    width: 360px;
  }
`
const AccountLayout = ({ children }: AccountLayoutProps) => {
  const isMd = useBreakpoint('md')
  if (isMd) {
    return (
      <ContainerMd>
        <Account />
        <Main>{children}</Main>
      </ContainerMd>
    )
  }
  return (
    <Container>
      <Main>{children}</Main>
      <SideBox>
        <Account />
      </SideBox>
    </Container>
  )
}
export default AccountLayout
