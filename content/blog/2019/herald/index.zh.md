---
title: "Herald: 轻量级的任务分发系统"
tags: [Herald, 'Task Dispatcher', Go, HMAC, nginx, curl]
date: 2019-11-15T19:07:18+08:00
licensed: true
draft: false
---

日常服务器管理总会遇到一些相似的任务，比如证书更新、数据备份、
应用部署，软件更新等等。
通过一些脚本来可以简化这些过程，但是这些脚本相对过于分散，不易管理，
尤其是有多个服务器的情况。

当然有很多成熟的工具可以帮助实现这些功能，比如
Puppet，[Jenkins](https://jenkins.io/)。
不过我不希望使用这种过于庞大的系统，只需要完成一些简单的任务，
也可以省去数据库的支持。

所以我的目标是创建一个任务分发系统，能够满足：
1. 根据多种条件触发。
2. 自动执行 Git 上的任务脚本，不需要每个服务器分别部署。
3. 存在一个中心服务管理所有流程，其余服务器只要能够被调度运行远程任务就可以了。
4. 执行远程任务同时要保证安全性，并且远程任务的结果可以安全返回给中心服务。
5. 而所有任务流都通过 `yaml` 文件来配置。

于是我创建了 Herald 任务分发系统，Herald 使用 Go 语言来实现。
这种多任务的处理使用 Go 语言的 goroutine 来实现是很方便的，
而 Go 自带的 `net/http` 标准库也很方便用于远程的一些操作。

Herald 包含了一个核心库
[Herald](https://github.com/heraldgo/herald)，一个服务程序
[Herald Daemon](https://github.com/heraldgo/heraldd)，以及一些插件，
所有工程都放在 <https://github.com/heraldgo> 下面。


## 安装 Herald Daemon

一个完整的服务只需要安装
[Herald Daemon](https://github.com/heraldgo/heraldd)。

从 [github releases 页面](https://github.com/heraldgo/heraldd/releases)
根据需要的平台下载压缩包并解压。

写一个 [YAML](https://yaml.org/) 配置文件就可以运行了：

```shell
$ heraldd -config config.yml
```

按 `Ctrl+C` 可以安全退出。


## 如何写配置文件

配置文件里主要是定义任务的流程，包含了以下几个部分。

1. `trigger`: 定义事件触发器，比如定时事件，或者 HTTP 请求触发等等。
2. `selector`: 定义事件过滤器，只通过特定的触发事件，
   是否通过由 `trigger` 和 `select` 参数决定。
3. `executor`: 决定任务如何执行，接收 `trigger` 和 `job` 的参数。
4. `router`: 将以上组件串联起来，定义一个完整的任务流程。

`trigger`，`selector`，`executor` 的配置结构类似，
以 `selector` 为例：

```yaml
selector:
  selector_name:
    type: selector_type

    param1: value1
    param2: value2
```

同一类型的组件是不能重名的。
每个组件设置对应的组件类型 `type`，如果 `type` 和名字相同，则可以省略。
除去 `type` 以外的都作为组件参数，不同的组件类型有不同的参数定义。

> Herald Daemon 可用的组件类型及参数定义可以在
> [README](https://github.com/heraldgo/heraldd) 里查看。
> 如果已有组件类型不能够满足需求，
> 也可以[通过插件方式进行扩展](https://github.com/heraldgo/heraldd#extend-components-with-plugin)。

不是所有组件都需要配置，没有配置的可以在 `router` 中直接指定
`type` 作为名字并且使用默认参数。

`router` 的配置结构如下，`select_param` 参数传递给 `selector`，
`job_param` 参数会传给 `executor`。

```yaml
router:
  router_name:
    trigger: trigger_name
    selector: selector_name
    task:
      task_name: executor_name
    select_param:
      param1: value1
    job_param:
      param2: value2
      param3: value3
```


### 定时打印

这里通过一个简单的例子来展示如何通过配置文件来定义任务流程。
将以下内容保存为 `config.yml` 文件，运行 `heraldd` 启动 Herald Daemon.

```yaml
trigger:
  every2s:
    type: tick
    interval: 2

router:
  print_param_every2s:
    trigger: every2s
    selector: all
    task:
      print_param: print
```

这个例子里定义了一个每隔两秒触发一次的 trigger `every2s`，
而 router `print_param_every2s` 负责接收这个触发，
并且通过 selector `all` 判断是否执行 task `print_param`，
如果通过判定则将参数传递给 executor `print` 执行。

总体效果就是每隔 2 秒会在屏幕上打印一串参数。


### 本机执行命令

只是打印参数并不能满足需要，executor 类型 `local` 可以用于执行外部命令，
甚至是 Git 上的脚本。

```yaml
trigger:
  wednesday_morning:
    type: cron
    cron: '30 6 * * 3'

executor:
  local_command:
    type: local
    work_dir: /var/lib/heraldd/work

router:
  uptime_wednesday_morning:
    trigger: wednesday_morning
    selector: all
    task:
      run_local: local_command
    job_param:
      cmd: uptime
  print_result:
    trigger: exe_done
    selector: match_map
    task:
      print_result: print
    select_param:
      match_key: router
      match_value: uptime_wednesday_morning
    job_param:
      print_key: trigger_param/result
```

这里定义了一个 executor `local_command`，需要指定一个 `work_dir`，
主要用来存放 Git 仓库 (`<work_dir>/gitrepo`)，
并且用作执行命令的当前目录 (`<work_dir>/run`)，可以存放命令 log 和中间文件。

trigger `wednesday_morning` 则使用常用的 [crontab](https://en.wikipedia.org/wiki/Cron)
语法定义触发时间。
router `uptime_wednesday_morning` 接收 trigger 并且指定通过 executor `local_command`
执行任务，`cmd` 作为参数传递给 executor。

第二个 router `print_result` 是用来打印上一步执行结果的，
这里使用了一个内部的 trigger `exe_done`，这个 trigger 不需要也不能够显式定义，
在每个 job 执行结束以后会自动触发，触发参数就是上一步执行的结果。
这里就打印了上一步 `uptime` 的运行结果。

> `exe_done` 可以用来生成一个任务链，如果任务有多个步骤的话。
> 用好的话能够实现很有意思的功能，比如将运行结果保存下来以供显示监控。
> 不过需要非常注意的是使用 `exe_done` 的时候千万要选择合适的 selector，否则会导致无限循环。
> 因为 `exe_done` 触发后也会执行任务，然后也会触发新的 `exe_done`。


### 本机执行 Git 仓库中的脚本

通过 Git 仓库来执行脚本对服务器维护会带来极大便利，这样就不用在每台机器上都部署脚本。

以下是如何配置 executor 执行 Git 仓库脚本的例子：

```yaml
trigger:
  wednesday_morning:
    type: cron
    cron: '30 6 * * 3'

executor:
  local_command:
    type: local
    work_dir: /var/lib/heraldd/work

router:
  run_git_script:
    trigger: wednesday_morning
    selector: all
    task:
      run_git: local_command
    job_param:
      repo: https://github.com/heraldgo/demo-script.git
      cmd: run/backup.sh
  print_result:
    trigger: exe_done
    selector: match_map
    task:
      print_result: print
    select_param:
      match_key: executor
      match_value: local_command
    job_param:
      print_key: trigger_param/result
```

`local` executor 会自动将 `repo` 指定的 Git 仓库拉取到本地目录
`<work_dir>/gitrepo` 下面，然后执行 `cmd` 对应的脚本命令。
只要是 Git 仓库中的可执行文件，都可以运行，所以对脚本语言并没有限制。
所有 executor 参数都通过环境变量 `HERALD_EXECUTE_PARAM` 以 `json`
格式传递给命令。

脚本标准输出的内容是会作为结果返回给 Herald Daemon 的，所以尽量避免输出
大量信息。输出的内容如果可以转换为 `json`，则会作为 `json` 格式与结果
合并后返回，如果不能转换，则作为字符串放在结果的 `output` 中返回。

由于可以执行任意脚本，所以 Git 仓库的权限必须小心处理，
只有可信任的用户才能够拥有写的权限。并且千万不要把用户名密码之类的
敏感信息放在 Git 仓库里，可以考虑通过 job 参数的方式写在配置文件里，
并且安全设置配置文件的权限：

```shell
$ chmod go-rwx config.yml
```


### 远程执行

远程执行命令可以使用 executor 类型 `http_remote`。

#### 安装配置 Herald Runner

`http_remote` 需要配合
[Herald Runner](https://github.com/heraldgo/herald-runner)
一起使用，Herald Runner 本质上就是一个 HTTP 服务。

在执行远程命令的服务器上先安装 Herald Runner。
从 [github releases 页面](https://github.com/heraldgo/herald-runner/releases)
下载二进制文件解压。

Herald Runner 需要提供如下配置文件来启动：

```yaml
log_level: INFO
log_output: /var/log/herald-runner/herald-runner.log

host: 0.0.0.0
port: 8124
#unix_socket: /var/run/herald-runner/herald-runner.sock

secret: the_secret_should_be_strong_enough
work_dir: /var/lib/herald-runner/work
```

其中 `secret` 用于 [SHA256 HMAC](https://en.wikipedia.org/wiki/HMAC)
签名验证，以确保远程请求没有被伪造或篡改。

执行以下命令启动 Herald Runner：

```shell
$ herald-runner -config config.yml
```

如果还希望通过 HTTPS 加密请求内容，可以通过 [nginx](https://nginx.org/)
做反向代理并设置证书。


#### 配置 Herald 执行远程任务

```yaml
trigger:
  wednesday_morning:
    type: cron
    cron: '30 6 * * 3'

executor:
  remote_command:
    type: http_remote
    host: https://herald-runner.example.com/
    secret: the_secret_must_be_exactly_the_same_as_herald_exe_server
    data_dir: /var/lib/heraldd/data

router:
  run_git_script:
    trigger: wednesday_morning
    selector: all
    task:
      run_git: remote_command
    job_param:
      repo: https://github.com/heraldgo/demo-script.git
      cmd: run/backup.sh
  print_result:
    trigger: exe_done
    selector: except_map
    task:
      print_result: print
    select_param:
      except_key: router
      except_value: print_result
    job_param:
      print_key: trigger_param/result
```

`host` 指定的是远程地址，也就是 Herald Runner 服务的地址，
`secret` 必须与 Herald Runner 完全一致，
`data_dir` 目录里面会放置远程调用返回的文件。

这里 router 设定的 job 参数和 `local` executor 是完全类似的，
可以直接执行 Git 仓库中的脚本。


#### 获取远程生成的文件

远程命令可能会生成一些文件，比如备份数据。
如果希望执行远程任务的同时返回数据文件，只需要在脚本中输出正确的格式。

脚本的 `json` 输出需要包含 `file` 项以及文件的路径，可以包含多个文件：

```json
{
  "file": {
    "file1": "/full/path/of/file1.dat",
    "file2": "/full/path/of/file2.dat"
  },

  "other_key1": "value1",
  "other_key2": "value2",
  ...
}
```

> 所有 `file` 会以 [multipart](https://tools.ietf.org/html/rfc2046#section-5)
> 的方式自动传回 Herald Daemon 并保存到 `http_remote` 设置的
> `data_dir` 下面，并且做 [SHA-256](https://en.wikipedia.org/wiki/SHA-2) 校验。

最终 executor `http_remote` 返回的则是转换成本地路径后的结果：

```json
{
  "file": {
    "file1": "/data_dir/job_id/file1/file1.dat",
    "file2": "/data_dir/job_id/file2/file2.dat"
  },

  "other_key1": "value1",
  "other_key2": "value2",
  ...
}
```


### 手动触发任务

有时候某些任务需要手动触发，比如调试脚本。
trigger `http` 提供了一种实现方式。

```yaml
trigger:
  manual:
    type: http
    host: 127.0.0.1
    port: 8123

router:
  manual_command:
    trigger: manual
    selector: match_map
    task:
      run_command: local_command
    select_param:
      match_key: command
      match_value: uptime
    job_param:
      cmd: uptime
  manual_backup:
    trigger: manual
    selector: match_map
    task:
      backup_db: local_command
    select_param:
      match_key: backup
    job_param:
      repo: https://github.com/heraldgo/demo-script.git
      cmd: run/backup.sh
  print_result:
    trigger: exe_done
    selector: except_map
    task:
      print_result: print
    select_param:
      except_key: router
      except_value: print_result
    job_param:
      print_key: trigger_param/result
```

通过 HTTP 请求可以触发对应的任务，请求必须是 `json` 格式，
会作为 trigger 参数传给 selector 和 executor。

通过 `curl` 命令可以很方便地触发任务：

```shell
$ curl -i -H "Content-Type: application/json" -X POST -d '{"command":"uptime"}' http://localhost:8123
$ curl -i -H "Content-Type: application/json" -X POST -d '{"backup":"service1"}' http://localhost:8123
```

更复杂的逻辑可以通过脚本来处理 trigger 和 job 参数。

必须注意这个 trigger 没有设置任何权限控制，
所以千万不要把端口开放给全世界，否则任何人都能够操控你的服务器。


## 灵活性和可扩展性

Herald 并不限制 trigger、executor、selector 以及 router 的个数，
所以它们之间可以产生各种复杂的组合。

由于可以调用任意可执行程序，大部分情况下可以满足需求。
即使对已有组件不够满意，
[通过插件扩展](https://github.com/heraldgo/heraldd#extend-components-with-plugin)起来也很方便。
甚至可以基于 [Herald](https://github.com/heraldgo/herald) 核心库自行开发新的程序。

目前 Herald 主要被我用于服务器的管理。不过基于其灵活的设计，也许它还可以有
更广泛的用途值得去发现。
