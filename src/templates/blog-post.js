import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteUrl = this.props.data.site.siteMetadata.siteUrl
    const { slug, locale, previous, next } = this.props.pageContext

    const allPost = this.props.data.allMarkdownRemark.edges
    const otherPost = allPost.find(p => p.node.fields.locale !== locale)
    const otherLocale = otherPost ? otherPost.node.fields.locale : null
    const otherLink = otherPost ? otherPost.node.fields.slug : null

    return (
      <Layout
        location={this.props.location}
        title={siteTitle}
        locale={locale}
        otherLocale={otherLocale}
        otherLink={otherLink}
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
          <footer>
            <p className="post-permalink">
              <strong>permalink : </strong>
              <Link to={slug} title={post.frontmatter.title}>
                {`${siteUrl}${slug}`}
              </Link>
            </p>
            {otherPost && (
              <p className="post-translation">
                <strong>Translation : </strong>
                <Link to={otherPost.node.fields.slug}>
                  {`${siteUrl}${otherPost.node.fields.slug}`}
                </Link>
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
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
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
  query BlogPostBySlug($slug: String!, $dateFormat: String!, $pageID: String!) {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: $dateFormat)
        description
      }
    }
    allMarkdownRemark(filter: { fields: { pageID: { eq: $pageID } } }) {
      edges {
        node {
          fields {
            slug
            locale
          }
        }
      }
    }
  }
`
