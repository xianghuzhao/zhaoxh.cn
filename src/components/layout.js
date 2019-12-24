import React from "react"

import Sidebar from "./sidebar"

import "../styles/layout.scss"

const Layout = ({ children }) => (
  <div>
    <div>
      <Sidebar />
    </div>
    <div className="main-frame">
      <div className="main-body">
        <main className="post-list">{children}</main>
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
