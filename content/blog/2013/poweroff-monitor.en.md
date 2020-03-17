---
title: "Turn the Monitor Screen off in Windows"
tags: [C, Windows, MinGW, 'GNU Make']
date: 2013-06-29T21:58:16+08:00
licensed: true
draft: false
---

Sometimes we would like to turn off the screeen immediately.
But it seems that there is not a very convenient command or tool
to do it under windows.

This should be a very simple operation and a search from google
shows that it could be accomplished by broadcasting a `WM_SYSCOMMAND`
message:

```c
PostMessage(HWND_BROADCAST, WM_SYSCOMMAND, SC_MONITORPOWER, 2);
```

Here is a project with `Makefile` and compiled with
[MinGW](http://www.mingw.org/).

<https://github.com/xianghuzhao/mirror>

The `-mwindows` link option is used to hide the console window.
