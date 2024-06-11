import Twitter from 'assets/svg/boxes/twitter.svg'
import Telegram from 'assets/svg/boxes/telegram.svg'
import Medium from 'assets/svg/boxes/medium.svg'
import Discord from 'assets/svg/boxes/discord.svg'
import Facebook from 'assets/svg/boxes/facebook.svg'
import Youtube from 'assets/svg/boxes/youtube.svg'
import { styled } from '@mui/material'

const StyledTwitter = styled(Twitter)<{ color?: string }>(({ color }) => ({
  '& path': {
    fill: color
  }
}))
const StyledTelegram = styled(Telegram)<{ color?: string }>(({ color }) => ({
  '& path': {
    fill: color
  }
}))
const StyledMedium = styled(Medium)<{ color?: string }>(({ color }) => ({
  '& path': {
    fill: color
  }
}))
const StyledDiscord = styled(Discord)<{ color?: string }>(({ color }) => ({
  '& path': {
    fill: color
  }
}))
const StyledFacebook = styled(Facebook)<{ color?: string }>(({ color }) => ({
  '& path': {
    fill: color
  }
}))
const StyledYoutube = styled(Youtube)<{ color?: string }>(({ color }) => ({
  '& path': {
    fill: color
  }
}))

const LinkIcon = ({ type, color, isMd }: { type: string; color?: string; isMd?: boolean }) => {
  if (type === 'twitter') {
    return <StyledTwitter color={color} transform={isMd ? 'scale(.8)' : 'scale(1)'} />
  } else if (type === 'telegram') {
    return <StyledTelegram color={color} transform={isMd ? 'scale(.8)' : 'scale(1)'} />
  } else if (type === 'medium') {
    return <StyledMedium color={color} transform={isMd ? 'scale(.8)' : 'scale(1)'} />
  } else if (type === 'discord') {
    return <StyledDiscord color={color} transform={isMd ? 'scale(.8)' : 'scale(1)'} />
  } else if (type === 'facebook') {
    return <StyledFacebook color={color} transform={isMd ? 'scale(.8)' : 'scale(1)'} />
  } else {
    return <StyledYoutube color={color} transform={isMd ? 'scale(.8)' : 'scale(1)'} />
  }
}

export default LinkIcon
