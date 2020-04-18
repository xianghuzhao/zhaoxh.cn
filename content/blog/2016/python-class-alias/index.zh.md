---
title: Python 中创建类的别名
date: 2016-12-18T12:42:19+08:00
tags: [Python, Class Alias, Class Variable]
description: '在某些情况下，我们需要给一个 Python 类起个别名，但是肯定不会想要复制一遍类的代码。这里讨论一下实现别名的一些办法，各种方法都有其优点，也有使用限制，可以根据需要选取合适的方式。'
licensed: true
draft: false
---

在某些情况下，我们需要给一个 Python
类起个别名，但是肯定不会想要复制一遍类的代码。这里讨论一下实现别名的一些办法，各种方法都有其优点，也有使用限制，可以根据需要选取合适的方式。


## 继承

继承的方式我们通常能够比较直接地想到。

```python
class ClassOld(object):
    pass

class ClassNew(ClassOld):
    pass

print(ClassOld.__name__)    # ClassOld
print(ClassNew.__name__)    # ClassNew
```

大多数情况下，继承的方式是可以很好满足要求的。但是可能会有人觉得继承的方式导致两个类之间就不是同一层级的关系了，而不喜欢这种方式。

```python
print(ClassOld.__base__)    # <class 'object'>
print(ClassNew.__base__)    # <class '__main__.ClassOld'>
```

### 类变量继承

如果含有类变量 (class variable) 的话，它们在子类和父类之间是共享的。

```python
class ClassOld(object):
    Value = 1

class ClassNew(ClassOld):
    pass

print(ClassOld.Value)       # 1
print(ClassNew.Value)       # 1

ClassOld.Value = 5

print(ClassOld.Value)       # 5
print(ClassNew.Value)       # 5
```

如果希望区分开来，还必须显式定义类变量。

```python
class ClassOld(object):
    Value = 1

class ClassNew(ClassOld):
    Value = 2

print(ClassOld.Value)       # 1
print(ClassNew.Value)       # 2

ClassOld.Value = 5

print(ClassOld.Value)       # 5
print(ClassNew.Value)       # 2
```

以上讨论仅限于类变量的情况，而对于[实例变量 (instance variable)](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables)
则不存在这个问题，因为所有实例变量都是在对象创建之后才动态生成的。


## 赋值

Python 中的类其实也是一种对象，是可以直接赋值给变量的。当然新的变量所代表的其实还是原来的类。

```python
class ClassOld(object):
    pass

ClassNew = ClassOld

print(ClassOld.__name__)    # ClassOld
print(ClassNew.__name__)    # ClassOld
```

如果 `__name__` 很重要的话，这种方式就不能使用了。


## 导入别名

如果要使用到的类位于其它模块，可以在导入时起别名。这和赋值的方式是类似的，别名和原来的类代表的是同一个类。

```python
from module import ClassOld as ClassNew

print(ClassNew.__name__)    # ClassOld
```

如果类不在其它模块里，就没有办法使用这种方法了。同样如果需要用到
`__name__` 的话，这种方式也不能使用。


## 复制类

如果一定要创建一个全新的类，保持内容和原来的类完全一样，也可以使用以下方法。


```python
class ClassOld(object):
    pass

ClassNew = type('ClassNew', ClassOld.__bases__, dict(ClassOld.__dict__))

print(ClassOld.__name__)    # ClassOld
print(ClassNew.__name__)    # ClassNew
```

这样两个类之间就无继承关系，处于相同层次。


### 复制类的类变量

使用以上方式创建复制类时，对于类变量，需要注意如果是[不可变 (immutable)](https://docs.python.org/3/glossary.html#term-immutable)
类型，则两类之间不受影响。而如果是[可变 (mutable)](https://docs.python.org/3/glossary.html#term-mutable)
类型，则需要小心以上创建新类时 `dict()` 函数仅仅做了浅拷贝，修改变量时都会受到影响。

```python
class ClassOld(object):
    Value1 = 1              # immutable
    Value2 = 'abc'          # immutable
    Value3 = ['x']          # mutable

ClassNew = type('ClassNew', ClassOld.__bases__, dict(ClassOld.__dict__))

ClassOld.Value1 = 5
print(ClassOld.Value1)      # 5
print(ClassNew.Value1)      # 1

ClassOld.Value2 = 'def'
print(ClassOld.Value2)      # def
print(ClassNew.Value2)      # abc

ClassOld.Value3.append(100)
print(ClassOld.Value3)      # ['x', 100]
print(ClassNew.Value3)      # ['x', 100]

ClassOld.Value3 = {'a': 1}  # assign Value3 to a new value
print(ClassOld.Value3)      # {'a': 1}
print(ClassNew.Value3)      # ['x', 100]
```


## 参考

<http://stackoverflow.com/questions/840969/how-do-you-alias-a-python-class-to-have-another-name-without-using-inheritance>

<http://stackoverflow.com/questions/9541025/how-to-copy-a-python-class>
