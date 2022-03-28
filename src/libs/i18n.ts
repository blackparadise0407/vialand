import { SK_LANGUAGE } from 'constants/common'
import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    debug: true,
    lng: localStorage.getItem(SK_LANGUAGE),

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
