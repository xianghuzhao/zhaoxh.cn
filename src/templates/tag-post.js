import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import moment from "moment"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import messages from "../locales/messages"

const PostList = styled.ul`
  list-style: none;
  margin-left: 0;
`

const TagPost = ({ pageContext }) => {
  const { locale, otherSlug, tag, postList, dateFormat } = pageContext
  const tagTitle = `${messages[locale].tag} - ${tag}`
  return (
    <Layout locale={locale} otherLink={otherSlug}>
      <SEO title={tagTitle} />
      <Title title={tagTitle} />
      <PostList>
        {postList.map(({ node, slug }) => {
          const title = node.frontmatter.title || slug
          const date = moment(node.frontmatter.date).format(dateFormat)
          return (
            <li key={slug}>
              <Link to={slug}>{title}</Link>
              <small>{` - ${date}`}</small>
            </li>
          )
        })}
      </PostList>
    </Layout>
  )
}

export default TagPost
