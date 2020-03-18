---
date: 2014-07-02T01:25:52+08:00
title: 防止虚拟机 Network Interface 名称变化
tags: ['Virtual Machine', CentOS, Network Interface]
---

由镜像创建的虚拟机，由于硬件相当于发生了改变，所以会导致网卡接口名称发生变化。
变化的接口名非常不利于自动网络设置，需要想办法保证网卡接口名称保持稳定

<!--more-->

```
cd /etc/udev/rules.d
rm -f 70-persistent-net.rules
rm -f 75-persistent-net-generator.rules
echo "# " > 75-persistent-net-generator.rules
```

See <https://www.kernel.org/pub/linux/utils/kernel/hotplug/udev/udev.html>

chapter "Rules files"
