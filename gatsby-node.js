const path = require(`path`)
const kebabCase = require(`lodash/kebabCase`)

const locales = require(`./src/locales/lang`)
const { isDefaultLocale, otherLocale } = require(`./src/utils/locale`)
const {
  removeTrailingSlash,
  generateNodeFields,
  generateSlug,
  addPost,
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
  const tagList = path.resolve(`./src/templates/tag-list.js`)
  const tagPost = path.resolve(`./src/templates/tag-post.js`)

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { draft: { ne: true } } }
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
              tags
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
    resultPages[locale] = { pages: [], tags: [], tagPages: {} }
  })

  // Fill post data
  posts.forEach(post => {
    const otherLocaleFound = posts.find(
      p =>
        p.node.fields.postID === post.node.fields.postID &&
        p.node.fields.locale !== post.node.fields.locale
    )

    addPost({ resultPages, post, otherLocaleFound })
  })

  // Generate pages for each language
  Object.keys(resultPages).forEach(locale => {
    const theOtherLocale = otherLocale(locale)
    const dateFormat = locales.lang[locale].dateFormat

    const pageLength = resultPages[locale].pages.length

    // Blog post pages
    resultPages[locale].pages.forEach((page, index) => {
      const previous =
        index === pageLength - 1
          ? null
          : {
              slug: resultPages[locale].pages[index + 1].slug,
              title:
                resultPages[locale].pages[index + 1].post.node.frontmatter
                  .title,
            }
      const next =
        index === 0
          ? null
          : {
              slug: resultPages[locale].pages[index - 1].slug,
              title:
                resultPages[locale].pages[index - 1].post.node.frontmatter
                  .title,
            }

      createPage({
        path: page.slug,
        component: blogPost,
        context: {
          locale,
          slug: page.slug,
          otherSlug: page.otherSlug,
          hasTranslation: page.hasTranslation,
          postID: page.post.node.fields.postID,
          postLocale: page.post.node.fields.locale,
          isDefault: isDefaultLocale(locale),
          dateFormat,
          previous,
          next,
        },
      })
    })

    // Blog list pages
    const postsPerPage = 10
    const numPages = Math.ceil(pageLength / postsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
      const pagePath = i === 0 ? `` : `blog/${i + 1}`
      const slug = generateSlug({ locale, prefix: pagePath })
      const otherSlug = generateSlug({
        locale: theOtherLocale,
        prefix: pagePath,
      })
      const postList = resultPages[locale].pages
        .slice(
          i * postsPerPage,
          i * postsPerPage +
            Math.min(postsPerPage, pageLength - i * postsPerPage)
        )
        .map(p => ({ node: p.post.node, slug: p.slug }))

      createPage({
        path: slug,
        component: blogList,
        context: {
          locale,
          slug,
          otherSlug,
          numPages,
          currentPage: i + 1,
          dateFormat,
          postList,
        },
      })
    })

    // Tag list page
    const tagListUrl = `/tags/`
    const tagListSlug = generateSlug({ locale, prefix: tagListUrl })
    const tagListOtherSlug = generateSlug({
      locale: theOtherLocale,
      prefix: tagListUrl,
    })
    const tagsData = resultPages[locale].tags.map(tag => ({
      name: tag,
      count: resultPages[locale].tagPages[tag].length,
    }))
    createPage({
      path: tagListSlug,
      component: tagList,
      context: {
        locale,
        slug: tagListSlug,
        otherSlug: tagListOtherSlug,
        tags: tagsData,
      },
    })

    // Single tag posts page
    Object.keys(resultPages[locale].tagPages).forEach(tag => {
      const tagUrl = `/tags/${kebabCase(tag)}/`
      const tagListSlug = generateSlug({ locale, prefix: tagUrl })
      const tagListOtherSlug = generateSlug({
        locale: theOtherLocale,
        prefix: tagListUrl,
      })
      const postList = resultPages[locale].tagPages[tag].map(p => ({
        node: p.post.node,
        slug: p.slug,
      }))
      createPage({
        path: tagListSlug,
        component: tagPost,
        context: {
          locale,
          slug: tagListSlug,
          otherSlug: tagListOtherSlug,
          tag,
          postList,
          dateFormat,
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
