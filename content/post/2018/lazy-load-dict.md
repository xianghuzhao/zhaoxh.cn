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
