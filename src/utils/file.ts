export function readFileAsync(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.onerror = reject

    reader.readAsDataURL(file)
  })
}

export function readFileSync(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    return reader.result as string
  }
  reader.onerror = () => {
    throw reader.error
  }
  reader.readAsDataURL(file)
}
