---
title: "Lazy Load dict in python"
tags: ["python", "lazy load"]
date: 2018-05-10T10:13:03+08:00
licensed: true
draft: true
---

Lazy load dict with `collections.MutableMapping` in python.

In case you are loading different files as items, only do the real
loading operation when accessed.

<!--more-->

Could also write something about how to make the dict readonly through
`__setitem__`, so that unwanted items will never appear in the dict.

Should missing `__setitem__` work also? Try that.

First write a load all version:

```python
class Lazy1:
    def __init__(self):
        self.__first = load('first')
        self.__second = load('second')

    @property
    def first(self):
        return self.__first

    @property
    def second(self):
        return self.__second
```

Then write a verbose version of lazy load:

```python
class Lazy2:
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

# Alternatively use missing method with dict
class Lazy3:
    def __init__(self):
        self.__data = {}

    def __missing__(self):
        return self.__data[key]
```

At last with `collections.MutableMapping`:
