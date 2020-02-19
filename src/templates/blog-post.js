import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import messages from "../locales/messages"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteUrl = this.props.data.site.siteMetadata.siteUrl
    const {
      slug,
      otherSlug,
      hasTranslation,
      locale,
      previous,
      next,
    } = this.props.pageContext

    return (
      <Layout
        location={this.props.location}
        title={siteTitle}
        locale={locale}
        otherLink={otherSlug}
      >
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <article>
          <header>
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
              {post.frontmatter.title}
            </h1>
            <p
              style={{
                ...scale(-1 / 5),
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.date}
            </p>
          </header>
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <footer
            className="post-link"
            style={{
              fontSize: rhythm(0.5),
              paddingTop: rhythm(1),
            }}
          >
            <p className="post-permalink">
              <strong>{messages[locale].permalink} : </strong>
              <Link to={slug} title={post.frontmatter.title}>
                {`${siteUrl}${slug}`}
              </Link>
            </p>
            {hasTranslation && (
              <p className="post-translation">
                <strong>{messages[locale].alternativePage} : </strong>
                <Link to={otherSlug}>{`${siteUrl}${otherSlug}`}</Link>
              </p>
            )}
          </footer>
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
        </article>

        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              marginLeft: 0,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.slug} rel="prev">
                  ← {previous.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.slug} rel="next">
                  {next.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostByIDAndLocale(
    $postID: String!
    $postLocale: String!
    $dateFormat: String!
  ) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(
      fields: { postID: { eq: $postID }, locale: { eq: $postLocale } }
    ) {
      id
      excerpt(pruneLength: 70)
      html
      frontmatter {
        title
        date(formatString: $dateFormat)
        description
      }
    }
  }
`
