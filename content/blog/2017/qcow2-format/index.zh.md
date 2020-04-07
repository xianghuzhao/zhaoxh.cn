---
title: "QCOW2 格式兼容性"
date: 2017-01-19T22:34:38+08:00
tags: ['QCOW2', 'QEMU', 'Image Format', 'Virtual Machine', 'CentOS', 'Libvirt', 'KVM']
licensed: true
---

最近需要在一台 CentOS 6 的机器上通过 libvirtd 创建一台 KVM
虚拟机。因为之前在另一台 CentOS 7
的服务器上生成过基础镜像，所以想直接复制过来使用，以节省安装时间。本以为一切都是顺理成章的，然而因为
QCOW2 兼容问题遇到了点小麻烦。

复制过来的镜像文件是 [QCOW2](https://www.linux-kvm.org/page/Qcow2)
格式的。创建新虚拟机时选择复制过来的镜像文件作为硬盘，然而启动时报了如下的错误：

```
$ virsh start vm
error: Failed to start domain vm
error: internal error process exited while connecting to monitor: char device redirected to /dev/pts/5
2017-01-04T21:03:32.888726Z qemu-kvm: -drive file=/var/lib/libvirt/images/vm.qcow2,if=none,id=drive-virtio-disk0,format=qcow2,cache=none: 'drive-virtio-disk0' uses a qcow2 feature which is not supported by this qemu version: QCOW version 3
2017-01-04T21:03:32.888881Z qemu-kvm: -drive file=/var/lib/libvirt/images/vm.qcow2,if=none,id=drive-virtio-disk0,format=qcow2,cache=none: could not open disk image /var/lib/libvirt/images/vm.qcow2: Operation not supported
```

错误提示 QCOW 版本 3 不支持，应该是 CentOS 6 对应的 KVM
版本过低，而复制过来的文件是在较高版本 KVM 下生成的。

用以下命令先把 qcow2 文件转换成兼容的版本：

```shell
$ qemu-img convert -p -o compat=0.10 -O qcow2 image.qcow2 image_new.qcow2
```

再查看文件格式，可以发现转换后的文件已经是 v2 版本的了。

```shell
$ file image.qcow2
image.qcow2: QEMU QCOW Image (v3), 34359738368 bytes
$ file image_new.qcow2
image_new.qcow2: QEMU QCOW Image (v2), 34359738368 bytes
```

在 CentOS 6 上替换为转换后的 v2 版本文件，虚拟机启动就正常了。
