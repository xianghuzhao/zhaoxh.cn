---
title: "Herald: 轻量级的任务分发系统"
tags: [go, herald, 'task manager']
date: 2019-08-25T19:07:18+08:00
licensed: true
draft: false
---

目标是能够根据条件触发，自动执行 git 上的脚本。不用每个服务器都设置。
可以远程执行命令，又要保证安全性。
通过 `yaml` 配置。

不想使用 puppet 这种过于庞大的系统，只需要完成一些简单的任务。
也不需要数据库支持。

<https://github.com/heraldgo/heraldd>
