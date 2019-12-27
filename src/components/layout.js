import React from "react"

import Sidebar from "./sidebar"
import { rhythm } from "../utils/typography"

import "../styles/layout.scss"

const Layout = ({ children, locale, otherLocale, otherLink }) => (
  <div>
    <div>
      <Sidebar
        locale={locale}
        otherLocale={otherLocale}
        otherLink={otherLink}
      />
    </div>
    <div className="main-frame">
      <div className="main-body">
        <main className="post-list">{children}</main>
        <hr
          style={{
            marginTop: rhythm(1),
          }}
        />
        <footer className="footer">
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </div>
  </div>
)

export default Layout
