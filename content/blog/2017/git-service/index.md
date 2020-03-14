---
title: "自己创建 Git 服务"
tags: [Git, GitLab, Gogs]
date: 2017-11-21T23:59:47+08:00
licensed: true
---

当我们想使用远程 [Git](https://git-scm.com/) 服务的时候，
[GitHub](https://github.com/) 当然是一个很好地选择。
不过 GitHub 只对公开开源项目才是免费使用的，如果想拥有私人仓库，
还是需要付费的。

我们可以考虑自己搭建 Git 服务，这样所有的权限控制也就
掌握在自己手中了。有很多开源方案可以选用，这里基于我的使用经历
介绍一些搭建 Git 服务的方法。


## Git SSH

Git 支持 SSH 协议，如果只是希望简单地支持 SSH 访问，
只需要有 SSH 服务就可以了。

先创建账户，并指定 shell 为 `/usr/bin/git-shell` 以禁止直接登录。

```shell
$ sudo useradd -m -s /usr/bin/git-shell git
```

多个用户访问可以使用同一个账户，每个用户提供自己的 ssh 公钥，
放到 `~/.ssh/authorized_keys` 里面。

```shell
$ sudo -u git -H mkdir ~git/.ssh
$ sudo chmod 700 ~git/.ssh
$ sudo -u git -H touch ~git/.ssh/authorized_keys
$ sudo chmod 600 ~git/.ssh/authorized_keys

$ cat user1.id_rsa.pub | sudo -u git -H tee -a ~git/.ssh/authorized_keys
$ cat user2.id_rsa.pub | sudo -u git -H tee -a ~git/.ssh/authorized_keys
```

创建 Git 裸仓库：

```shell
$ cd ~git
$ sudo -u git -H mkdir project1.git
$ cd project1.git
$ sudo -u git -H git init --bare
```

于是此仓库便可以通过 SSH 远程访问了。

```shell
$ git clone git@gitserver:~/project1.git
```

更详细的过程可以参见
[Pro Git book](https://git-scm.com/book/en/v2/Git-on-the-Server-Setting-Up-the-Server)。


## GitLab

[GitLab](https://gitlab.com/)
的功能真的是很全很强大，有些功能连 GitHub 也没有。
运行也非常稳定，基本不需要维护，定期备份升级就可以了。
如果系统资源充足，那么 GitLab 绝对是自建 Git 服务的首选。

但是 GitLab 确实比较耗费资源，尤其是内存。最早 512MB 内存还能勉强运行，
现在 1G 内存已经开始不停吃 swap 了，卡到几乎
没法用。[资源需求](https://docs.gitlab.com/ce/install/requirements.html)这些年
也是一直不断上涨。

这恐怕是由于 GitLab 基于 [Ruby on Rails](https://rubyonrails.org/)
框架，Rails 本身就比较费资源。而一个 GitLab 服务还至少需要两个
[Unicorn](https://yhbt.net/unicorn/) 进程，每个差不多需要 500 MB 左右
内存。此外还有 [Sidekiq](https://sidekiq.org/) 后台进程，基于 Ruby
也是个资源消耗大户。再加上 Redis，gitlab-workhorse，gitaly，数据库等等，
杂七杂八的，实在是太费资源了。

GitLab 的安装也是比较麻烦，需要安装一堆组件支持。
有了 [Omnibus](https://docs.gitlab.com/omnibus/) 安装倒是方便了一些，
不过所有东西都被打包在了一起，某些服务就可能和其它系统重复。
当然使用 [Docker](https://docs.gitlab.com/omnibus/docker/)
也是不错的选择。


## Gogs

GitLab 资源消耗确实比较大，如果希望搭建一个轻量级的
Git 服务，[Gogs](https://gogs.io/) 是一个不错的选择。Gogs 相对比较简化，
但是基本的功能也都很齐全，提供 HTTP 和 SSH 访问，个人使用一般足够了。

[Gogs 的安装](https://gogs.io/docs/installation)也十分简单，
下载[二进制包](https://gogs.io/docs/installation/install_from_binary)解压，
然后配置数据库就可以了。

初始安装后，只占用几十 MB 的内存，响应速度也很快，
非常适合资源紧张的服务器使用，放树莓派里也没问题。
