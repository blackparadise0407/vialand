import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'

export const getFilesMetadata = (
  files: CallbackDoc[],
  token: string,
): Promise<IGoogleDocsResponse[]> => {
  return Promise.all(
    files.map((file) =>
      fetch(
        `https://www.googleapis.com/drive/v2/files/${file.id}?fields=thumbnailLink,embedLink,id`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    ),
  )
    .then((responses) =>
      Promise.all(responses.map((response) => response.json())).then((data) =>
        data.map(
          ({ id, thumbnailLink, embedLink, webViewLink }) =>
            ({
              id,
              thumbnailLink,
              embedLink,
              webViewLink,
            } as IGoogleDocsResponse),
        ),
      ),
    )
    .catch()
}

export const removeFileFromDriveById = (
  fileId: string,
  token: string,
): Promise<boolean> => {
  return fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => true)
    .catch(() => false)
}

export const removeNewsAssets = (news: IProperty, token: string) => {
  const deleteAssetsKey: Array<keyof IProperty> = [
    'video',
    'images',
    'paymentImage',
  ]
  const promises: Array<Promise<any>> = []
  deleteAssetsKey.forEach((key) => {
    const data = news[key] as IKeyValue
    if (data) {
      if (Array.isArray(data)) {
        data.forEach((item) =>
          promises.push(removeFileFromDriveById(item.id, token)),
        )
      } else {
        if (Object.keys(data).length && data?.id) {
          promises.push(removeFileFromDriveById(data?.id, token))
        }
      }
    }
  })
  return promises
}

// export const getEmbedGoogleMediaLink = (selfLink: string): Promise<string> => {
//   return fetch(
//     `https://gdriveplayer.to/embed2.php?link=${selfLink}&subtitle=&poster=&jsonsubtitle=&encrypt=yes`,
//   )
//     .then((r) => r.text())
//     .then((data) => {
//       const regex = new RegExp(/(?<=src=")(.*?)(?=\")/g)
//       return data.match(regex)[0]
//     })
//     .catch(() => undefined)
// }
