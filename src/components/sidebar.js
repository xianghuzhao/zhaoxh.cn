import React from "react"
import Link from "gatsby-link"
import styled from "styled-components"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faWeixin } from "@fortawesome/free-brands-svg-icons"
import { faRss } from "@fortawesome/free-solid-svg-icons"

import locales from "../locales/lang"
import messages from "../locales/messages"

import avatar from "../../content/assets/image/avatar400.jpg"

const SidebarStyled = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 14rem;
  padding: 1rem;
  text-align: center;
  display: block;
  border-color: lightgray;
  border-right-style: solid;
  border-right-width: 1px;

  ul {
    margin-left: 0;
    list-style: none;
  }
`

const NavMenuStyled = styled.nav`
  padding-top: 2rem;
  text-transform: capitalize;

  .menu-item {
    padding: 1rem 0;
  }
`

const MenuList = styled.ul`
  a {
    color: gray;
    text-decoration: none;
    &:hover {
      color: black;
    }
  }
`

const MenuItem = styled.li`
  padding: 0.5rem 0;
`

const SocialMenuStyled = styled.nav`
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;

  li + li {
    padding-left: 1rem;
  }
`

const SocialList = styled.ul`
  padding: 0;
  line-height: 2;
`

const SocialItem = styled.li`
  display: inline-block;
  font-size: 1rem;
  a {
    color: darkgray;
    &:hover {
      color: gray;
    }
  }
`

const SocialIcon = styled(FontAwesomeIcon)`
  width: 1.2em;
  height: 1.2em;
  fill: darkgray;

  &:hover {
    fill: gray;
  }
`

const Avatar = styled.img`
  margin-top: 3rem;
  width: 90%;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 1px 3px gray;
`

const NavMenu = ({ locale, otherLink }) => {
  let finalOtherLink
  if (otherLink) {
    finalOtherLink = otherLink
  } else {
    const otherLocale = Object.keys(locales.lang).find(l => l !== locale)
    finalOtherLink = otherLocale === locales.default ? `/` : `/${otherLocale}/`
  }

  return (
    <NavMenuStyled>
      <MenuList>
        <MenuItem>
          <Link to={`/`}>{messages[locale].home_page}</Link>
        </MenuItem>
        <MenuItem>
          <a href="//github.com/xianghuzhao">{messages[locale].work}</a>
        </MenuItem>
        <MenuItem>
          <Link to={`/tags/`}>{messages[locale].tag}</Link>
        </MenuItem>
        <MenuItem>
          <Link to={finalOtherLink}>
            {messages[locale].alternative_language}
          </Link>
        </MenuItem>
      </MenuList>
    </NavMenuStyled>
  )
}

const SocialMenu = () => (
  <SocialMenuStyled>
    <SocialList>
      <SocialItem>
        <a href="mailto:xianghuzhao@gmail.com" title="Email">
          <SocialIcon icon={faEnvelope} />
        </a>
      </SocialItem>
      <SocialItem>
        <a href="//github.com/xianghuzhao" title="Github">
          <SocialIcon icon={faGithub} />
        </a>
      </SocialItem>
      <SocialItem>
        <Link to={`/img/qrcode.png`} title="WeChat">
          <SocialIcon icon={faWeixin} />
        </Link>
      </SocialItem>
      <SocialItem>
        <Link to={`/rss.xml`} title="RSS">
          <SocialIcon icon={faRss} />
        </Link>
      </SocialItem>
    </SocialList>
  </SocialMenuStyled>
)

const Sidebar = ({ locale, otherLink }) => (
  <SidebarStyled>
    <header>
      <Avatar src={avatar} alt="Avatar" />
      <NavMenu locale={locale} otherLink={otherLink} />
      <SocialMenu />
    </header>
  </SidebarStyled>
)

export default Sidebar
