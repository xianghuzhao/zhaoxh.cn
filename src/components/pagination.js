import React from "react"
import Link from "gatsby-link"
import styled from "styled-components"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"

const PagiContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 15px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
`

const PagiAll = styled.div`
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  user-select: none;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
`

const PagiBoxActive = styled(Link)`
  z-index: 2;
  cursor: pointer;
  padding: 7px 12px;
  border: 1px solid #e1e4e8;

  &:hover {
    text-decoration: none;
    background-color: #eff3f6;
  }
`

const PagiBoxCurrent = styled.span`
  z-index: 3;
  cursor: pointer;
  padding: 7px 12px;
  border: 1px solid #0366d6;
  color: #fff;
  background-color: #0366d6;
`

const PagiBoxDisable = styled.span`
  z-index: 2;
  cursor: default;
  padding: 7px 12px;
  border: 1px solid #e1e4e8;
  color: #d1d5da;
  fill: #d1d5da;
  background-color: #fafbfc;
`

const PagiPage = styled.div`
  margin-left: -1px;
`

const PagiPrev = styled.div`
  margin-left: 0;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
`

const PagiNext = styled.div`
  margin-left: -1px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
`

const PagiIcon = styled(FontAwesomeIcon)`
  font-size: 1rem;
`

const Pagination = ({ prefix, prefixFirst, numPages, currentPage }) => {
  const prev =
    currentPage === 1 ? (
      <PagiPrev as={PagiBoxDisable}>
        <PagiIcon icon={faAngleLeft} />
      </PagiPrev>
    ) : (
      <PagiPrev
        as={PagiBoxActive}
        to={currentPage === 2 ? prefixFirst : `${prefix}/${currentPage - 1}/`}
        rel="prev"
      >
        <PagiIcon icon={faAngleLeft} />
      </PagiPrev>
    )

  const next =
    currentPage === numPages ? (
      <PagiNext as={PagiBoxDisable}>
        <PagiIcon icon={faAngleRight} />
      </PagiNext>
    ) : (
      <PagiNext
        as={PagiBoxActive}
        to={`${prefix}/${currentPage + 1}/`}
        rel="next"
      >
        <PagiIcon icon={faAngleRight} />
      </PagiNext>
    )

  const pages = [...Array(numPages)].map((_, i) =>
    i + 1 === currentPage ? (
      <PagiPage as={PagiBoxCurrent} key={i + 1}>
        {i + 1}
      </PagiPage>
    ) : (
      <PagiPage
        as={PagiBoxActive}
        to={i === 0 ? prefixFirst : `${prefix}/${i + 1}/`}
        key={i + 1}
      >
        {i + 1}
      </PagiPage>
    )
  )

  return (
    <PagiContainer>
      <PagiAll>
        {prev}
        {pages}
        {next}
      </PagiAll>
    </PagiContainer>
  )
}

export default Pagination
