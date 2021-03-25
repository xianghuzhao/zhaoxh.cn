---
title: "Docker 重启后部分容器无法启动"
tags:
  - Docker
date: 2021-03-25T23:35:03+08:00
licensed: true
draft: true
---

## 启动不了

```shell
$ docker start container-test
Error response from daemon: task 01db444c79dc10f8d13849f68d94e0bff6d9a1fe81cc374ede5130d8e55087be already exists: unknown
Error: failed to start containers: container-test
```

## 解决方法

```shell
$ ps aux | grep 01db444c79dc10f8d13849f68d94e0bff6d9a1fe81cc374ede5130d8e55087be
$ sudo kill 31432
```
