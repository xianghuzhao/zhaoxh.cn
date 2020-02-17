---
author: Xianghu Zhao
date: 2017-08-04 07:05:40+00:00
draft: false
title: Redirecting “/” Root URL to Another Sub-Directory or URL
type: post
categories:
- 未分类
---

<https://www.devside.net/wamp-server/how-to-redirect-root-url-to-another-sub-directory-or-url>


## Redirecting “/” Root URL to Another Sub-Directory or URL

A typical redirect is usually done for either:

* The entire website to another website:

```
Redirect / https://www.example.com/
```

* Or from one specific path of a website to another location:

```
Redirect /path http://www.example.com/some-other/path`
```

The limitation of Apache’s [Redirect](http://httpd.apache.org/docs/2.4/mod/mod_alias.html#redirect) directive is that you cannot partially (nor selectively) redirect only the root URL “/”, without also redirecting everything after it to another path or location (e.g., redirect “/” will also match and redirect on request for “/folder/”)…

This is because `Redirect` matches everything after the given path, and a redirect from “/” is a redirection of all the website’s URLs.

Use [RedirectMatch](http://httpd.apache.org/docs/2.4/mod/mod_alias.html#redirectmatch) to only redirect the root URL “/” to another sub-directory or URL, without also redirecting everything else…

```
RedirectMatch ^/$ http://www.example.com/another/path
```

Since `RedirectMatch` uses a regex match, it can be specific with the “/” path without matching everything else.
