---
author: njutiger
date: 2014-01-14 01:12:00+00:00
draft: false
title: pptpd 安装配置
type: post
categories:
- Server
---

### 安装配置 pptpd



安装 `pptpd`:


```shell
$ sudo apt-get install pptpd
```



去掉 `/etc/pptpd.conf` 以下两行的注释:


```
localip 192.168.0.1
remoteip 192.168.0.234-238,192.168.0.245
```



修改 `/etc/ppp/chap-secrets` 添加用户名和密码:


```
username pptpd password *
```



编辑/etc/ppp/pptpd-options，修改 ms-dns 的dns地址:


```
ms-dns 8.8.8.8
ms-dns 8.8.4.4
```



重启 pptpd 服务:


```shell
$ sudo service pptpd restart
```





### 设置 nat 转发



编辑 `/etc/sysctl.conf`


```
net.ipv4.ip_forward=1
```



执行命令使其立即生效:


```shell
$ sudo sysctl -p
```



修改 `iptables`，设置 nat 转发，并保存 `iptables` 配置:


```shell
$ sudo iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -o eth0 -j MASQUERADE
$ sudo iptables-save | sudo tee /etc/iptables.up.rules
```



配置 `iptables` 开机自动设置，编辑文件 `/etc/network/if-pre-up.d/iptables`


```shell
#!/bin/sh
/sbin/iptables-restore < /etc/iptables.up.rules
```



添加可执行权限:


```shell
$ sudo chmod +x /etc/network/if-pre-up.d/iptables
```
