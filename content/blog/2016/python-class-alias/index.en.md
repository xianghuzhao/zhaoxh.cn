---
title: Create Alias for Python Class
date: 2016-12-18T12:42:19+08:00
tags: [Python, Class Alias, Class Variable]
licensed: true
draft: false
---

Sometimes we need to create alias for an existing Python class
without copying every detailed code.
The following sections will discuss about the possible methods,
while each method has its pros and cons. Please choose the one
which meets your demands best.


## Inheritance

It is straightforward to use inheritance as alias.

```python
class ClassOld(object):
    pass

class ClassNew(ClassOld):
    pass

print(ClassOld.__name__)    # ClassOld
print(ClassNew.__name__)    # ClassNew
```

In most cases, inheritance is good enough to act as an alias.
However, someone may feel uncomfortable that the two classes
are not in the same level.

```python
print(ClassOld.__base__)    # <class 'object'>
print(ClassNew.__base__)    # <class '__main__.ClassOld'>
```

### Inheritance of class variable

In case there are class variables, they are shared between parent and
child classes.

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

If separated class variable is required, it must be defined in the child
class explicitly.

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

The discussion above only involves class variables.
For the case of
[instance variable](https://docs.python.org/3/tutorial/classes.html#class-and-instance-variables),
there is no need to worry because all instance variables are created
after the object instantiation.


## Assignment

The class in Python is actually an object,
which could be assigned to variable.
The assigned variable represents exact the same class.

```python
class ClassOld(object):
    pass

ClassNew = ClassOld

print(ClassOld.__name__)    # ClassOld
print(ClassNew.__name__)    # ClassOld
```

However, if it is essential to use `__name__` in your case,
this method would not work.


## Import class with new name

If the class is located in another module, it is able to import it with
a new name. This is similar with assignment method, where the new name
represents the same class.

```python
from module import ClassOld as ClassNew

print(ClassNew.__name__)    # ClassOld
```

This method has the limitation that class must be in another module.
Also, if `__name__` is required, this method should not be used.


## Create and copy from a class

If a totally new class with copied content is needed,
it could be done with the following method.

```python
class ClassOld(object):
    pass

ClassNew = type('ClassNew', ClassOld.__bases__, dict(ClassOld.__dict__))

print(ClassOld.__name__)    # ClassOld
print(ClassNew.__name__)    # ClassNew
```

Then the two classes have no inheritance relationship.


### Class variable for the copied class

The class variable in the copied class created above should also be
treated carefully. In case it is
[immutable](https://docs.python.org/3/glossary.html#term-immutable),
there is nothing to worry about. But if the class variable is
[mutable](https://docs.python.org/3/glossary.html#term-mutable),
please pay attention that only shallow copy is used for `dict()`,
and any modification of the class variable will affect both.

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


## Reference

<http://stackoverflow.com/questions/840969/how-do-you-alias-a-python-class-to-have-another-name-without-using-inheritance>

<http://stackoverflow.com/questions/9541025/how-to-copy-a-python-class>
