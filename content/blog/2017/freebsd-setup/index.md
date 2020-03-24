---
title: "FreeBSD 配置"
tags: [FreeBSD, NTP, Server Management]
date: 2017-12-23T18:55:29+08:00
---

最近在尝试将一些服务部署在 [FreeBSD](https://www.freebsd.org/)
上，这里记录一些配置过程。


## 添加用户

```shell
$ adduser
```


## 软件安装

```shell
$ sudo pkg install zsh git tmux wget
```


## Locale 设置

编辑 `~/.login_conf`：

```
me:\
        :charset=uft-8:\
        :lang=en_US.UTF-8:
```


## 时间设置

### 时区设置

```shell
$ sudo tzsetup
```

需要重新登录才能看到生效。

### 时间同步

```shell
$ sudo service ntpd status
$ ntpq -p
```


## 服务安装

```shell
$ sudo pkg install nginx
```


## rc.d 脚本编写

<https://www.freebsd.org/doc/zh_CN/articles/rc-scripting/index.html>
