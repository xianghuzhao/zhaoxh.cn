import React from "react"
import Link from "gatsby-link"
import styled from "styled-components"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faWeixin } from "@fortawesome/free-brands-svg-icons"
import { faRss } from "@fortawesome/free-solid-svg-icons"

import messages from "../locales/messages"
import { otherLocale, localeUrl } from "../utils/locale"
import Avatar from "./avatar"

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
  font-size: 1.2rem;
  a {
    color: darkgray;
    &:hover {
      color: gray;
    }
  }
`

const SocialIcon = styled(FontAwesomeIcon)`
  fill: darkgray;

  &:hover {
    fill: gray;
  }
`

const NavMenu = ({ locale, otherLink }) => {
  let finalOtherLink
  if (otherLink) {
    finalOtherLink = otherLink
  } else {
    finalOtherLink = localeUrl(otherLocale(locale), `/`)
  }

  return (
    <NavMenuStyled>
      <MenuList>
        <MenuItem>
          <Link to={localeUrl(locale, `/`)}>{messages[locale].homePage}</Link>
        </MenuItem>
        <MenuItem>
          <a href="//github.com/xianghuzhao">{messages[locale].work}</a>
        </MenuItem>
        <MenuItem>
          <Link to={localeUrl(locale, `/tags/`)}>{messages[locale].tags}</Link>
        </MenuItem>
        <MenuItem>
          <Link to={localeUrl(locale, `/about/`)}>
            {messages[locale].about}
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to={finalOtherLink}>
            {messages[locale].alternativeLanguage}
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
      <Avatar locale={locale} />
      <NavMenu locale={locale} otherLink={otherLink} />
      <SocialMenu />
    </header>
  </SidebarStyled>
)

export default Sidebar
