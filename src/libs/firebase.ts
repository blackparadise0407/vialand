import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'

import config from 'config'

const {
  firebase: {
    apiKey,
    appId,
    databaseURL,
    projectId,
    storageBucket,
    authDomain,
    messagingSenderId,
  },
} = config

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
