---
title: "在 Linux 下安装开发环境"
tags: ["Linux", "开发环境", "GCC", "GNU Make"]
date: 2018-08-08T15:33:30+08:00
licensed: true
---

Linux 下非常适合进行软件开发，软件开发环境的创建也是非常方便。

这里的开发环境指的是 `C/C++` 开发环境，
包含 `C/C++` 编译器、头文件、标准库、代码工具、编译工具以及常用开发库等等。
其他语言 (比如 `Ruby`、`Go`、`JavaScript` 等等)
的开发环境还是需要单独安装的。

以下方法可以快速建立软件开发环境。


## 安装比较完整的开发环境

不同 `Linux` 发行版的安装包名称并不一样，命令不同，
而且所包含的具体组件也不完全相同。

### Arch

在 Arch 下可以安装 [`base-devel` group](https://www.archlinux.org/groups/x86_64/base-devel/)：

```bash
sudo pacman -S base-devel
```

### Ubuntu / Debian

[`build-essential`](https://packages.debian.org/sid/build-essential)
包含了所有相关软件包的依赖。

```bash
sudo apt-get install build-essential
```

### CentOS / RHEL

`yum` 需要使用 `groupinstall` 命令安装：

```bash
sudo yum groupinstall "Development Tools"
```

如果想知道 "Development Tools" 这个 group 里面都包含了什么，
可以使用 `group info` 命令查看：

```bash
yum groupinfo "Development Tools"
```

### Fedora

```bash
sudo dnf install @development-tools
```

目前 `yum` 也是可以用的：

```bash
sudo yum groupinstall "Development Tools"
```


## 单独安装软件包

上面的方法命令简单，不过也可能多安装了很多不需要的东西。
如果只是希望建立最基本的 `C/C++` 编译环境，可以只安装 `gcc/g++`，以及
[`GNU make`](https://www.gnu.org/software/make/)，其他工具可以根据情况自由添加。

### Arch

```bash
sudo pacman -S gcc make
```

### Ubuntu / Debian

```bash
sudo apt-get install gcc g++ make
```

### CentOS

```bash
sudo yum install gcc gcc-c++ make
```

### Fedora

```bash
sudo dnf install gcc gcc-c++ make
```
