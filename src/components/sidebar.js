import React from "react"
import Link from "gatsby-link"

import locales from "../locales/lang"
import messages from "../locales/messages"

import MailIcon from "../../content/assets/icon/mail.svg"
import GithubIcon from "../../content/assets/icon/github.svg"
import WeChatIcon from "../../content/assets/icon/wechat.svg"
import RSSIcon from "../../content/assets/icon/rss.svg"

const NavMenu = ({ locale, otherLocale, otherLink }) => {
  const finalOtherLink =
    otherLink || (otherLocale === locales.default ? `/` : `/${otherLocale}/`)
  console.log(otherLink || "hehe")
  console.log(otherLocale === locales.default ? `/` : `/${otherLocale}/`)

  return (
    <nav>
      <ul>
        <li>
          <Link to={`/`}>{messages[locale].home_page}</Link>
        </li>
        <li>
          <a href="//github.com/xianghuzhao">{messages[locale].work}</a>
        </li>
        <li>
          <Link to={`/tags/`}>{messages[locale].tag}</Link>
        </li>
        <li>
          <Link to={finalOtherLink}>
            {messages[locale].alternative_language}
          </Link>
        </li>
      </ul>
    </nav>
  )
}

const SocialMenu = () => (
  <nav className="social-menu">
    <ul className="social-list">
      <li className="social-item">
        <a href="mailto:xianghuzhao@gmail.com" title="Email">
          <MailIcon className="social-icon" width="1.2em" height="1.2em" />
        </a>
      </li>
      <li className="social-item">
        <a href="//github.com/xianghuzhao" title="Github">
          <GithubIcon className="social-icon" width="1.2em" height="1.2em" />
        </a>
      </li>
      <li className="social-item">
        <Link to={`/img/qrcode.png`} title="WeChat">
          <WeChatIcon className="social-icon" width="1.2em" height="1.2em" />
        </Link>
      </li>
      <li className="social-item">
        <Link to={`/rss.xml`} title="RSS">
          <RSSIcon className="social-icon" width="1.2em" height="1.2em" />
        </Link>
      </li>
    </ul>
  </nav>
)

class Sidebar extends React.Component {
  render = () => {
    const { locale, otherLocale, otherLink } = this.props
    return (
      <div className="sidebar">
        <header>
          <NavMenu
            locale={locale}
            otherLocale={otherLocale}
            otherLink={otherLink}
          />
          <SocialMenu />
        </header>
      </div>
    )
  }
}

export default Sidebar
