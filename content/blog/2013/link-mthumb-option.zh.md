---
author: njutiger
date: 2013-08-18 05:32:11+00:00
draft: false
title: 编译和连接的时候要同时指定 -mthumb 选项
tags: [C, STM32, Linker]
---

STM32 程序中调用 `strncmp` 函数时始终出现 crash。

找了很久发现是由于编译选项中添加了 `-mthumb`，而连接时遗漏了这个选项。
