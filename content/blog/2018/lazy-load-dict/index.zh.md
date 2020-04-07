---
title: "Python 中实现延迟加载"
tags: ["Python", "Lazy Loading"]
date: 2018-05-10T10:13:03+08:00
licensed: true
draft: false
---

[延迟加载 (lazy loading)](https://en.wikipedia.org/wiki/Lazy_loading)
是一种仅在资源第一次调用时才进行真正加载的模式。资源加载通常会涉及到较慢的
I/O 操作，并且会占用内存，因此合理使用延迟加载可以有效地节约初始化时间和内存消耗，特别是在资源并不是每次都会全部用到的情况。

本文将讨论在 Python 中实现延迟加载的一些思路。


## 预加载的例子

下面这个例子在初始化时一次性加载所有资源。

```python
def load(name):
    return 'Content of ' + name

class Eager(object):
    def __init__(self):
        self.__first = load('first')
        self.__second = load('second')

    @property
    def first(self):
        return self.__first

    @property
    def second(self):
        return self.__second

e = Eager()
print(e.first)
print(e.second)
```


## 延迟加载例子

这个例子里资源仅在第一次调用时才会载入内存。

```python
class Lazy1(object):
    def __init__(self):
        self.__first = None
        self.__second = None

    @property
    def first(self):
        if self.__first is None:
            self.__first = load('first')
        return self.__first

    @property
    def second(self):
        if self.__second is None:
            self.__second = load('second')
        return self.__second

lazy1 = Lazy1()
print(lazy1.first)
print(lazy1.second)
```


## 使用 `__getattr__`

上面的例子看起来有些罗嗦，`__getattr__` 可以简化这一实现。

```python
class Lazy2(object):
    def __init__(self):
        self.__data = {}

    def __getattr__(self, name):
        if name not in self.__data:
            self.__data[name] = load(name)
        return self.__data[name]

    def __setattr__(self, name, value):
        if not name.startswith('_'):
            raise AttributeError("can't set attribute")
        object.__setattr__(self, name, value)

lazy2 = Lazy2()
print(lazy2.first)
print(lazy2.second)
```


## 延迟加载 Python dict

如果想用类似字典映射的方式进行延迟加载，可以通过继承
[`Mapping`](https://docs.python.org/3/library/collections.abc.html)
实现。

```python
try:
    from collections.abc import Mapping
except ImportError:
    from collections import Mapping

class Lazy3(Mapping):
    def __init__(self):
        self.__data = {}

    def __getitem__(self, name):
        if name not in self.__data:
            self.__data[name] = load(name)
        return self.__data[name]

    def __iter__(self):
        return iter(self.__data)

    def __len__(self):
        return len(self.__data)

lazy3 = Lazy3()
print(lazy3['first'])
print(lazy3['second'])
```

上面这个对象不能直接修改内容，因此可以保护内容完整性。如果希望允许修改，可以把 `Mapping` 改为
[`MutableMapping`](https://docs.python.org/3/library/collections.abc.html#collections.abc.MutableMapping)。
