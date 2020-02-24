import React from "react"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import TagList from "../components/taglist"
import messages from "../locales/messages"

const TagListPage = ({ pageContext }) => {
  const { locale, otherSlug, tags } = pageContext
  return (
    <Layout locale={locale} otherLink={otherSlug}>
      <SEO title={messages[locale].tagList} />
      <Title title={messages[locale].tagList} />
      <TagList
        locale={locale}
        tags={tags}
        tagValue={tag => tag.name}
        tagText={tag => `${tag.name} (${tag.count})`}
      />
    </Layout>
  )
}

export default TagListPage
