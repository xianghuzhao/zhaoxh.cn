import React from "react"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import messages from "../locales/messages"

const AboutPage = ({ pageContext: { locale, otherSlug } }) => {
  return (
    <Layout locale={locale} otherLink={otherSlug}>
      <SEO title={messages[locale].about} />
      <Title title={messages[locale].aboutTitle} />
      <section>
        <p>{messages[locale].aboutPart1}</p>
        <p>
          {messages[locale].builtWith}
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
          {` ${messages[locale].builtWithEnd}`}
        </p>
      </section>
    </Layout>
  )
}

export default AboutPage
