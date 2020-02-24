import React from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import Title from "../components/title"
import SEO from "../components/seo"
import messages from "../locales/messages"

import wechat from "../../content/assets/image/wechat.jpg"

const Image = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
`

const WechatPage = ({ pageContext: { locale, otherSlug } }) => {
  return (
    <Layout locale={locale} otherLink={otherSlug}>
      <SEO title={messages[locale].wechat} />
      <Title title={messages[locale].wechat} />
      <Image src={wechat} alt={messages[locale].wechat} />
    </Layout>
  )
}

export default WechatPage
