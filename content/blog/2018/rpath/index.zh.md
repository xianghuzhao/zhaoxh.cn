---
title: "RPATH 变量"
tags: [RPATH, RUNPATH, ELF, GCC, Linker, GNU Make, CMake]
date: 2018-02-04T16:47:56+08:00
licensed: true
draft: false
---


## Priority

The linker will search the libraries in the following directories
in the given order:

* `RPATH`: a list of directories which is linked into the executable,
  supported on most UNIX systems. It is ignored if `RUNPATH` is present.
* `LD_LIBRARY_PATH`: an environment variable which holds a list of
  directories.
* `RUNPATH`: same as `RPATH`, but searched after `LD_LIBRARY_PATH`,
  supported on most recent UNIX systems.
* `/etc/ld.so.conf`: configuration file for `ld.so` which lists
  additional library directories.
* Builtin directories: basically `/lib` and `/usr/lib`.


## Compile with rpath/runpath

### GCC

With relative rpath.

### ld

`ld gcc -Wl,-rpath automake cmake`

### CMake


## Read and modify rpath/runpath in binary

[ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)

### Read

The `objdump` and `readelf` could be installed by package `binutils`
if not present.

```shell
$ sudo pacman -S binutils
```

```shell
$ objdump -x executable_or_lib | grep RPATH
```

```shell
$ readelf -d binary-or-library | grep -i rpath
```

`chrpath` is another tool to modify the dynamic library load path.
It should be installed independently.

```shell
$ sudo pacman -S chrpath
```

```shell
$ chrpath -l binary-or-library
```

### Modify

```shell
$ chrpath patchelf –set-rpath /path/to/libraries
```
