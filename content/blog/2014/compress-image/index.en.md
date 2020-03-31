---
title: "Compress QCOW2 Image"
tags: [QCOW2, QEMU, 'Image Format', 'Virtual Machine']
date: 2014-08-11T22:11:45+08:00
licensed: true
draft: false
---

The size of the cloud image should be controlled.
Reduce the image size would speed up the creation of virtual machines.


# Disable swap and zero them in the guest OS

1.  Check swap status with "free" or:

    ```
    # swapon -s
    ```

2.  Temporarily disable any swap files and zero them

    ```
    # swapoff /some/swap/file
    # dd if=/dev/zero of=/some/swap/file bs=1M count=1024
    # sync
    # mkswap /some/swap/file
    ```

3.  Temporarily disable any swap partitions and zero them

    ```
    # swapoff /dev/mapper/vg_sl65-lv_swap
    # dd if=/dev/zero of=/dev/mapper/vg_sl65-lv_swap
    # sync
    # mkswap /dev/mapper/vg_sl65-lv_swap
    ```


# Zeroing

Since any deleted files (or phisically moved, e.g. by defrag) will
still be in the some place in the image, and since the image is going
to be re-compressed, these removed files would make the compression
less efficient.

A workaround is to fill the empty space in the disk with zeroes.
A stream of repeated values compresses better than some random files' contents :).
I use a very rude, yet efficient, approach: create a file with all-zeroes
filling the disk (in some filesystems this would require multiple files
due to file-size limit, but I try to avoid such systems).

Clean some cache first. Try to make the /var/cache directory clean:

```
# yum clean all
# cvmfs_config wipecache
# ...
```

Fill the disk with big zero content file. Use "sync" to make sure it is not cached:

```
# dd if=/dev/zero of=/tmp/bigfile
# sync
# rm /tmp/bigfile
# sync
```

The size of the image will be expanded to the full size now, but don't worry.

Shutting down the virtual machine. Execute the following in the host,
(without -c option the size could also shrink)

```
$ qemu-img convert -p -O qcow2 disk.qcow2 new_disk.qcow2
```

This command will make the image even smaller with compression
(only support qcow and qcow2 format)

```
$ qemu-img convert -p -c -O qcow2 disk.qcow2 compress_disk.qcow2
```

The size looks like:

```
$ ls -l
-rw-r--r-- 1 root root   367394816 Aug 14 22:22 compress_disk.qcow2
-rw------- 1 root root 21474836480 Aug 10 20:35 disk.qcow2
-rw-r--r-- 1 root root  1110179840 Aug 14 22:05 new_disk.qcow2
-rw------- 1 root root  1901002752 Aug 10 20:35 original_disk.qcow2
```
