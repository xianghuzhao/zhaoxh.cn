const locales = require(`../locales/lang`)
const { isDefaultLocale } = require(`./locale`)

// Use a little helper function to remove trailing slashes from paths
exports.removeTrailingSlash = path =>
  path === `/` ? path : path.replace(/\/$/, ``)

// Modified from "gatsby-source-filesystem/create-file-path.js"
const path = require(`path`)

function findFileNode({ node, getNode }) {
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

exports.generateSlug = ({
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

  const postPath = locale + `_` + postID

  return { postID, locale, postPath }
}
