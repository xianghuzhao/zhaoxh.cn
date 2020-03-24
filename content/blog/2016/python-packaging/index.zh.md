---
title: Python 程序打包发布
date: 2016-12-29T19:02:34+08:00
tags: [Python, Packaging, PyPI, pip]
licensed: true
draft: false
---

将 Python 程序发布到
[PyPI](https://pypi.org/)
上，以便能够方便共享。

以下是基本步骤，详细可参看
<https://packaging.python.org/guides/distributing-packages-using-setuptools/>。


## 相关文件

### setup.py

```python
import os

from setuptools import setup, find_packages


HERE = os.path.abspath(os.path.dirname(__file__))

with open(os.path.join(HERE, 'package-name', 'VERSION')) as version_file:
    VERSION = version_file.read().strip()

with open(os.path.join(HERE, 'README.md')) as f:
    LONG_DESCRIPTION = f.read()

setup(
    name='package-name',
    version='1.0.0',
    description='Package description',
    long_description=LONG_DESCRIPTION,
    long_description_content_type='text/markdown',
    url='https://example.com/',
    author='Xianghu Zhao',
    author_email='xianghuzhao@gmail.com',
    license='MIT',

    classifiers=[
        'Development Status :: 5 - Production/Stable',

        'Intended Audience :: Developers',
        'Topic :: Software Development :: Libraries :: Python Modules',

        'License :: OSI Approved :: MIT License',

        'Programming Language :: Python :: 2',
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: Implementation :: CPython',
        'Programming Language :: Python :: Implementation :: PyPy',
    ],

    keywords=[],
    packages=find_packages(exclude=[]),
    include_package_data=True,
    tests_require=[
        'pytest',
    ],
)
```


### setup.cfg

```ini
[bdist_wheel]
universal=1
```


### MANIFEST.in

```
include package-name/VERSION
```


## 安装工具

```shell
$ pip install whell
```

```shell
$ pip install twine
```


## 打包

```shell
$ python setup.py sdist bdist_wheel
```


## 上传

```shell
$ twine upload dist/*
```
