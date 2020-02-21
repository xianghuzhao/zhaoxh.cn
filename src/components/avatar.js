import React from "react"
import styled from "styled-components"

import avatar from "../../content/assets/image/avatar400.jpg"

const AvatarStyle = styled.img`
  margin-top: 3rem;
  width: 90%;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 5px gray;
  //transition: box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0 0 3px gray;
  }
`

const Avatar = () => <AvatarStyle src={avatar} alt="Avatar" />

export default Avatar
