import { Container, styled } from '@mui/material'
import Head from 'next/head'
import HomePage from '../views/home'
import { getClubRecommendList } from 'api/home'
import { RecommendedClubListResponse } from 'api/home/type'
export const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

export async function getServerSideProps() {
  try {
    const res = await getClubRecommendList()
    return {
      props: {
        recommendedClubList: res.data || []
      }
    }
  } catch (error) {
    console.error('🚀 ~ error:', error)
    return {
      props: {
        recommendedClubList: []
      }
    }
  }
}

export default function Page({ recommendedClubList }: { recommendedClubList: RecommendedClubListResponse[] }) {
  return (
    <>
      <Head>
        <title>BounceClub</title>
      </Head>
      <HomePage recommendedClubList={recommendedClubList} />
    </>
  )
}
