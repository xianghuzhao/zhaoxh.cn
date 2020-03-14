---
title: Python 中创建相同的类
date: 2016-12-18 04:42:19+00:00
tags: [Python, Class]
licensed: true
---

## 继承

创建新的类。虽然可以实现，但是本应是相同层次结构

```python
class new_class(old_class):
    pass

new_class.__name__ == 'new_class'
```


## 创建新类

无继承关系，相同层次

```python
new_class = type('new_class', old_class.__bases__, dict(old_class.__dict__))

new_class.__name__ == 'new_class'
```

需要注意 mutable attribute values


## 赋值

指向同一个类，相当于别名

```python
new_class = old_class

new_class.__name__ == 'old_class'
```


## 导入

指向同一个类

```python
from module import new_class as old_class

new_class.__name__ == 'old_class'
```

但是不知道如何导入同一模块中的其他类


## 参考：

<http://stackoverflow.com/questions/840969/how-do-you-alias-a-python-class-to-have-another-name-without-using-inheritance>

<http://stackoverflow.com/questions/9541025/how-to-copy-a-python-class>
