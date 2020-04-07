import React from "react"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import messages from "../locales/messages"

const ContentZh = () => (
  <section>
    <p>虎泉笔谈。</p>
    <p>
      本网站使用 <a href="https://www.gatsbyjs.org">Gatsby</a> 创建。
    </p>
  </section>
)

const ContentEn = () => (
  <section>
    <p>Xianghu's blog.</p>
    <p>
      Built with <a href="https://www.gatsbyjs.org">Gatsby</a>.
    </p>
  </section>
)

const AboutPage = ({ pageContext: { locale, otherSlug } }) => {
  return (
    <Layout locale={locale} otherLink={otherSlug}>
      <SEO title={messages[locale].about} />
      <Title title={messages[locale].aboutTitle} />
      {locale === `zh` ? <ContentZh /> : <ContentEn />}
    </Layout>
  )
}

export default AboutPage
