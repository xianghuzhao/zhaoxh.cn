import React from "react"
import styled from "styled-components"

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

const Layout = ({ children, locale, otherLink }) => (
  <div>
    <div>
      <Sidebar locale={locale} otherLink={otherLink} />
    </div>
    <MainFrame>
      <MainBody>
        <main className="post-list">{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </MainBody>
    </MainFrame>
  </div>
)

export default Layout
