---
title: "Linux / Unix 系统中动态链接库查找"
tags: [RPATH, RUNPATH, ELF, GCC, Linker, GNU Make, CMake]
date: 2018-02-04T16:47:56+08:00
description: '类 Unix 系统中的程序在查找动态链接库时会遵循一定的规则。以下是查找动态库目录的优先级:'
licensed: true
draft: false
---

[类 Unix](https://en.wikipedia.org/wiki/Unix-like)
系统中的程序在查找[动态链接库](https://en.wikipedia.org/wiki/Dynamic_loading)时会遵循一定的规则。

以下是查找动态库目录的优先级：

1. `RPATH`，包含查找库的目录列表，链接时保存在二进制程序内部。如果设置了
   `RUNPATH`，`RPATH` 将被忽略。
2. `LD_LIBRARY_PATH`，这是一个环境变量，包含用于查找库的目录列表。
3. `RUNPATH`，与 `RPATH` 类似，但是优先级在 `LD_LIBRARY_PATH`
   之后，这个变量是后来才添加的，不过目前已经广泛支持了。
4. `/etc/ld.so.conf`，这个
   [ld.so](http://man7.org/linux/man-pages/man8/ld.so.8.html)
   配置文件里包含额外库目录列表。
5. 系统默认目录，也就是 `/lib` 和 `/usr/lib`。

因为 `RPATH` 限制只能在指定目录查找动态库，会导致更换库很不方便。这样才有了
`RUNPATH`，能够带来更大的灵活性，目前更推荐使用的是
`RUNPATH`。


## 链接时添加 RPATH / RUNPATH

`RPATH` 和 `RUNPATH` 需要在编译链接时指定。`-Wl`
参数意味着后面跟着的选项将被传给
[Binutils](https://www.gnu.org/software/binutils/)
的链接器 GNU linker，也就是 LD。

`rpath` 目录可以使用绝对路径或者相对路径。

```shell
$ gcc -Wl,-rpath,'/path/to/lib/dir'
$ gcc -Wl,-rpath,'relative_path/to/lib/dir'
```

不过直接使用相对路径会限制调用程序的当前目录。通常使用 `$ORIGIN`
来指定查找相对于可执行文件本身的路径。

```shell
$ gcc -Wl,-rpath,'$ORIGIN'
$ gcc -Wl,-rpath,'$ORIGIN/../lib'
```


## RPATH / RUNPATH 例子

这里使用一个简单的例子来演示如何使用 `RPATH / RUNPATH`。

文件目录结构如下：

```
├── bin
│   └── foo.c
└── lib
    ├── bar1.c
    └── bar2.c
```

`bar1.c`：

```c
int lib1(void) {
    return 1;
}
```

`bar2.c`：

```c
int lib2(void) {
    return 2;
}
```

`foo.c`：

```c
#include <stdio.h>

extern int lib1(void);
extern int lib2(void);

int main(void) {
    printf("Lib1: %d\n", lib1());
    printf("Lib2: %d\n", lib2());
    return 0;
}
```

编译两个动态库文件：

```shell
$ gcc -c -fpic -o bar1.o bar1.c
$ gcc -shared -o libbar1.so bar1.o

$ gcc -c -fpic -o bar2.o bar2.c
$ gcc -shared -o libbar2.so bar2.o
```

生成库文件 `libbar1.so` 和 `libbar2.so`。

再尝试编译可执行程序：

```shell
$ gcc -L../lib -o foo foo.c -lbar1 -lbar2
```

这里需要通过 `-L` 参数指定链接时查找库文件的目录，注意仅仅是链接时起作用，和运行时的查找路径无关。

现在尝试运行 `foo` 程序会失败：

```shell
$ ./foo
./foo: error while loading shared libraries: libbar1.so: cannot open shared object file: No such file or directory
```

通过 `ldd` 来查看链接到的库文件：

```shell
$ ldd foo
        linux-vdso.so.1 (0x00007ffff2d66000)
        libbar1.so => not found
        libbar2.so => not found
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fac54db0000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fac55400000)
```

会发现找不到 `libbar1.so` 和 `libbar2.so` 这两个库文件。


### 使用环境变量 LD\_LIBRARY\_PATH

我们先尝试设置 `LD_LIBRARY_PATH`：

```shell
$ LD_LIBRARY_PATH=../lib ./foo
Lib1: 1
Lib2: 2

$ LD_LIBRARY_PATH=../lib ldd foo
        linux-vdso.so.1 (0x00007ffff5667000)
        libbar1.so => ../lib/libbar1.so (0x00007fc3baa20000)
        libbar2.so => ../lib/libbar2.so (0x00007fc3ba810000)
        libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007fc3ba410000)
        /lib64/ld-linux-x86-64.so.2 (0x00007fc3bb000000)
```

确实可以找到动态库并且正常运行。


### 使用 RPATH / RUNPATH

使用 `RUNPATH` 需要重新编译链接程序：

```shell
$ gcc -L../lib -Wl,-rpath='$ORIGIN/../lib',--enable-new-dtags -o foo foo.c -lbar1 -lbar2
```

或者使用 `RPATH`：

```shell
$ gcc -L../lib -Wl,-rpath='$ORIGIN/../lib',--disable-new-dtags -o foo foo.c -lbar1 -lbar2
```

`ld` 默认使用 `--disable-new-dtags`，只设置 `RPATH`
而不设置 `RUNPATH` (参见
<https://sourceware.org/binutils/docs/ld/Options.html>)。但是较新版本的
`Debian`，`Ubuntu` 和 `Gentoo` 修改了这一默认行为，默认使用
`--enable-new-dtags`，也就是设置
`RUNPATH`。所以为了不造成混淆和歧义，还是把选项明确加上比较好。

由于这里使用了 `$ORIGIN`，所以不管当前目录在哪里，都可以正常运行 `foo`。

查看
[ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format)
中的 `RPATH / RUNPATH` 信息，使用：

```shell
$ objdump -x foo | grep -i 'rpath\|runpath'
```

或者：

```shell
$ readelf -d foo | grep -i 'rpath\|runpath'
```

`objdump` 和 `readelf` 工具都包含在 `binutils` 包里。

```shell
$ sudo pacman -S binutils
```


## 修改二进制文件中的 RPATH / RUNPATH

如果希望修改已经编译好的二进制文件，可以使用 `patchelf`
或者 `chrpath` 命令，不需要源码就可以直接修改。


### patchelf

[`patchelf`](https://github.com/NixOS/patchelf) 需要单独安装：

```shell
$ sudo pacman -S patchelf
```

默认会设置 `RUNPATH`：

```shell
$ patchelf --set-rpath '$ORIGIN/../lib' foo
$ patchelf --print-rpath foo
```


### chrpath

安装 `chrpath`：

```shell
$ sudo pacman -S chrpath
```

`chrpath` 也可以用来查看 `RPATH / RUNPATH`。

```shell
$ chrpath -l foo
```

修改 `RPATH / RUNPATH`：

```shell
$ chrpath -r '$ORIGIN/../lib' foo
```
