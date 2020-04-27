---
title: "zstd 压缩格式"
tags: [zstd, Zstandard, tar, compression]
date: 2020-04-27T15:36:56+08:00
licensed: true
draft: false
---

[zstd (Zstandard)](http://www.zstd.net/) 是 Facebook
开发的一种无损压缩算法，最大的优势就是具有极快的压缩和解压速度，同时还有着不错的压缩率。目前
zstd 已经有了越来越多的应用，[Arch Linux](https://www.archlinux.org/)
也已经开始[转用 zstd
作为安装包压缩格式](https://www.archlinux.org/news/now-using-zstandard-instead-of-xz-for-package-compression/)了。


## 安装 zstd

因为 Arch Linux
的安装包已经使用了 `zstd` 格式，所以只要更新过系统，就默认已经安装过了
[zstd](https://www.archlinux.org/packages/core/x86_64/zstd/)。其它
Linux 发行版可以使用各自的包管理工具安装。

验证安装：

```
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

如果需要改变压缩率，可以设置 `ZSTD_CLEVEL` 环境变量，范围 `1-19`，
默认值是 `3`。值越大，压缩率越高，当然压缩时间也越长。

```shell
$ ZSTD_CLEVEL=10 tar -caf data.tar.zst data_to_compress
```


## 比较各种压缩命令

这里通过 tar 来进行压缩速度和压缩率的比较。
测试数据使用 [Go Linux 安装包](https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz)
解压后的目录，解压后大小为
326 MB。此数据并不代表所有情况，具体性能还依赖于数据本身。

压缩使用以下命令：

```shell
$ tar -caf test.tar.gz go
$ tar -caf test.tar.bz2 go
$ tar -caf test.tar.xz go
$ tar -caf test.tar.zst go
$ ZSTD_CLEVEL=10 tar -caf test_10.tar.zst go
$ ZSTD_CLEVEL=19 tar -caf test_19.tar.zst go
```

解压使用命令：

```shell
$ tar -xf test.tar.zst
...
```

结果如下：

| 压缩工具 | 压缩后大小 | 压缩时间 | 解压时间 |
| -------- | ---------- | -------- | -------- |
| gzip     | 118 MB     |  20.96 s |  3.77 s  |
| bzip2    | 109 MB     |  46.46 s | 26.25 s  |
| xz       |  87 MB     | 208.85 s |  7.97 s  |
| zstd     | 115 MB     |   4.45 s |  2.05 s  |
| zstd -10 | 105 MB     |  31.84 s |  2.16 s  |
| zstd -19 |  93 MB     | 233.41 s |  2.21 s  |

大致可以看出 `zstd` 在解压速度上是最快的，相比 `gzip`
还有更好的压缩率。`xz`
是压缩率最高的，不过压缩非常慢，解压也比较慢。而解压最慢的是
`bzip2`。

所以在性价比上 `zstd` 还是有很大优势的，尤其是在追求解压速度的时候。
