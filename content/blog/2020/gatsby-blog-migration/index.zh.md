---
title: "本站迁移到 Gatsby"
tags: [Gatsby, React, Blog, WordPress, Jekyll, 'Static Site Generator', Hugo]
date: 2020-01-21T20:53:21+08:00
licensed: true
draft: false
---

最近终于完成了本站到 [Gatsby](https://www.gatsbyjs.org/)
的迁移。这里简单回顾一下站点用过的平台。


## WordPress

最早使用的是 [WordPress](https://wordpress.org/)，简单易用，
几乎零学习成本，安装 [PHP](https://www.php.net/)
和 [MySQL](https://www.mysql.com/) 就可以了，
其余的只需要通过后台页面来管理。
支持的插件也多，但是很多是收费的。


## Jekyll

后来偶然发现了 [Jekyll](https://jekyllrb.com/)，
开始知道有静态网站生成器 (Static Site Generator, SSG) 这种东西。
SSG 对于程序员可以说是非常友好的，站点和内容都变成了程序，
东西放在 Git 上要比存数据库安心多了。

SSG 现在是有[越来越多选择](https://www.staticgen.com/)了，
不过 Jekyll 算是早期比较有代表性的，
甚至 [GitHub Pages](https://pages.github.com/) 也一直
[原生支持 Jekyll](https://help.github.com/articles/using-jekyll-with-pages)。

Jekyll 可以算是一个为静态博客而生的框架，
虽然也[支持 Liquid 模板](https://shopify.github.io/liquid/)，
但总体来说可编程能力并不强，要实现一些特殊功能比较麻烦，
有时还要借助 JavaScript 来实现。
我用 Jekyll 写过两个文档类站点，实现文档目录就很别扭。
总之我并不算特别喜欢 Jekyll，所以并没有把本站往 Jekyll 搬。


## Middleman

[Middleman](https://middlemanapp.com/) 是我遇到的另一个 SSG，
它不算太流行，活跃度也不怎么高。不过 Middleman 灵活性还是
不错的，熟悉 Rails 的会感到很亲切。我也曾试着把一个原本使用
[Sphinx](https://www.sphinx-doc.org/)
写的文档站点迁移到了 Middleman 上面。

后来就没怎么用过了，可能还是因为不活跃吧。不过 Middleman
的设计还是给了我比较大的启发，以至于我打算自己写一个 SSG。


## 自己写个 SSG

似乎我见到的 SSG 网站生成模式都比较固定，可扩展性都比较有限。
其实还是对其它 SSG 不够满意，我希望 SSG 能够有更高的灵活性。
最重要的一点就是能够根据任意数据源生成目标网页或文件，
即使不用来生成网站，还可以做些别的转换工作。

于是我开始着手用 `Ruby` 写
[Xuanming](https://github.com/xuanming/xuanming)，
然而最终还是因为各种原因，并没有完成。


## Hugo

[Hugo](https://gohugo.io/) 和其它 SSG 功能都差不多，
只是用 Go 来实现。
它最大的优点我觉得就是快，生成一个站点眨眼间就完成了，
毫不拖泥带水。相比其他 SSG，都要慢慢等好半天。不过慢对于 SSG
来说算不上大的问题，本来实时性就不是静态网站要着重考虑的。

正好当时我刚接触 Go，也对 Go 印象不错，算是爱屋及乌，
就把站点迁到了 Hugo。

我使用了 [nuo](https://github.com/laozhu/hugo-nuo) 这个主题，
后来在更新站点的过程中，感觉 Hugo 对主题的处理算是比较粗暴，
自己定义的文件直接覆盖主题提供的对应文件，这样主题更新后
我就比较难办，跟着主题一起更新的话我自己改动的那部分也得
一点一点重新调整。当然主题这个问题对于 SSG 来说都不好处理，
通用性和灵活性不容易平衡，完全按照主题的思路使用还好，
可是想自己改动一下就难了。


## Gatsby

自从使用过 React 过后，我就非常喜欢，于是
试着寻找 React 相关的 SSG。本来我以为也许并不存在这么
一种东西，因为 React 通常用于单页面应用，而静态网站
是多页面的，即使用了 React，SEO 也会成为问题。

然而我惊喜的发现了 [Gatsby](https://www.gatsbyjs.org/)，
它完美解决了 SEO 的问题。
并且它十分接近我曾经打算自己写的 SSG，可以支持各种数据源，
生成页面的方式也极为灵活，能够随心所欲地控制，
而不会有任何的限制。

虽然需要一定的学习成本，我还是决定把网站迁移到 Gatsby 上来。
