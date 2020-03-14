---
title: Rails 开发环境部署
date: 2013-11-23T03:59:48+00:00
tags: [Ruby on Rails, Ruby, Arch Linux]
draft: false
---

在 Arch Linux 上部署 Rails 开发环境：

1. pacman -S ruby，安装 ruby 以及 RubyGems

2. 默认 gems 安装在 ~/.gem 下面，以区别于 pacman 安装的 gems
    * add `~/.gem/ruby/2.0.0/bin` to $PATH
    * 参考 [https://wiki.archlinux.org/index.php/Ruby](https://wiki.archlinux.org/index.php/Ruby)

3. 配置不生成 ri 和 rdoc 文档，添加如下到 ~/.gemrc

```yaml
install: --no-rdoc --no-ri
update: --no-rdoc --no-ri
```
4. Bundler 默认安装 gems 到系统目录，修改为用户目录

    * `export GEM_HOME=~/.gem/ruby/2.0.0`
    * 参考 [https://wiki.archlinux.org/index.php/Ruby](https://wiki.archlinux.org/index.php/Ruby)

5. 更改 RubyGems 源

    * `gem sources --remove https://rubygems.org/`
    * `gem sources -a http://mirrors6.ustc.edu.cn/rubygems/`
    * 参考 [http://ruby.taobao.org/](http://ruby.taobao.org/)
