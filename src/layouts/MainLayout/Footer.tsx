import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { FaFacebookF, FaSkype, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'

type FooterSectionProps = {
  className?: string
  title: string
  children: ReactNode
}

function FooterSection({
  className = '',
  title,
  children,
}: FooterSectionProps) {
  return (
    <div className={className}>
      <h2 className="relative mb-[14px] inline-block text-2xl text-white before:contents-[''] before:absolute before:-bottom-[5px] before:left-0 before:w-[50px] before:h-[2px] before:bg-[red]">
        {title}
      </h2>
      <div className="text-[#999]">{children}</div>
    </div>
  )
}

export default function Footer() {
  const { t } = useTranslation()

  return (
    <div className="bg-[#111]">
      <footer className="p-[40px] md:py-[50px] md:px-[100px] flex justify-between flex-wrap space-x-[30px]">
        <FooterSection className="md:w-[40%]" title="Vialand">
          <p className="text-[#999]">{t('footer.description')}</p>
          <div className="flex gap-5 mt-5">
            <a
              className="w-[40px] h-[40px] grid place-items-center rounded-full text-xl text-white bg-[#EE0007]"
              href="https://www.youtube.com/channel/UC-RgeGg8IXuNBl9gqEeqJoQ"
              target="_blank"
              rel="noreferrer"
            >
              <FaYoutube />
            </a>
            <a
              className="w-[40px] h-[40px] grid place-items-center rounded-full text-xl text-white bg-[#10BEF2]"
              href="/"
              target="_blank"
              rel="noreferrer"
            >
              <FaSkype />
            </a>
            <a
              className="w-[40px] h-[40px] grid place-items-center rounded-full text-xl text-white bg-[#1771E6]"
              href="https://www.facebook.com/vialand.co"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>
          </div>
        </FooterSection>
        <FooterSection className="hidden md:block" title="Quick Links">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.help_center')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.trade_safety')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.rules_to_know')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.privacy_policy')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.contact_help')}
              </Link>
            </li>
          </ul>
        </FooterSection>
        <FooterSection className="hidden md:block" title="Contact Info">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.about')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.career')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.news')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.media')}
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" to="/">
                {t('footer.blog')}
              </Link>
            </li>
          </ul>
        </FooterSection>
      </footer>
      <div className="py-[10px] px-[100px] bg-[#161616]">
        <p className="text-[#999] text-center">
          Nhận Thiết Kế Web App Mobile Android & iOS (0966885501)
        </p>
      </div>
    </div>
  )
}
