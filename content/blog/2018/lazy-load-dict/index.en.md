---
title: "Lazy Loading in Python"
tags: ["Python", "Lazy Loading"]
date: 2018-05-10T10:13:03+08:00
licensed: true
draft: false
---

[Lazy loading](https://en.wikipedia.org/wiki/Lazy_loading)
is a design pattern which defers resource initialization until needed.
The resource loading often involves slow I/O operations, and results in
memory consumption. Therefore, lazy loading
could be efficient if the resources are not eagerly requested,
especially when only part of the resources will be actually
used in the program.

In the following sections, I will discuss about how to do lazy loading
in Python.


## An eager loading example

This is an eager loading example which loads all resources
in the beginning.

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


## Lazy loading example

In this example, the properties are only loaded when
accessed the first time.

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


## Use `__getattr__`

The previous example looks quite verbose. We may use `__getattr__`
to ease the life.

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


## Lazy loading with dict like object

If you would like access the resources like an Python dict,
it could be done by inheriting
[`Mapping`](https://docs.python.org/3/library/collections.abc.html).

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

The object is protected from direct modification.
`Mapping` could be changed to
[`MutableMapping`](https://docs.python.org/3/library/collections.abc.html#collections.abc.MutableMapping)
if direct modification of the map is required.
