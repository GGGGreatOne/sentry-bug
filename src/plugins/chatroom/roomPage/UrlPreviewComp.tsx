import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { api } from '../api'

type UrlPreviewProps = {
  url: string
  ts: number
  previewStart: () => void
  openUrlPreviewWidget: (url: string) => void
  onPreviewLoaded: (load: boolean) => void
  isRight: boolean
  message: any
  time: string
}

const UrlPreviewComp = (props: UrlPreviewProps) => {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    let isMounted = true
    if (props.url && props.ts) {
      const fetchPreview = async () => {
        const res = await api.getUrlPreview(props.url, props.ts)
        if (!res) return
        if (!isMounted) return
        const isMoneyGun = res['og:site_nam'] === 'Money Gun'
        let url = res['og:image']
        let description = res['og:description']
        const title = res['og:title']
        if (res.nft_meta && res.nft_meta.contract_address) {
          url = res.nft_meta.image_url
          description = res.nft_meta.description
        }
        if (url && /^mxc\:\/\/.+/.test(url)) {
          url = api._client.mxcUrlToHttp(url)
        }
        if (isMoneyGun) {
          url = 'https://hs.sending.me/_api/media/r0/download/hs.sending.me/TeqfFZWpSpFrwSUnNHlVhCDS'
        }
        setUrl(url)
        setTitle(title)
        setDescription(description)
      }
      props.previewStart()
      fetchPreview().then()
    }
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.url, props.ts])

  const handleClick = () => {
    // window.open(props.url)
    props.openUrlPreviewWidget(url)
    // if (e?.target?.href) {
    //   props.openUrlPreviewWidget(e.target.href);
    //   e.stopPropagation();
    //   e.preventDefault();
    // }
  }

  const onImageLoad = () => {
    if (props.onPreviewLoaded) {
      props.onPreviewLoaded(true)
    }
  }

  const onImageError = () => {
    if (props.onPreviewLoaded) {
      props.onPreviewLoaded(false)
    }
  }

  return (
    <Box>
      <div className="urlPreviewComp" style={{ alignItems: props.isRight ? 'flex-end' : 'flex-start' }}>
        <div className={props.isRight ? 'urlPreview_url_right' : 'urlPreview_url_left'}>
          {/* <a className={props.isRight ? "urlPreview_url_a_right" : "urlPreview_url_a_left"} onClick={handleClick}>{props.message}</a> */}
          {props.message}
          <span className={['urlPreview_url_time', props.isRight ? 'urlPreview_url_time_right' : ''].join(' ')}>
            &nbsp;{props.time}
          </span>
        </div>
        {(url || title || description) && (
          <div className="urlPreview_card" onClick={handleClick}>
            {url && (
              /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
              <img
                className="urlPreview_card_img"
                style={{ maxWidth: '100%' }}
                src={`${url}`}
                onLoad={onImageLoad}
                onError={onImageError}
                alt=""
              />
            )}
            {title && (
              <div className={props.isRight ? 'urlPreview_card_title_right' : 'urlPreview_card_title_left'}>
                {title}
              </div>
            )}
            {description && <div className="urlPreview_card_description">{description}</div>}
          </div>
        )}
      </div>
    </Box>
  )
}

export default UrlPreviewComp
