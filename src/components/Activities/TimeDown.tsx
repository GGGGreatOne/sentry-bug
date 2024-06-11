import { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { ONE_DAY_TIMESTAMP } from '../../plugins/leverage/constants'

const leftTime = (e: number): TimeDown => {
  const Time = {
    day: '00',
    hour: '00',
    minutes: '00',
    seconds: '00'
  }
  let Distance = e

  if (Distance > 0) {
    Time.day = Math.floor(Distance / 86400000).toString()
    Distance -= Number(Time.day) * 86400000
    Time.hour = Math.floor(Distance / 3600000).toString()
    Distance -= Number(Time.hour) * 3600000
    Time.minutes = Math.floor(Distance / 60000).toString()
    Distance -= Number(Time.minutes) * 60000
    Time.seconds = Math.floor(Distance / 1000).toFixed(0)
    if (Number(Time.day) < 10) {
      Time.day = '0' + Time.day
    }
    if (Number(Time.hour) < 10) {
      Time.hour = '0' + Time.hour
    }
    if (Number(Time.minutes) < 10) {
      Time.minutes = '0' + Time.minutes
    }
    if (Number(Time.seconds) < 10) {
      Time.seconds = '0' + Time.seconds
    }
    return Time
  } else {
    return Time
  }
}

type TimeDown = {
  day: string
  hour: string
  minutes: string
  seconds: string
}

export const TimeDown = ({ currentEpoch, isMd }: { currentEpoch: number; isMd: boolean }) => {
  const [disTime, setDisTime] = useState<TimeDown>({
    day: '00',
    hour: '00',
    minutes: '00',
    seconds: '00'
  })

  useEffect(() => {
    const endTime = currentEpoch + ONE_DAY_TIMESTAMP
    const interval = setInterval(() => {
      const now = new Date().valueOf()
      const time = leftTime(endTime - now)
      setDisTime(time)
    }, 1000)
    return () => clearInterval(interval)
  }, [currentEpoch])

  return (
    <>
      {isMd && (
        <Stack gap={16} flex={'none'} justifyContent={'space-between'}>
          <Typography
            variant="body1"
            sx={{
              fontSize: 15,
              color: 'var(--ps-neutral3)',
              lineHeight: '11px'
            }}
          >
            Lottery ends in
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: 20,
              color: 'var(--ps-text-100)',
              lineHeight: '20px'
            }}
          >
            {disTime.hour}h {disTime.minutes}m {disTime.seconds}s
          </Typography>
        </Stack>
      )}
      {!isMd && (
        <Typography
          variant="h3"
          sx={{
            color: 'var(--ps-text-100)',
            lineHeight: '20px'
          }}
        >
          {disTime.hour}h {disTime.minutes}m {disTime.seconds}s
        </Typography>
      )}
    </>
  )
}
