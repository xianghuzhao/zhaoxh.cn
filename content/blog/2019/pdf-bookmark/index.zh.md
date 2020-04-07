---
title: "PDF 文件添加书签"
tags: [PDF, Bookmark, Python, venv, PDFtk, Ghostscript]
date: 2019-10-08T03:16:55+08:00
licensed: true
draft: false
---

在阅读 PDF 文件的时候，有书签的话浏览切换页面会很方便。但是有时候
PDF 文件里并不包含书签，这样就给跳转页面带来些麻烦。尤其是在手机和电纸书阅读器上，对于我这种不按顺序阅读的，没有书签简直寸步难行。

然后我就在寻找给 PDF 添加书签的方法。由于 PDF
是一种[开放的格式](http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_reference_1-7.pdf)，有很多软件工具以及程序库能够实现相关的功能。不过它们要么过于复杂，要么不能很好实现我的需求，始终没能找到一款特别合适的工具。比如
`ghostscript` 能够通过 `pdfmark` 实现书签的添加，但是需要写一个比较复杂的
`pdfmark` 文件，而且没有办法直接使用中文标题，必须先转成 `UTF-16BE` 格式。

于是我写了 [pdf-bookmark](https://github.com/xianghuzhao/pdf-bookmark)
这个命令来帮助实现这一功能。同时定义了一种 `bmk`
格式的文件用于简化书签的描述。


## 安装 pdf-bookmark

`pdf-bookmark` 需要先安装
[Python3](https://www.python.org/) 环境。

然后在 `Python3` 环境下安装 `pdf-bookmark`：

```shell
$ pip install pdf-bookmark
```

> 最好在 [venv](https://docs.python.org/3/tutorial/venv.html)
> 环境下安装，以避免和系统 Python 包冲突。

### 安装 Ghostscript

`pdf-bookmark` 使用 [Ghostscript](https://www.ghostscript.com/)
来生成带书签的 PDF 文件，必须预先安装好。

`Ghostscript` 很多 Linux 发行版都会提供，比如 Arch Linux：

```shell
$ sudo pacman -S ghostscript
$ gs --version
```

### 安装 PDFtk

`pdf-bookmark` 使用 [PDFtk](https://www.pdflabs.com/tools/pdftk-server/)
来导出 PDF 书签。如果需要导出书签的功能，必须先安装 PDFtk。

> [pdftk-java](https://gitlab.com/pdftk-java/pdftk) 是 PDFtk java
> 版本的移植，本来是可以替代原版 PDFtk 的。但是当前版本 (3.0.8) 的 pdftk-java
> [存在 bug](https://gitlab.com/pdftk-java/pdftk/issues/32)，导致输出的书签页码是错误的。所以
> bug 修复前还是要使用[原版的 pdftk](https://www.pdflabs.com/tools/pdftk-server/)。


## bmk 文件格式

`bmk` 文件用来描述书签的全部信息，主要包括标题和页码，还有标题的目录层级。

```
序................1
Chapter 1................4
Chapter 2................5
  2.1 Section 1................6
    2.1.1 SubSection 1................6
    2.1.2 SubSection 2................8
  2.2 Section 2................12
Chapter 3................20
Appendix................36
```

上面是一个简单的 `bmk` 文件，看上去很像目录吧，所以可以直接复制目录然后再简单编辑一下。

`bmk` 文件中每一行代表一个书签条目，左边是标题，可以包含中文。中间用很多点分隔开
(至少 4 个)，最右边是页码。目录层级通过缩进来表示，默认使用两个空格。

然后就可以生成一个带有书签的 PDF 了：

```shell
$ pdf-bookmark -p input.pdf -b bookmark.bmk -o new-with-bookmark.pdf
```

### 内置指令

`bmk` 格式还定义了一些内置的指令实现一些高级功能。内置指令行全部以
`!!!` 开头，影响此行之后的状态。

PDF 文件的页码不一定都是从第一页开始的，可能会分为好几块，比如序、前言、目录、正文、附录之类的。而且页码也不一定都是阿拉伯数字格式，还包括了罗马字母，英文字母的格式。书签有很多层的情况下，希望某些层折叠起来不直接显示，而是通过点击后再展开。内置指令就可以很好地描述这些情况：

```
!!! collapse_level = 2

!!! num_style = Roman
序................I
目录................IV

!!! new_index = 12
!!! num_style = Arabic
Introduction................1
Chapter 1................4
Chapter 2................5
  2.1 Section 1................6
  2.2 Section 2................7
Chapter 3................10
Appendix................11
```

这里序和目录使用罗马数字页码，正文页从 12 页开始，使用阿拉伯数字页码。

通过这些内置指令，就不再需要重新计算每一页的绝对页码了。

`bmk` 文件支持以下内置指令：

1. `new_index`，默认值：`1`。意味着接下来的书签项从此页码开始重新计算。(`new_index + page - 1`)
2. `num_start`，默认值：`1`。第一页的页码，如果不是从 1 开始标记的。(`new_index + page - num_start`)
3. `num_style`，默认值：`Arabic`。页码类型，可选的有 `Arabic`，`Roman` 和 `Letters`。
4. `collapse_level`，默认值：`0`。书签在哪一层开始折叠。0 则意味着全部展开。
5. `level_indent`，默认值：`2`。表示新的目录层级需要的空格数。


## 从 PDF 文件导出书签

导出书签需要预先安装 `pdftk` 命令，使用如下命令从现有的 PDF 文件中导出书签：

```shell
$ pdf-bookmark -p input.pdf
```

导出的书签默认为 `bmk` 格式，也可以通过 `-f` 选项设置为其它格式。
