---
date: 2014-12-15T05:19:16+08:00
title: rpm 内容查看
tags: [RPM]
licensed: true
---

如何查看 rpm 包的内容。

<!--more-->

1.  用来检查依赖关系；并不是真正的安装

    ```
    rpm -ivh --test xxx.rpm
    ```

2.  rpm 包使用 cpio 格式打包，可以先转成 cpio 然后解压:

    ```
    rpm2cpio xxx.rpm | cpio -div
    ```

3.  查看 rpm 包里的 pre 和 post install 脚本，这些脚本是在 rpm 安装之前和之后执行的

    ```
    rpm -qp --scripts xxx.rpm
    ```
