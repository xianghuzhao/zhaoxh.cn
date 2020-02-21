import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import moment from "moment"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Pagination from "../components/pagination"
import Hr from "../components/hr"
import { localeUrl } from "../utils/locale"
import messages from "../locales/messages"

const PostTitle = styled.h3`
  margin-bottom: 0.3rem;
`

const PostDate = styled.small`
  display: block;
  margin-bottom: 0.5rem;
`

export default class BlogList extends React.Component {
  render() {
    const {
      locale,
      otherSlug,
      postList,
      dateFormat,
      numPages,
      currentPage,
    } = this.props.pageContext

    return (
      <Layout locale={locale} otherLink={otherSlug}>
        <SEO title={messages[locale].allPosts} lang={locale} />
        {postList.map(({ node, slug }) => {
          const title = node.frontmatter.title || slug
          return (
            <article key={slug}>
              <header>
                <PostTitle>
                  <Link to={slug}>{title}</Link>
                </PostTitle>
                <PostDate>
                  {moment(node.frontmatter.date).format(dateFormat)}
                </PostDate>
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
