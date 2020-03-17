const locales = require(`../locales/lang`)
const { isDefaultLocale, otherLocale } = require(`./locale`)

// Use a little helper function to remove trailing slashes from paths
exports.removeTrailingSlash = path =>
  path === `/` ? path : path.replace(/\/$/, ``)

exports.addTrailingSlash = path => (path.slice(-1) === `/` ? path : path + `/`)

// Modified from "gatsby-source-filesystem/create-file-path.js"
const path = require(`path`)

const findFileNode = ({ node, getNode }) => {
  // Find the file node.
  let fileNode = node
  let whileCount = 0

  while (
    fileNode.internal.type !== `File` &&
    fileNode.parent &&
    getNode(fileNode.parent) !== undefined &&
    whileCount < 101
  ) {
    fileNode = getNode(fileNode.parent)
    whileCount += 1

    if (whileCount > 100) {
      console.log(
        `It looks like you have a node that's set its parent as itself:`,
        fileNode
      )
    }
  }

  return fileNode
}

const generateSlug = ({
  locale,
  postID = ``,
  prefix = ``,
  trailingSlash = true,
}) => {
  return path.posix.join(
    `/`,
    isDefaultLocale(locale) ? `` : locale,
    prefix,
    postID,
    trailingSlash ? `/` : ``
  )
}
exports.generateSlug = generateSlug

const addPostResult = ({
  resultPages,
  locale,
  post,
  slug,
  otherSlug,
  hasTranslation,
}) => {
  resultPages[locale].pages.push({
    post,
    slug,
    otherSlug,
    hasTranslation,
  })

  post.node.frontmatter.tags &&
    post.node.frontmatter.tags.forEach(tag => {
      resultPages[locale].tags.indexOf(tag) === -1 &&
        resultPages[locale].tags.push(tag)

      tag in resultPages[locale].tagPages ||
        (resultPages[locale].tagPages[tag] = [])
      resultPages[locale].tagPages[tag].push({ post, slug })
    })
}

exports.addPost = ({ resultPages, post, otherLocaleFound }) => {
  const locale = post.node.fields.locale
  const postID = post.node.fields.postID

  const theOtherLocale = otherLocale(locale)

  const slug = generateSlug({ locale, postID, prefix: `post` })
  const otherSlug = generateSlug({
    locale: theOtherLocale,
    postID,
    prefix: `post`,
  })

  if (otherLocaleFound) {
    addPostResult({
      resultPages,
      locale,
      post,
      slug,
      otherSlug,
      hasTranslation: true,
    })
  } else {
    addPostResult({
      resultPages,
      locale,
      post,
      slug,
      otherSlug,
      hasTranslation: false,
    })
    addPostResult({
      resultPages,
      locale: theOtherLocale,
      post,
      slug: otherSlug,
      otherSlug: slug,
      hasTranslation: false,
    })
  }
}

exports.generateNodeFields = ({ node, getNode }) => {
  // Find the File node
  const fileNode = findFileNode({
    node,
    getNode,
  })
  if (!fileNode) return undefined
  const { dir = ``, name } = path.parse(fileNode.relativePath)

  const fragName = name.split(`.`)
  const pageName = fragName[0]
  const locale = fragName.length === 1 ? locales.default : fragName[1]

  const parsedName = pageName === `index` ? `` : pageName
  const postID = path.posix.join(dir, parsedName)

  return { postID, locale }
}
