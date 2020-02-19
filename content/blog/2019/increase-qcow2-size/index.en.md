---
date: 2019-06-06 11:29:35+08:00
title: Increase Partition Size on KVM Image
---

Resize qcow2 image and the partition.

<!--more-->

## Resize the qcow2 image

Poweroff the virtual machine.

Check the size.

```shell
$ qemu-img info vm.qcow2
image: vm.qcow2
file format: qcow2
virtual size: 64G (68719476736 bytes)
disk size: 56G
cluster_size: 65536
```

Resize the image file.

```shell
$ qemu-img resize vm.qcow2 +960G
Image resized.
```

The new size.

```shell
$ qemu-img info vm.qcow2
image: vm.qcow2
file format: qcow2
virtual size: 1.0T (1099511627776 bytes)
disk size: 56G
cluster_size: 65536
```

## Resize the partition

Start the virtual machine.

```shell
$ virsh start vm
```

Login and resize lvm group.

```shell
$ sudo fdisk /dev/vda
WARNING: DOS-compatible mode is deprecated. It's strongly recommended to
         switch off the mode (command 'c') and change display units to
         sectors (command 'u').
 
Command (m for help): p
 
Disk /dev/vda: 14.0 GB, 13958643712 bytes
16 heads, 63 sectors/track, 27046 cylinders
Units = cylinders of 1008 * 512 = 516096 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x000c55ce
 
   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *           3        1018      512000   83  Linux
Partition 1 does not end on cylinder boundary.
/dev/vda2            1018       20806     9972736   8e  Linux LVM
Partition 2 does not end on cylinder boundary.
 
Command (m for help): d
Partition number (1-4): 2
 
Command (m for help): p
 
Disk /dev/vda: 14.0 GB, 13958643712 bytes
16 heads, 63 sectors/track, 27046 cylinders
Units = cylinders of 1008 * 512 = 516096 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x000c55ce
 
   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *           3        1018      512000   83  Linux
Partition 1 does not end on cylinder boundary.
 
Command (m for help): n
Command action
   e   extended
   p   primary partition (1-4)
p
Partition number (1-4): 2
First cylinder (1-27046, default 1): 1018
Last cylinder, +cylinders or +size{K,M,G} (1018-27046, default 27046): 
Using default value 27046

Command (m for help): t
Partition number (1-4): 2
Hex code (type L to list codes): 8e
Changed system type of partition 2 to 8e (Linux LVM)
 
Command (m for help): p
 
Disk /dev/vda: 14.0 GB, 13958643712 bytes
16 heads, 63 sectors/track, 27046 cylinders
Units = cylinders of 1008 * 512 = 516096 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x000c55ce
 
   Device Boot      Start         End      Blocks   Id  System
/dev/vda1   *           3        1018      512000   83  Linux
Partition 1 does not end on cylinder boundary.
/dev/vda2            1018       27046    13118160   8e  Linux LVM
 
Command (m for help): w
The partition table has been altered!
 
Calling ioctl() to re-read partition table.
 
WARNING: Re-reading the partition table failed with error 16: Device or resource busy.
The kernel still uses the old table. The new table will be used at
the next reboot or after you run partprobe(8) or kpartx(8)
Syncing disks.
```

Reboot the virtual machine.

```shell
$ sudo pvdisplay
$ sudo pvresize /dev/vda2
$ sudo pvdisplay
```

```shell
$ sudo lvdisplay
$ sudo lvextend -L+960G /dev/centos/root
$ sudo lvdisplay
```

Grow xfs partition.

```shell
$ sudo xfs_growfs /dev/centos/root
```
