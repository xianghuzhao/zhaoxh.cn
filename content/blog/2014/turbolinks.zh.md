---
title: jQuery Turbolinks
date: 2014-03-16T18:04:51+00:00
tags: [Ruby on Rails, Ruby, jQuery, Turbolinks]
draft: false
---

写 jquery 的时候发现有些功能第一次打开有效，点击链接进入页面则不起作用，刷新后又可以生效。

添加以下 gem 后一切都正常了。

<https://github.com/kossnocorp/jquery.turbolinks>

```ruby
gem 'jquery-turbolinks'
```

在 `app/assets/javascripts/application.js` 中 `//= require jquery` 之后添加

```javascript
//= require jquery.turbolinks
```
