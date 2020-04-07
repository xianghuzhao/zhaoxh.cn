---
title: Debian 上 Ruby on Rails 开发环境配置
date: 2014-01-20T03:43:05+00:00
tags: [Ruby on Rails, Ruby, Debian, Node.js]
draft: false
---

## 1. 基本系统配置



首先在 root 账号下更新系统到最新


```shell
apt-get update -y
apt-get upgrade -y
```



因为直接使用 root 账号登录不够安全，安装 sudo 允许普通用户获得 root 权限


```shell
apt-get install sudo -y
```



创建用户并赋予其执行 sudo 的权限


```shell
adduser yourusername
usermod -a -G sudo yourusername
```



退出 root，使用新的用户登录



## 2. 安装基础软件包和库



如果习惯使用 vim 编辑器，可以做如下设置，否则可以跳过并选择自己喜欢的编辑器


```shell
# Install vim and set as default editor
sudo apt-get install -y vim
sudo update-alternatives --set editor /usr/bin/vim.basic
```



安装 mysql


```shell
sudo apt-get install -y mysql-client mysql-server libmysqlclient-dev
```



安装编译环境


```shell
sudo apt-get install -y build-essential checkinstall
```



安装编译 ruby 会用到的库


```shell
sudo apt-get install -y zlib1g-dev libyaml-dev libssl-dev libgdbm-dev
sudo apt-get install -y libreadline-dev libncurses5-dev libffi-dev libxml2-dev
sudo apt-get install -y libxslt-dev libcurl4-openssl-dev libicu-dev libpcre3-dev
sudo apt-get install -y libsqlite3-dev
```





## 3. 安装 Ruby



Rails 推荐使用的 ruby 版本为 2.0

debian 上通过 apt-get 安装的 ruby 版本一般比较低，可能无法满足 Rails 4 的要求，如果已经安装，可以通过命令


```shell
ruby -v
```



查看当前 ruby 版本，如果版本较低 (1.8, 1.9.1)，首先将其卸载


```shell
sudo apt-get autoremove ruby1.9.1
```



下载 Ruby 2.0.0 源码并安装


```shell
mkdir /tmp/ruby && cd /tmp/ruby
curl --progress ftp://ftp.ruby-lang.org/pub/ruby/2.0/ruby-2.0.0-p353.tar.gz | tar xz
cd ruby-2.0.0-p353
./configure --disable-install-rdoc
make
sudo make install
```



安装 Bundler Gem


```shell
sudo gem install bundler --no-ri --no-rdoc
```





## 4. 安装 Rails



配置 gems 安装时不生成 ri 和 rdoc 文档，编辑 ~/.gemrc 文件，添加以下内容


```yaml
install: --no-rdoc --no-ri
update:  --no-rdoc --no-ri
```



由于国内网络原因，gems 安装有可能失败，可以参考 [http://ruby.taobao.org/](http://ruby.taobao.org/) 进行设置

设置 PATH 环境变量，写入启动脚本里 (~/.profile)


```shell
export PATH="$HOME/.gem/ruby/2.0.0/bin:$PATH"
```



开始安装 Rails

```shell
gem install rails
```



运行

```shell
rails -v
```



如果显示版本号，则说明安装成功



## 5. 安装 javascript 运行库 node.js



```shell
mkdir /tmp/nodejs && cd /tmp/nodejs
curl --progress http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz | tar xz
cd node-v0.10.24
./configure --disable-install-rdoc
make
sudo make install
```





## 6. 测试简单的 Rails 程序



假设将 Rails 程序放在 rails_projects 目录下：

```shell
mkdir rails_projects
cd rails_projects
```



生成一个新的 Rails 程序骨架：

```shell
rails new first_app
cd first_app/
```



顺利的话，rails new 命令会自动安装所有依赖的 gems

如果出现错误，可以重新执行以下命令：

```shell
bundle install
```



然后生成指定的数据模型：

```shell
rails generate scaffold User name:string email:string
```



更新数据库：

```shell
bundle exec rake db:migrate
```



启动 Rails 服务器：

```shell
rails server
```



如果一切正常，可以在浏览器里通过 http://ip:3000/ 看到生成的页面

User 模型对应的页面地址为 http://ip:3000/users
