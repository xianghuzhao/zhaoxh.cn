import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Pagination from "../components/pagination"
import { Hr } from "../components/style"
import { rhythm } from "../utils/typography"
import { localeUrl } from "../utils/locale"
import messages from "../locales/messages"

export default class BlogList extends React.Component {
  render() {
    const { locale, postList, numPages, currentPage } = this.props.pageContext

    return (
      <Layout locale={locale}>
        <SEO title={messages[locale].allPosts} />
        {postList.map(({ node, slug }) => {
          const title = node.frontmatter.title || slug
          return (
            <article key={slug}>
              <header>
                <h3
                  style={{
                    marginBottom: rhythm(1 / 4),
                  }}
                >
                  <Link style={{ boxShadow: `none` }} to={slug}>
                    {title}
                  </Link>
                </h3>
                <small>{node.frontmatter.date}</small>
              </header>
              <section>
                <p
                  dangerouslySetInnerHTML={{
                    __html: node.frontmatter.description || node.excerpt,
                  }}
                />
              </section>
              <Hr />
            </article>
          )
        })}
        <Pagination
          prefix={localeUrl(locale, `/blog/`)}
          prefixFirst={localeUrl(locale, `/`)}
          numPages={numPages}
          currentPage={currentPage}
        />
      </Layout>
    )
  }
}
