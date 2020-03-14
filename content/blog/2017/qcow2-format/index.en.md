---
title: "QCOW2 格式兼容性"
date: 2017-01-19T22:34:38+08:00
tags: ['QCOW2', 'QEMU', 'Image Format', 'Virtual Machine']
licensed: true
draft: false
---

Cut out summary from your post content here.

<!--more-->

```shell
$ qemu-img convert -c -p -o compat=0.10 -O qcow2 image.qcow2 image_new.qcow2
```

```shell
$ file image.qcow2
image.qcow2: QEMU QCOW Image (v3), 34359738368 bytes
$ file image_new.qcow2
image_new.qcow2: QEMU QCOW Image (v2), 34359738368 bytes
```
