import React from "react"
import styled from "styled-components"

import messages from "../locales/messages"
import Sidebar from "./sidebar"
import { Hr } from "./style"

const MainFrame = styled.div`
  position: relative;
  margin-left: 14rem;
  margin-right: auto;
  width: calc(100% - 14rem);
  padding: 1.5rem 2rem;
`

const MainBody = styled.div`
  margin: auto;
  min-width: 240px;
  max-width: 900px;
  padding: 1.5rem 2rem;
`

const Footer = styled.footer`
  text-align: center;
`

const Layout = ({ children, locale, otherLink }) => (
  <div>
    <div>
      <Sidebar locale={locale} otherLink={otherLink} />
    </div>
    <MainFrame>
      <MainBody>
        <main>{children}</main>
        <Hr />
        <Footer>
          © {new Date().getFullYear()}, {messages[locale].builtWith}
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
          {` ${messages[locale].builtWithEnd}`}
        </Footer>
      </MainBody>
    </MainFrame>
  </div>
)

export default Layout
