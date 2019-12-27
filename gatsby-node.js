const path = require(`path`)

const locales = require(`./src/locales/lang`)
const {
  removeTrailingSlash,
  generateSlug,
} = require(`./src/utils/gatsby-node-helpers`)

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  deletePage(page)

  Object.keys(locales.lang).forEach(lang => {
    const localizedPath =
      lang === locales.default
        ? page.path
        : `${locales.lang[lang].path}${page.path}`

    return createPage({
      ...page,
      path: removeTrailingSlash(localizedPath),
      context: {
        ...page.context,
        locale: lang,
        dateFormat: locales.lang[lang].dateFormat,
      },
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 10000
      ) {
        edges {
          node {
            fields {
              slug
              pageID
              locale
              isDefault
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const posts = result.data.allMarkdownRemark.edges

  const resultPosts = {}
  Object.keys(locales.lang).forEach(lang => {
    resultPosts[lang] = []
  })
  posts.forEach(post => {
    resultPosts[post.node.fields.locale].push(post)
  })

  Object.keys(resultPosts).forEach(lang => {
    resultPosts[lang].forEach((post, index) => {
      const previous =
        index === resultPosts[lang].length - 1
          ? null
          : resultPosts[lang][index + 1].node
      const next = index === 0 ? null : resultPosts[lang][index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          pageID: post.node.fields.pageID,
          locale: lang,
          isDefault: post.node.fields.isDefault,
          dateFormat: locales.lang[lang].dateFormat,
          previous,
          next,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const { slug, pageID, lang, isDefault } = generateSlug({
      node,
      getNode,
      prefix: `blog`,
      locales,
    })

    createNodeField({ node, name: `slug`, value: slug })
    createNodeField({ node, name: `pageID`, value: pageID })
    createNodeField({ node, name: `locale`, value: lang })
    createNodeField({ node, name: `isDefault`, value: isDefault })
  }
}
