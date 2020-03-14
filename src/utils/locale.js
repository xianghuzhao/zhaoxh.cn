const kebabCase = require(`lodash/kebabCase`)

const locales = require(`../locales/lang`)

const isDefaultLocale = locale => locale === locales.default
exports.isDefaultLocale = isDefaultLocale

exports.otherLocale = locale =>
  Object.keys(locales.lang).find(l => l !== locale)

exports.localeUrl = (locale, url) => {
  return isDefaultLocale(locale) ? url : `/${locale}${url}`
}

exports.tagPath = tag => {
  if (tag === `C++`) {
    return `cpp`
  }
  return kebabCase(tag)
}
