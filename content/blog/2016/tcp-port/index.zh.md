---
title: "检测远程 TCP 端口是否可连接"
tags: ["TCP", "Firewall", "Telnet", "Netcat", "Socket", "Python"]
date: 2016-12-16T22:01:06+08:00
licensed: true
draft: false
---

当我们在测试某个网站或网络服务是否正常时，首先需要的是查看
[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
连接是否正常。

连接 TCP 端口常见的状态有：

* `Name or service not
  known`。这是域名解析问题。先检查域名是否拼对，域名解析是否正常
  (nslookup)。如果连接任何域名都是这个问题，那应该是本地机器的
  DNS 设置问题。
* `No route to
  host`。无法找到服务器。原因可能是多样的，比如本地路由、防火墙问题，也有可能是服务器网络防火墙问题，路由中间任何环节出错都会造成这个结果。总之无法通过路由找到服务器在哪里。
* `Connection refused`。服务器主动拒绝连接。说明服务器端是有响应的，但是可能端口没有打开
  (可以用 `netstat -ntpl` 查看监听端口)，也有可能是服务器网络防火墙拒绝了连接
  (REJECT)。
* 连接超时。这种情况连接长时间没有任何反馈，直到超过指定时间。有可能 IP
  对应的服务器就不存在或没有运行，也可能是服务器网络防火墙直接将连接丢掉了 (DROP)。
* 连接成功。可以正常连接到服务。

下面介绍测试远程 TCP 端口能否正常连接的一些方法。


## Telnet

`telnet` 命令是比较常用的测试 TCP 端口的方法。

```
$ telnet github.com 443
Trying 13.250.177.223...
Connected to github.com.
Escape character is '^]'.
```

显示 `Connected to xxx` 则说明连接成功。

不过 `telnet` 是交互式命令，不方便用在 shell 脚本里。
`telnet` 是需要单独安装的，不是所有系统都会直接预先安装。


## Netcat

[Netcat](https://en.wikipedia.org/wiki/Netcat)
也是需要单独安装，命令为 `nc`。

测试连接并退出：

```
$ nc -z github.com 443
$ echo $?
0
```

返回 0 意味着连接成功，返回 1 意味着连接失败。

也可以通过 `-w` 设置超时时间，单位为秒：

```
$ nc -z -v -w5 github.com 6789
github.com [13.250.177.223] 6789 (radg): Connection timed out
$ echo $?
1
```


## Bash /dev/tcp

`/dev/tcp/<host>/<port>` 是 bash 内置支持的的虚拟文件，并不是
\*nix 系统提供的，其它 shell
也不支持。通过打开这个文件，可以实现 socket 连接。

```
$ bash -c 'cat < /dev/null > /dev/tcp/github.com/443'
$ echo $?
0
```

连接成功会返回 0。

通过 `timeout` 命令设定超时时间：

```
$ timeout 5 bash -c 'cat < /dev/null > /dev/tcp/github.com/6789'
$ echo $?
124

$ timeout 5 bash -c 'cat < /dev/null > /dev/tcp/unknown-hostname/80'
bash: unknown-hostname: Name or service not known
bash: /dev/tcp/unknown-hostname/80: Invalid argument
$ echo $?
1
```

如果超时，`timeout` 程序会 kill bash 命令并返回 124，其它错误返回 1。


## 编写 socket 程序

我们也可以编写一个简单的程序来测试 TCP 端口。

这里以 `Python` 为例，使用
[socket](https://docs.python.org/3/library/socket.html)
模块：

```python
#!/usr/bin/env python

import socket

server = 'github.com'
port = 443
timeout = 5

try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    sock.connect((server, port))
    print('Connected')
    sock.close()
except socket.error as e:
    print("Couldn't connect to server:", e)
    raise
```
