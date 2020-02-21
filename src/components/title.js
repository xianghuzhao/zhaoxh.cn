import React from "react"
import styled from "styled-components"

const TitleStyle = styled.h1`
  margin-top: 1.625rem;
  margin-bottom: 0;
`

const SubTitleStyle = styled.small`
  display: block;
  margin-bottom: 1.625rem;
`

const Title = ({ title, subTitle = `` }) => (
  <header>
    <TitleStyle>{title}</TitleStyle>
    <SubTitleStyle>{subTitle}</SubTitleStyle>
  </header>
)

export default Title
