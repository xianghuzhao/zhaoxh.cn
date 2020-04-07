---
title: "压缩 QCOW2 虚拟机镜像文件"
tags: [QCOW2, QEMU, 'Image Format', 'Virtual Machine']
date: 2014-08-11T22:11:45+08:00
licensed: true
draft: false
---

在制作云计算基础镜像时，我们都要尽量控制镜像大小，以节约传输时间，减轻网络和服务器负担，加快创建虚拟机的速度。

通常用到的镜像格式是
[QCOW2](https://www.linux-kvm.org/page/Qcow2)，QCOW2
格式有很多优势，支持动态分配空间，压缩，加密等等功能。通过动态分配，qcow2
文件在创建时并不会占用完整的空间大小，而是随着数据写入才不断变大。因此，qcow2
镜像文件一般会小于总大小。

但是通常我们看到的都是镜像文件越来越大，而没有自动变小的情况，即使删除文件也没有用。本文将介绍减小
qcow2 镜像文件的方法。


## 减小文件大小的命令

`qemu-img` 命令可以用来降低镜像大小，回收实际内容为零的空间。

```shell
$ qemu-img convert -O qcow2 original.qcow2 new.qcow2
```

但是通过简单删除文件并不能达到预想的镜像变小的效果，镜像文件还是会比用
`df` 看到的大得多。这是因为操作系统为了性能考虑，通常只会把文件标记为删除，而不是真的把文件对应的空间全部清除。

所以我们需要想办法把所有没有用到的空间全部写上零，这样
`qemu-img` 命令就可以真正地压缩镜像文件了。


## 禁用 swap 并清零

以下操作在虚拟机中进行。

首先把 swap 文件或分区清空。

1. 检查 swap 状态：

```shell
$ swapon -s
```

2. 临时禁用 swap 文件并清零：

```shell
$ swapoff /some/swap/file
$ dd if=/dev/zero of=/some/swap/file bs=1M count=1024
$ sync
$ mkswap /some/swap/file
```

3. 临时禁用 swap 分区并清零：

```shell
$ swapoff /dev/mapper/vg_sl65-lv_swap
$ dd if=/dev/zero of=/dev/mapper/vg_sl65-lv_swap
$ sync
$ mkswap /dev/mapper/vg_sl65-lv_swap
```


## 清零文件系统

删除所有不必要的文件以及缓存，尽可能清除 `/var/cache`
目录下的内容。

```
$ yum clean all
$ cvmfs_config wipecache
$ ...
```

将分区用一个全是零的文件填满，`sync`
命令保证文件内容真正写到磁盘上而不是被缓存。

```
$ dd if=/dev/zero of=/tmp/bigfile
$ sync
$ rm /tmp/bigfile
$ sync
```

如果有多个分区，重复以上操作。

现在镜像文件大小应该基本达到镜像的完整大小了，不过不用担心。

```
$ ls -l
-rw------- 1 root root 21474836480 Aug 10 20:35 zero_disk.qcow2
-rw------- 1 root root  1901002752 Aug 10 20:35 original_disk.qcow2
```


## 压缩镜像文件

关闭虚拟机，在宿主机上运行以下命令：

```
$ qemu-img convert -p -O qcow2 zero_disk.qcow2 new_disk.qcow2
```

虽然没有使用 `-c` 选项，镜像文件仍然变小了。

如果需要压缩，可以加上 `-c` 选项，文件会更小：

```
$ qemu-img convert -p -c -O qcow2 zero_disk.qcow2 compress_disk.qcow2
```

所有文件的大小对比：

```
$ ls -l
-rw-r--r-- 1 root root   367394816 Aug 14 22:22 compress_disk.qcow2
-rw------- 1 root root 21474836480 Aug 10 20:35 zero_disk.qcow2
-rw-r--r-- 1 root root  1110179840 Aug 14 22:05 new_disk.qcow2
-rw------- 1 root root  1901002752 Aug 10 20:35 original_disk.qcow2
```

经过压缩之后，我这里一个原来大约 2GB 的文件变成了 350MB。
