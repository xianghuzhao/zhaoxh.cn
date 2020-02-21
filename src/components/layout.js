import React from "react"
import styled from "styled-components"

import Sidebar from "./sidebar"
import Hr from "./hr"

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
        <Footer>Copyright © {new Date().getFullYear()}</Footer>
      </MainBody>
    </MainFrame>
  </div>
)

export default Layout
