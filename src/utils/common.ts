export const enumToArray = (eN: any) => {
  return Object.keys(eN).map((key) => eN[key])
}
