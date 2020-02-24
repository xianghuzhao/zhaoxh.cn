import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import Hr from "../components/hr"
import TagList from "../components/taglist"
import License from "../components/license"
import messages from "../locales/messages"

const Footer = styled.footer`
  font-size: 0.8rem;
  padding-top: 1.5rem;
`

const PrevNextNav = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  margin-left: 0;
  padding: 0;
`

class BlogPostTemplate extends React.Component {
  render = () => {
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
          lang={locale}
        />

        <article>
          <Title
            title={post.frontmatter.title}
            subTitle={post.frontmatter.date}
          />
          <section dangerouslySetInnerHTML={{ __html: post.html }} />
          <Footer>
            {post.frontmatter.tags && (
              <TagList locale={locale} tags={post.frontmatter.tags} />
            )}
            {post.frontmatter.reproduce || (
              <p>
                <strong>{messages[locale].permalink} : </strong>
                <Link to={slug} title={post.frontmatter.title}>
                  {`${siteUrl}${slug}`}
                </Link>
              </p>
            )}
            {hasTranslation && (
              <p>
                <strong>{messages[locale].alternativePage} : </strong>
                <Link to={otherSlug}>{`${siteUrl}${otherSlug}`}</Link>
              </p>
            )}
            {post.frontmatter.licensed && <License locale={locale} />}
          </Footer>
          <Hr />
        </article>

        <nav>
          <PrevNextNav>
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
          </PrevNextNav>
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
        tags
        reproduce
        licensed
      }
    }
  }
`
