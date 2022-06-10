export const enumToArray = (eN: any) => {
  return Object.keys(eN).map((key) => eN[key])
}

export const isMobile = () => {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return true
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua,
    )
  ) {
    return true
  } else if (
    navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform)
  ) {
    return true
  }
  return false
}
