---
title: "Python 中根据 DAG 进行并行任务处理"
tags: ['Python', 'DAG', 'Parallel Processing']
date: 2018-03-10T13:23:53+08:00
licensed: true
draft: false
---

[有向无环图 (Directed acyclic graph, DAG)](https://en.wikipedia.org/wiki/Directed_acyclic_graph)
通常被用作依赖关系图，可以用于描述任务运行之间的依赖关系。

任务执行顺序必须遵守 DAG 依赖关系。任务之间如果有直接或者间接的依赖，
则必须依次执行，如果任务之间不存在依赖则可以并行执行。

我经常在 Python 下遇到类似的问题，于是写了
[paradag](https://github.com/xianghuzhao/paradag)
这个包，用于描述 DAG，并且可以大大简化任务之间的并行处理。


## 安装

```shell
$ pip install paradag
```


## 创建 DAG

开始运行任务之前，先要创建描述任务依赖关系的 DAG，DAG 中的每个顶点
代表一个任务。DAG 顶点的值可以是任意
[可哈希 (hashable) 对象](https://docs.python.org/3/glossary.html#term-hashable)，比如
整数，字符串，包含可哈希对象的元组，用户定义类的实例等等。

```python
from paradag import DAG

class Vtx(object):
    def __init__(self, v):
        self.__value = v

vtx = Vtx(999)

dag = DAG()
dag.add_vertex(123, 'abcde', 'xyz', ('a', 'b', 3), vtx)

dag.add_edge(123, 'abcde')                  # 123 -> 'abcde'
dag.add_edge('abcde', ('a', 'b', 3), vtx)   # 'abcde' -> ('a', 'b', 3), 'abcde' -> vtx
```

`add_edge` 用于创建描述依赖关系的有向边，第一个参数为起点，
剩余参数为终点，可以同时创建多个边。
创建边时需要注意不要形成环，那样会导致触发 `DAGCycleError` 异常。

以下是常用的 DAG 属性：

```python
print(dag.vertex_size())
print(dag.edge_size())

print(dag.successors('abcde'))
print(dag.predecessors(vtx))

print(dag.all_starts())
print(dag.all_terminals())
```


## 串行执行任务

任务执行需要提供一个 executor，以及可选的 selector。
executor 用于处理每个顶点的任务执行。

```python
from paradag import dag_run
from paradag.sequential_processor import SequentialProcessor

class CustomExecutor:
    def param(self, vertex):
        return vertex

    def execute(self, param):
        print('Executing:', param)

print(dag_run(dag, processor=SequentialProcessor(), executor=CustomExecutor()))
```

`dag_run` 是核心的任务调度执行函数。


## 并行执行任务

并行执行任务和串行基本类似，只需要把 processor 换成
`MultiThreadProcessor` 就可以了。

```python
from paradag.multi_thread_processor import MultiThreadProcessor

dag_run(dag, processor=MultiThreadProcessor(), executor=CustomExecutor())
```

默认的 selector 是 `FullSelector`，它会尝试把尽可能多可以并行的任务
全部交给 processor 执行。如果希望能够控制具体的执行过程，可以自己写
一个 selector。下面这个 selector 最多只允许 4 个任务同时并行运行。

```python
class CustomSelector(object):
    def select(self, running, idle):
        task_number = max(0, 4-len(running))
        return list(idle)[:task_number]

dag_run(dag, processor=MultiThreadProcessor(), selector=CustomSelector(), executor=CustomExecutor())
```

一旦使用 `MultiThreadProcessor`，就必须要注意并行任务的安全
问题。executor 中只有 `execute` 函数是会并行运行的，其它函数都在
主线程内执行。所以在 `execute` 函数内尽可能不要去修改函数外的变量，
所有的参数都通过 `param` 传递，而 `param` 函数所返回的用于 `execute`
函数的参数也尽可能保证相互独立。


## 获取任务状态

在 executor 中还可以实现下面这些可选方法 (`report_*`) 用于获取任务运行状态。

```python
class CustomExecutor:
    def param(self, vertex):
        return vertex

    def execute(self, param):
        print('Executing:', param)

    def report_start(self, vertice):
        print('Start to run:', vertice)

    def report_running(self, vertice):
        print('Current running:', vertice)

    def report_finish(self, vertice_result):
        for vertex, result in vertice_result:
            print('Finished running {0} with result: {1}'.format(vertex, result))

dag_run(dag, processor=MultiThreadProcessor(), executor=CustomExecutor())
```


## 传递运行结果给后续任务

如果任务需要把运行结果传递给被依赖的后续任务，可以实现 `deliver` 方法。

```python
class CustomExecutor:
    def __init__(self):
        self.__level = {}

    def param(self, vertex):
        return self.__level.get(vertex, 0)

    def execute(self, param):
        return param + 1

    def report_finish(self, vertice_result):
        for vertex, result in vertice_result:
            print('Vertex {0} finished, level: {1}'.format(vertex, result))

    def deliver(self, vertex, result):
        self.__level[vertex] = result
```

上一级的运行结果在当前任务开始前自动通过调用 `deliver` 函数传递进来。


## 拓扑排序

[拓扑排序](https://en.wikipedia.org/wiki/Topological_sorting)
也可以通过 `paradag.dag_run` 函数实现。
`dag_run` 函数的返回值就可以看作是拓扑排序的结果。

仅仅得到拓扑排序的结果而不执行任务：

```python
from paradag import SingleSelector, RandomSelector, ShuffleSelector

dag = DAG()
dag.add_vertex(1, 2, 3, 4, 5)
dag.add_edge(1, 4)
dag.add_edge(4, 2, 5)

print(dag_run(dag))
print(dag_run(dag, selector=SingleSelector()))
print(dag_run(dag, selector=RandomSelector()))
print(dag_run(dag, selector=ShuffleSelector()))
```

拓扑排序的结果不是唯一的，使用不同 selector 也会得到不同的结果。
