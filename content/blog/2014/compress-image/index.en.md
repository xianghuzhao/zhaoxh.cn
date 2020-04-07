---
title: "Shrink QCOW2 Image File Size"
tags: [QCOW2, QEMU, 'Image Format', 'Virtual Machine']
date: 2014-08-11T22:11:45+08:00
licensed: true
draft: false
---

Reducing the image size would speed up the creation of virtual machines
on cloud.

The commonly used image format for cloud is
[QCOW2](https://www.linux-kvm.org/page/Qcow2), which has many advanced
features like dynamic allocation, compression, encryption, etc.
With dynamic allocation, qcow2 file will not allocate the full size of the
image on creation, and grow gradually while data are written on it.
Therefore, it is possible to provide an image with much smaller size
than the full size.

However, in most cases we will only see the growth of image file,
and the size does not decrease even after deleting files.
The following part will provide a way to decrease QCOW2 image file size.


## Command to shrink qcow2 size

The `qemu-img` command could be used to free the image spaces
which are full of zero.

```shell
$ qemu-img convert -O qcow2 original.qcow2 new.qcow2
```

But it will not work as expected if you just delete the unused files.
You will find that the image file size is still larger than the
size from `df` command. This is because the Guest OS normally only marks
a file as deleted, and does not clear the content of the file for
performance reasons.

What we could do is trying to write zero on all unused spaces,
and then the `qemu-img` would really shrink the size.


## Disable swap and zero them

Do the zeroing in the guest OS.

Try to get clean swap file or partition.

1.  Check swap status:

```shell
$ swapon -s
```

2.  Temporarily disable any swap files and zero them:

```shell
$ swapoff /some/swap/file
$ dd if=/dev/zero of=/some/swap/file bs=1M count=1024
$ sync
$ mkswap /some/swap/file
```

3.  Temporarily disable any swap partitions and zero them:

```shell
$ swapoff /dev/mapper/vg_sl65-lv_swap
$ dd if=/dev/zero of=/dev/mapper/vg_sl65-lv_swap
$ sync
$ mkswap /dev/mapper/vg_sl65-lv_swap
```


## Zeroing file system

Delete all unnecessary files and clean the caches.
Try to make the `/var/cache` directory clean:

```
$ yum clean all
$ cvmfs_config wipecache
$ ...
```

Fill the disk with big zero content file.
Use `sync` to make sure it is not cached:

```
$ dd if=/dev/zero of=/tmp/bigfile
$ sync
$ rm /tmp/bigfile
$ sync
```

If you have more partitions, do it repeatedly on all partitions.

The size of the image will now be expanded to the full size,
but don't worry.

```
$ ls -l
-rw------- 1 root root 21474836480 Aug 10 20:35 zero_disk.qcow2
-rw------- 1 root root  1901002752 Aug 10 20:35 original_disk.qcow2
```


## Shrink the file size

Shutting down the virtual machine. Execute the following in the host,
(without -c option the size could also shrink).

```
$ qemu-img convert -p -O qcow2 zero_disk.qcow2 new_disk.qcow2
```

The following command will make the image even smaller with compression.

```
$ qemu-img convert -p -c -O qcow2 zero_disk.qcow2 compress_disk.qcow2
```

The size looks like:

```
$ ls -l
-rw-r--r-- 1 root root   367394816 Aug 14 22:22 compress_disk.qcow2
-rw------- 1 root root 21474836480 Aug 10 20:35 zero_disk.qcow2
-rw-r--r-- 1 root root  1110179840 Aug 14 22:05 new_disk.qcow2
-rw------- 1 root root  1901002752 Aug 10 20:35 original_disk.qcow2
```

For my case, the original size is about 2GB, and after compression
the file size is only about 350MB.
