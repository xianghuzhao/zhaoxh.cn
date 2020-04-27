---
title: "zstd 压缩格式"
tags: [zstd, Zstandard, tar, compression]
date: 2020-04-27T15:36:56+08:00
licensed: true
draft: false
---

[zstd (Zstandard)](http://www.zstd.net/) 是 Facebook
开发的一种无损压缩算法，最大的优势就是具有极快的压缩和解压速度，同时还有着不错的压缩率。目前
zstd 已经有了越来越多的应用，[Arch Linux](https://www.archlinux.org/news/now-using-zstandard-instead-of-xz-for-package-compression/)
也已经开始转用 zstd 作为安装包压缩格式了。


## 安装 zstd

因为 [Arch Linux](https://www.archlinux.org/packages/core/x86_64/zstd/)
的安装包已经使用了 `zstd` 算法，所以只要更新过系统，就默认已经安装过了 `zstd`。
其它 Linux 发行版可以使用各自的包管理工具安装。

验证安装：

```shell
$ zstd -V
*** zstd command line interface 64-bits v1.4.4, by Yann Collet ***
```


## 使用 tar 压缩解压 \*.tar.zst 文件

比较新的 `tar` 已经内置了对 `zstd` 的支持：

```shell
$ tar --help
...
      --zstd                 filter the archive through zstd
...
```

### 解压

```shell
$ tar --zstd -xf data.tar.zst
```

也可以让 `tar` 根据扩展名 `.zst` 来自动推断压缩格式：

```shell
$ tar -xf data.tar.zst
```

### 压缩

```shell
$ tar --zstd -cf data.tar.zst data_to_compress
```

通过 `-a` 选项可以让 `tar` 根据扩展名来自动推断压缩格式：

```shell
$ tar -caf data.tar.zst data_to_compress
```

如果需要改变压缩率，可以设置 `ZSTD_CLEVEL` 环境变量，范围是 `1-19`，
默认值是 `3`。值越大，压缩率越高，当然压缩时间也越长。

```shell
$ ZSTD_CLEVEL=10 tar -caf data.tar.zst data_to_compress
```
