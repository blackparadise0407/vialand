import config from 'config'

export async function filesUpload(files: IFile[]) {
  const { cloudinary } = config
  const url =
    'https://api.cloudinary.com/v1_1/' + cloudinary.cloudName + '/image/upload'
  const promises = files.map((file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', cloudinary.uploadPreset)
    formData.append('public_id', file.id)
    formData.append('api_key', cloudinary.apiKey)

    return fetch(url, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json())
  })
  return Promise.all(promises).then((res) => res as ICloudinaryResponse[])
}
