import { ChangeEvent, memo } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from 'i18next'

import { SK_LANGUAGE } from 'constants/common'

type HeaderProps = { collapsed: boolean; onCollapsed: () => void }

export default memo(function Header({ collapsed, onCollapsed }: HeaderProps) {
  const { t, i18n } = useTranslation()

  const handleSelectLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value
    changeLanguage(lang)
    localStorage.setItem(SK_LANGUAGE, lang)
  }

  return (
    <div className="w-full h-[88px] sticky top-0 flex justify-around items-center bg-[#5d4954] z-50">
      <Link to="/">
        <h3 className="text-xl font-semibold text-white tracking-widest">
          ViaLand
        </h3>
      </Link>

      <ul
        className={clsx(
          'nav md:nav-md lg:w-[40%] text-white text-base whitespace-nowrap bg-[#5d4954] z-50',
          collapsed && 'nav--active',
        )}
      >
        <li>
          <Link to="/">{t('home_page')}</Link>
        </li>
        <li>
          <Link to="/nha-dat">{t('land')}</Link>
        </li>
        <li>
          <Link to="/cho-thue">{t('rent')}</Link>
        </li>
        <li>
          <Link to="/dang-tin">{t('post_news')}</Link>
        </li>
      </ul>
      <div className="flex items-center gap-5">
        <select
          name="language"
          value={i18n.language}
          onChange={handleSelectLanguage}
        >
          <option value="en">{t('english')}</option>
          <option value="vi">{t('vietnamese')}</option>
        </select>
        <img className="w-6 h-4" src={`/${i18n.language}.jpg`} alt="" />
        <AiOutlineMenu
          className="cursor-pointer select-none block md:hidden"
          color="#fff"
          size={30}
          onClick={onCollapsed}
        />
      </div>
    </div>
  )
})
