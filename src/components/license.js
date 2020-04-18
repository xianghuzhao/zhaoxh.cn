import React from "react"
import styled from "styled-components"

import licenseButton from "../../content/assets/image/by-nc-4.0-88x31.png"

const LicensePart = styled.p`
  text-align: center;
  margin-top: 1.5rem;
`

const LicenseImage = styled.img`
  border-width: 0;
`

const License = ({ locale }) =>
  locale === `zh` ? (
    <LicensePart>
      <a
        rel="license"
        href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh"
      >
        <LicenseImage alt="知识共享许可协议" src={licenseButton} />
      </a>
      <br />
      本作品采用{` `}
      <a
        rel="license"
        href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh"
      >
        知识共享署名-非商业性使用 4.0 国际许可协议
      </a>
      {` `}进行许可。
    </LicensePart>
  ) : (
    <LicensePart>
      <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0/">
        <LicenseImage alt="Creative Commons License" src={licenseButton} />
      </a>
      <br />
      This work is licensed under a{" "}
      <a rel="license" href="https://creativecommons.org/licenses/by-nc/4.0/">
        Creative Commons Attribution-NonCommercial 4.0 International License
      </a>
      .
    </LicensePart>
  )

export default License
