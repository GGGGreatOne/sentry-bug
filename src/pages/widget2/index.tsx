import dynamic from 'next/dynamic'

const Widget2 = dynamic(() => import('components/Widget2'), { ssr: false })

export default function Widget2page({ boxId = '' }: { boxId: string }) {
  return (
    <>
      <Widget2 boxId={boxId} />
    </>
  )
}
