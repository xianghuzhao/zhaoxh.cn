import React from "react"
import { Link, graphql } from "gatsby"
import kebabCase from "lodash/kebabCase"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import messages from "../locales/messages"

class Tags extends React.Component {
  render() {
    const { data } = this.props
    const { locale, otherSlug } = this.props.pageContext
    console.log(this.props.location)

    return (
      <Layout locale={locale} otherLink={otherSlug}>
        <SEO title={messages[locale].tagList} />
        <Title title={messages[locale].tagList} />
        <ul>
          {data.allMarkdownRemark.group.map(tag => (
            <li key={tag.fieldValue}>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                {tag.fieldValue} ({tag.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </Layout>
    )
  }
}

export default Tags

export const pageQuery = graphql`
  query TagList {
    allMarkdownRemark(limit: 1000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
