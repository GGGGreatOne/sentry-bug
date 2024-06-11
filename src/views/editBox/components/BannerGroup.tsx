import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
// import Banner1 from 'assets/images/boxes/banner1.png'
// import Banner2 from 'assets/images/boxes/banner2.png'
// import Banner3 from 'assets/images/boxes/banner3.png'
// import Banner5 from 'assets/images/boxes/banner4.png'
// import Banner4 from 'assets/images/boxes/banner5.png'
// import { BannerImg } from 'state/boxes/type'
import { ChangeEvent, useCallback } from 'react'
import { Box, styled } from '@mui/material'
const Image = styled('img')(() => ({}))
interface BannerItem {
  value: string
}

const bannerList: BannerItem[] = [
  {
    value: '/banner1.png'
  },
  {
    value: '/banner2.png'
  },
  {
    value: '/banner3.png'
  },
  {
    value: '/banner5.png'
  }
  // {
  //   value: Banner5.src
  // }
]

export default function ControlledRadioButtonsGroup({
  width,
  value,
  imgWidth = 120,
  imgHeight = 40,
  onChange
}: {
  width?: number | string
  value?: string
  imgWidth?: number | string
  imgHeight?: number | string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
    },
    [onChange]
  )

  return (
    <FormControl sx={{ width: width }}>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        {bannerList.map((item, index) => {
          return (
            <FormControlLabel
              key={index}
              value={item.value}
              control={<Radio />}
              label={
                <Box
                  width={imgWidth}
                  height={imgHeight}
                  borderRadius={4}
                  border={value === item.value ? '1px solid var(--ps-text-100)' : '1px solid var(--ps-text-20)'}
                >
                  <Image
                    src={item.value}
                    width={'100%'}
                    height={'100%'}
                    alt=""
                    style={{ borderRadius: 4, objectFit: 'cover' }}
                  />
                </Box>
              }
              sx={{ margin: '0 0 20px 0' }}
            />
          )
        })}
      </RadioGroup>
    </FormControl>
  )
}
