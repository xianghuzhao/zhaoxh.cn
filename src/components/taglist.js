import React from "react"
import Link from "gatsby-link"
import styled from "styled-components"

import { localeUrl, tagPath } from "../utils/locale"

const TagUl = styled.ul`
  margin-left: 0;
  line-height: 2;
`

const TagLi = styled.li`
  display: inline-block;
  margin: 0 0.5rem 0.5rem 0;
`

const TagLink = styled(Link)`
  padding: 0.3rem 0.9rem;
  white-space: nowrap;
  border-radius: 3px;
  background-color: #f1f8ff;
  font-size: 0.9rem;

  &:hover {
    text-decoration: none;
    background-color: #def;
  }
`

const TagList = ({ locale, tags, tagValue, tagText }) => (
  <TagUl>
    {tags.map(tag => {
      const tv = tagValue ? tagValue(tag) : tag
      const tt = tagText ? tagText(tag) : tag
      return (
        <TagLi key={tv}>
          <TagLink to={localeUrl(locale, `/tags/${tagPath(tv)}/`)}>
            {tt}
          </TagLink>
        </TagLi>
      )
    })}
  </TagUl>
)

export default TagList
