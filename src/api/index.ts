export const getImage = (list: any[]) => {
  return list.map(item => {
    let _temp: any = {}
    try {
      const _temp1 = JSON.parse(item.bgImage || '')
      _temp.bgImage = _temp1?.backgroundImg || '/assets/imgs/components/emptyBox.png'
      _temp.bgMobileImage =
        _temp1?.backgroundMobileImg || _temp1?.backgroundImg || '/assets/imgs/components/emptyBox.png'
    } catch (error) {
      _temp = {
        bgImage: item.bgImage || '/assets/imgs/components/emptyBox.png',
        bgMobileImage: item.bgImage || '/assets/imgs/components/emptyBox.png'
      }
    }
    return Object.assign(item, _temp)
  })
}
