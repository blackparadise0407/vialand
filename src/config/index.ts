const config = {
  firebase: {
    appId:
      process.env.REACT_APP_FIREBASE_APP_ID ||
      '1:664321836803:web:bd4fe24ddccc5d7e0d4b36',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'vialand-82e83',
    databaseURL:
      process.env.REACT_APP_FIREBASE_DB_URL ||
      'https://vialand-82e83-default-rtdb.asia-southeast1.firebasedatabase.app',
    authDomain:
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
      'vialand-82e83.firebaseapp.com',
    apiKey:
      process.env.REACT_APP_FIREBASE_API_KEY ||
      'AIzaSyCTyBb1WGhdnQDbxTwijPyajIpqPBD7pO4',
    storageBucket:
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
      'vialand-82e83.appspot.com',
    messagingSenderId:
      process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '664321836803',
  },
  cloudinary: {
    cloudName: process.env.REACT_APP_CLOUDINARY_NAME || 'dig00csrc',
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '789143575217113',
    apiSecret:
      process.env.REACT_APP_CLOUDINARY_API_SECRET ||
      '7dm3F5Xtb2m4ZZofdwjkNHPMRXY',
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'j2tdcxh9',
  },
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  },
}
export default config
