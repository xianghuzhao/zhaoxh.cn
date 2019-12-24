import React from "react"
import Link from "gatsby-link"

import MailIcon from "../../content/assets/icon/mail.svg"
import GithubIcon from "../../content/assets/icon/github.svg"
import WeChatIcon from "../../content/assets/icon/wechat.svg"
import RSSIcon from "../../content/assets/icon/rss.svg"

const NavMenu = () => (
  <nav>
    <ul>
      <li>
        <Link to={`/`}>Home</Link>
      </li>
      <li>
        <a href="//github.com/xianghuzhao">Work</a>
      </li>
      <li>
        <Link to={`/tags/`}>Tag</Link>
      </li>
      <li>
        <Link to={`/tags/`}>tag</Link>
      </li>
    </ul>
  </nav>
)

const SocialMenu = () => (
  <nav className="social-menu">
    <ul className="social-list">
      <li className="social-item">
        <a href="mailto:xianghuzhao@gmail.com" title="Email">
          <MailIcon className="social-icon" width="1em" height="1em" />
        </a>
      </li>
      <li className="social-item">
        <a href="//github.com/xianghuzhao" title="Github">
          <GithubIcon className="social-icon" width="1em" height="1em" />
        </a>
      </li>
      <li className="social-item">
        <Link to={`/img/qrcode.png`} title="WeChat">
          <WeChatIcon className="social-icon" width="1em" height="1em" />
        </Link>
      </li>
      <li className="social-item">
        <Link to={`/rss.xml`} title="RSS">
          <RSSIcon className="social-icon" width="1em" height="1em" />
        </Link>
      </li>
    </ul>
  </nav>
)

const Sidebar = () => (
  <div className="sidebar">
    <header>
      <NavMenu />
      <SocialMenu />
    </header>
  </div>
)

export default Sidebar
