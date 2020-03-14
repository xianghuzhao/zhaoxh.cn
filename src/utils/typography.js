import Typography from "typography"
import Github from "typography-theme-github"

Github.overrideThemeStyles = () => {
  return {
    'a code[class*="language-"]': {
      color: `#4078c0`,
    },
  }
}

const typography = new Typography(Github)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
