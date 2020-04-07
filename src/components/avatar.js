import React from "react"
import Link from "gatsby-link"
import styled from "styled-components"

import { localeUrl } from "../utils/locale"
import avatar from "../../content/assets/image/avatar400.jpg"

const LinkStyle = styled(Link)`
  cursor: default;
  display: inline-block;
  border-radius: 50%;
  margin-top: 3rem;
  width: 90%;
`

const AvatarStyle = styled.img`
  cursor: ${props => (props.allowClick ? `pointer` : `default`)};
  ${props => (props.allowClick ? `transform: rotateY(-180deg);` : ``)}
  display: block;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 5px gray;
  margin-bottom: 0;
  //transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 0 3px gray;
  }
`

class Avatar extends React.Component {
  eventCounter = 0
  state = {
    allowClick: false,
  }

  onClickLink = event => {
    if (!this.state.allowClick) {
      event.preventDefault()
    }
  }

  onDragImage = event => {
    if (this.eventCounter === 9) {
      this.setState({ allowClick: true })
    }
    this.eventCounter++
  }

  render = () => {
    const { locale } = this.props

    return (
      <LinkStyle
        as={this.state.allowClick ? Link : `div`}
        to={localeUrl(locale, `/resume/`)}
        onClick={this.onClickLink}
      >
        <AvatarStyle
          src={avatar}
          alt="Avatar"
          draggable="true"
          onDragEnd={this.onDragImage}
          allowClick={this.state.allowClick}
        />
      </LinkStyle>
    )
  }
}

export default Avatar
