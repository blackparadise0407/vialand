import { CallbackDoc } from 'react-google-drive-picker/dist/typeDefs'

export const getFilesMetadata = async (files: CallbackDoc[], token: string) => {
  return Promise.all(
    files.map((file) =>
      fetch(
        `https://www.googleapis.com/drive/v2/files/${file.id}?fields=embedLink`,
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
        data.map((x) => x.embedLink as string),
      ),
    )
    .catch()
}
