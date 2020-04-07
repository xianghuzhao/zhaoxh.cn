---
title: 服务器管理
date: 2014-01-06T16:51:46+00:00
tags: [Debian, Server Management, Locale, Timezone, NTP, PPTP,
    Ruby on Rails, Ruby, nginx, Passenger]
draft: false
---

## 基本设置

### vim

```shell
$ sudo apt-get install vim
$ sudo update-alternatives --set editor /usr/bin/vim.basic
```

### locale

1. 使用命令

```
$ sudo dpkg-reconfigure locales
$ sudo update-locale LANG=en_US.UTF-8 LC_CTYPE=en_US.UTF-8
```

2. 或者直接进行编辑

修改文件 `/etc/locale.gen`，打开对应注释

然后执行命令

```shell
$ sudo locale-gen
```

修改文件 `/etc/default/locale`

```
LANG=en_US.UTF-8
LC_CTYPE=en_US.UTF-8
```

### timezone

1. 使用如下命令

```shell
$ sudo dpkg-reconfigure tzdata
```

2. 或者直接进行编辑

编辑 `/etc/timezone` 写入以下内容

```
Asia/Shanghai
```

建立连接 `/etc/localtime`

```shell
$ sudo ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/locaktime
```

### ntp

```shell
$ sudo apt-get install ntpdate
$ sudo ntpdate time.nist.gov
$ sudo apt-get install ntp
```

### pptp

[http://blog.shnfu.com/?p=263](http://blog.shnfu.com/?p=263)

## 软件服务安装

### mysql

```shell
$ sudo apt-get install mysql-client mysql-server libmysqlclient-dev
```

安全设置

```shell
$ mysql_secure_installation
```

### ruby on rails

安装编译环境以及用到的库

```shell
$ sudo apt-get install build-essential zlib1g-dev libyaml-dev libssl-dev libgdbm-dev libreadline-dev libncurses5-dev libffi-dev redis-server checkinstall libxml2-dev libxslt-dev libcurl4-openssl-dev libicu-dev libpcre3-dev logrotate
```

下载 ruby 源代码并编译安装，选择合适的 ruby 版本，这里 ruby 的版本和 gitlab 安装说明中的一致

```shell
$ mkdir /tmp/ruby && cd /tmp/ruby
$ curl --progress ftp://ftp.ruby-lang.org/pub/ruby/2.0/ruby-2.0.0-p353.tar.gz | tar xz
$ cd ruby-2.0.0-p353
$ ./configure --disable-install-rdoc
$ make
$ sudo make install
```

安装 bundler

```shell
$ sudo gem install bundler --no-ri --no-rdoc
```

### nginx 和 passenger

选择 nginx 作为 HTTP 服务器，passenger 用于部署 rails

passenger 不能作为模块与 nginx 结合使用，必须编译进 nginx

首先通过 gem 安装 passenger

```shell
$ sudo gem install passenger --no-ri --no-rdoc
```

然后下载 nginx 源代码，先不要开始编译

```shell
$ mkdir /tmp/nginx && cd /tmp/nginx
$ curl --progress http://nginx.org/download/nginx-1.4.4.tar.gz | tar xz
$ cd nginx-1.4.4
$ pwd
```

开始安装编译 nginx 与 passenger

```shell
$ sudo passenger-install-nginx-module --auto --prefix=/usr/local/nginx --nginx-source-dir=/tmp/nginx/nginx-1.4.4 "--extra-configure-flags=--sbin-path=/usr/local/sbin --with-http_ssl_module --with-http_stub_status_module --with-ipv6 --conf-path=/etc/nginx/nginx.conf --error-log-path=/var/log/nginx/error.log --http-client-body-temp-path=/var/lib/nginx/body --http-fastcgi-temp-path=/var/lib/nginx/fastcgi --http-log-path=/var/log/nginx/access.log --http-proxy-temp-path=/var/lib/nginx/proxy --lock-path=/var/lock/nginx.lock --pid-path=/var/run/nginx.pid"
```

安装 javascript 运行库 node.js

```shell
$ mkdir /tmp/nodejs && cd /tmp/nodejs
$ curl --progress http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz | tar xz
$ cd node-v0.10.24
$ ./configure
$ make
$ sudo make install
```

### php

```shell
$ sudo apt-get install php5 php5-mysql php5-fpm
$ sudo apt-get install phpmyadmin
```

### gitlab

## 备份
