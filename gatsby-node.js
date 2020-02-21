const path = require(`path`)

const locales = require(`./src/locales/lang`)
const { isDefaultLocale, otherLocale } = require(`./src/utils/locale`)
const {
  removeTrailingSlash,
  generateNodeFields,
  generateSlug,
} = require(`./src/utils/gatsby-node-helpers`)

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  deletePage(page)

  Object.keys(locales.lang).forEach(locale => {
    const localizedPath =
      locale === locales.default
        ? page.path
        : `${locales.lang[locale].path}${page.path}`
    const originPath = page.path
    const slug = generateSlug({ locale, prefix: originPath })
    const otherSlug = generateSlug({
      locale: otherLocale(locale),
      prefix: originPath,
    })

    return createPage({
      ...page,
      path: removeTrailingSlash(localizedPath),
      context: {
        ...page.context,
        locale,
        originPath,
        slug,
        otherSlug,
        dateFormat: locales.lang[locale].dateFormat,
      },
    })
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const blogList = path.resolve(`./src/templates/blog-list.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 10000
      ) {
        edges {
          node {
            excerpt
            fields {
              postID
              locale
            }
            frontmatter {
              date
              title
              description
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

  const resultPages = {}
  Object.keys(locales.lang).forEach(locale => {
    resultPages[locale] = []
  })

  posts.forEach(post => {
    const locale = post.node.fields.locale
    const postID = post.node.fields.postID

    const theOtherLocale = otherLocale(locale)

    const findOtherLocale = posts.find(
      p => p.node.fields.postID === postID && p.node.fields.locale !== locale
    )

    const slug = generateSlug({ locale, postID, prefix: `post` })
    const otherSlug = generateSlug({
      locale: theOtherLocale,
      postID,
      prefix: `post`,
    })

    if (findOtherLocale) {
      resultPages[locale].push({
        post,
        slug,
        otherSlug,
        hasTranslation: true,
      })
    } else {
      resultPages[locale].push({
        post,
        slug,
        otherSlug,
        hasTranslation: false,
      })
      resultPages[theOtherLocale].push({
        post,
        slug: otherSlug,
        otherSlug: slug,
        hasTranslation: false,
      })
    }
  })

  Object.keys(resultPages).forEach(locale => {
    const theOtherLocale = otherLocale(locale)

    resultPages[locale].forEach((page, index) => {
      const previous =
        index === resultPages[locale].length - 1
          ? null
          : {
              slug: resultPages[locale][index + 1].slug,
              title: resultPages[locale][index + 1].post.node.frontmatter.title,
            }
      const next =
        index === 0
          ? null
          : {
              slug: resultPages[locale][index - 1].slug,
              title: resultPages[locale][index - 1].post.node.frontmatter.title,
            }

      createPage({
        path: page.slug,
        component: blogPost,
        context: {
          slug: page.slug,
          otherSlug: page.otherSlug,
          hasTranslation: page.hasTranslation,
          postID: page.post.node.fields.postID,
          locale,
          postLocale: page.post.node.fields.locale,
          isDefault: isDefaultLocale(locale),
          dateFormat: locales.lang[locale].dateFormat,
          previous,
          next,
        },
      })
    })

    const postsPerPage = 10
    const numPages = Math.ceil(resultPages[locale].length / postsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
      const pagePath = i === 0 ? `` : `blog/${i + 1}`
      const slug = generateSlug({ locale, prefix: pagePath })
      const otherSlug = generateSlug({
        locale: theOtherLocale,
        prefix: pagePath,
      })
      const postList = resultPages[locale]
        .slice(
          i * postsPerPage,
          i * postsPerPage +
            Math.min(
              postsPerPage,
              resultPages[locale].length - i * postsPerPage
            )
        )
        .map(p => ({ node: p.post.node, slug: p.slug }))

      createPage({
        path: slug,
        component: blogList,
        context: {
          slug,
          otherSlug,
          numPages,
          locale,
          currentPage: i + 1,
          dateFormat: locales.lang[locale].dateFormat,
          postList,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const { postID, locale } = generateNodeFields({
      node,
      getNode,
      locales,
    })

    createNodeField({ node, name: `postID`, value: postID })
    createNodeField({ node, name: `locale`, value: locale })
  }
}
