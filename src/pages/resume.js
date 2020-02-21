import React from "react"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import messages from "../locales/messages"

const ResumePage = ({ pageContext: { locale, otherSlug } }) => {
  return (
    <Layout locale={locale} otherLink={otherSlug}>
      <SEO title={messages[locale].resume} />
      <Title title={messages[locale].resume} />
      <section>
        <p>About me.</p>
      </section>
    </Layout>
  )
}

export default ResumePage
