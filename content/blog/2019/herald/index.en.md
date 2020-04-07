---
title: "Herald: A Lightweight Task Dispatch System"
tags: [Herald, 'Task Dispatcher', Go, HMAC, nginx, curl]
date: 2019-11-15T19:07:18+08:00
licensed: true
draft: false
---

There are many works when maintaining the server, like certificates
update, data backup, application deployment, software update, etc.
We could use scripts to simplify these processes. But the management
of scripts is also another challenge, especially when there are many
servers to take care.

Many tools are born for these goals, like Puppet,
[Jenkins](https://jenkins.io/).
But I do not want such a complex system.
I would like only to accomplish some simple jobs,
and database is totally not necessary for my situation.

Here are the objective for the new task dispatch system:
1. It could accept various triggers.
2. It is able to execute scripts from Git repository, which will
   simplify job deployment for multiple servers.
3. There should be one center service managing the whole workflow of tasks,
   and other servers only receive and execute them.
4. The security of task execution for remote servers must be carefully
   considered, while job results should also be returned safely.
5. The full workflow could be configured by `yaml` file.

So the task dispatch system "Herald" is created, which is implemented in
Go. Go is quite fit for multiple tasks via goroutine, and its `net/http`
standard library is suitable for remote operation.

Herald contains the core library
[Herald](https://github.com/heraldgo/herald),
the [Herald Daemon](https://github.com/heraldgo/heraldd),
and some plugins.
All the projects are located at <https://github.com/heraldgo>.


## Installation of Herald Daemon

We could run the service by installing
[Herald Daemon](https://github.com/heraldgo/heraldd).

The binary files are located on
[github releases page](https://github.com/heraldgo/heraldd/releases).
Download the file with right platform and extract it.

Then provide a [YAML](https://yaml.org/) configuration file and
run the Herald Daemon:

```shell
$ heraldd -config config.yml
```

Press Ctrl+C to exit.


## Structure of configuration

The workflow is defined in a single `YAML` file, which mainly
includes the following components:

1. `trigger`: defines when to start the workflow, like fixed time, HTTP
   requests reception.
2. `selector`: defines whether to proceed for job execution, which
   depends on `trigger` and `select` parameters.
3. `executor`: defines how to execute the job, which accepts
   `trigger` and `job` parameters.
4. `router`: connects all the components above, and defines a complete task.

The configuration structure for `trigger`, `selector` and `executor` are
quite similar. Take `selector` as an example:

```yaml
selector:
  selector_name:
    type: selector_type

    param1: value1
    param2: value2
```

The name for the same component must be unique. Each component should
have its `type`, which could be omitted if it is the same as the
component name. All remaining parameters are passed to component.
The parameters vary among different component types.

> All available component types and parameter definitions could be found
> in [README](https://github.com/heraldgo/heraldd).
> In case they could not meet your requirements, new components could be
> [extended by plugin](https://github.com/heraldgo/heraldd#extend-components-with-plugin).

It is not necessary to write configuration for all components.
They could be specified by the `type` name in `router` directly,
which will use their default parameters.

Here is the structure of `router` configuration. `select_param`
will be passed to `selector` and `job_param` to `executor`.

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


## Print periodically

This is a simple example which shows how to define workflow
in the configuration file.
Save the following content as `config.yml` file, then run
`heraldd` to start the Herald Daemon.

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

In this example, the trigger `every2s` will be active every 2 seconds.
The router `print_param_every2s` will receive the trigger.
Then the selector `all` will decide whether or not to execute task
`print_param`.
If the selector allows to continue, then the job parameters will be
passed to executor `print` and do the execution.

What we will see is printing some parameters on the screen every 2
seconds.


## Run command on the local server

We could never be satisfied with printing some parameters on the screen.
More could be done with executor type `local`, which could execute
external commands, even scripts located on Git repository.

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

This example defines the executor `local_command` with type `local`.
It needs the `work_dir` for holding Git repository (`<work_dir>/gitrepo`).
The `work_dir` is also used as current directory for commands (`<work_dir>/run`),
where the commands could keep log and intermediate files.

The trigger `wednesday_morning` use the [crontab](https://en.wikipedia.org/wiki/Cron)
syntax to define when to activate the task.
The router `uptime_wednesday_morning` receive this trigger and execute job with executor
`local_command`, where `cmd` is passed as parameter.

The second router `print_result` is used to print the execution result
for the last step. The trigger `exe_done` is used here, which is
provided internally by herald. `exe_done` is activated after any job
execution is finished, with the result of last execution as trigger
parameter. In this example, it prints the result of `uptime` in last
step.

> With `exe_done` it is able to build a task chain for more than one
> step. You could explore many interesting features,
> like job result monitoring.
> Great attention must be payed when choosing selector for `exe_done`,
> or there might be dead loop.
> Because the job activated by `exe_done` will also trigger new
> `exe_done`.


### Execute scripts from Git repository

It could be helpful if the jobs could run scripts from a Git repository.
Then it is not necessary to deploy them on every server.

Here is an example of running scripts from Git repository with executor
type `local`:

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
      git_repo: https://github.com/heraldgo/demo-script.git
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

The `local` executor will pull the `git_repo` to the directory
`<work_dir>/gitrepo`, and then run the scripts specified by `cmd`.
Any executable file in the Git repository could be set as `cmd`,
so there is no restriction on the script language.
All parameters of executor will be passed as the environment variable
`HERALD_EXECUTE_PARAM` in `json` format to the command.

The standard output of the command will be returned to Herald Daemon.
In case the output could be converted to `json`, it will
be merged into the final result map, otherwise it will be directly
set as the `output` item.

Since any scripts could be executed, the authority of the Git repository
must be treated with great care. Only trusted user could have write
permission. Never save sensitive information like user and password in
the repository. They could be set as job parameter in the configuration
file, and set proper access permission:

```shell
$ chmod go-rwx config.yml
```


### Execute job on remote servers

The executor type `http_remote` is provided to run remote jobs.

#### Installation of Herald Runner

`http_remote` must cooperate with
[Herald Runner](https://github.com/heraldgo/herald-runner),
which is essentially an HTTP service.

The server for running remote jobs must install Herald Runner firstly.
The binary executable could be downloaded from the
[github releases page](https://github.com/heraldgo/herald-runner/releases).

Herald Runner need a configuration file like this:

```yaml
log_level: INFO
log_output: /var/log/herald-runner/herald-runner.log

host: 0.0.0.0
port: 8124
#unix_socket: /var/run/herald-runner/herald-runner.sock

secret: the_secret_should_be_strong_enough
work_dir: /var/lib/herald-runner/work
```

The `secret` is used for the signature of
[SHA256 HMAC](https://en.wikipedia.org/wiki/HMAC),
which will guarantee that the request is not forged or hijacked.

Start Herald Runner with：

```shell
$ herald-runner -config config.yml
```

If HTTPS is needed, please consider using [nginx](https://nginx.org/)
as reverse proxy and set up certificates there.


#### Configuration for remote execution

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
      git_repo: https://github.com/heraldgo/demo-script.git
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

`host` specifies the remote URL of Herald Runner.
`secret` must be exactly the same as the Herald Runner service.
The result files from the remote execution will be saved
under `data_dir`.

The job parameters in router is quite similar with the `local` executor,
and remote jobs could also run scripts in Git repository.


#### Retrieve the result files from the remote execution

There could be result data files from the remote execution,
like the backup data.
If you would like to retrieve data files, just set the correct
output format in the script.

The output must be the `json` format and include the `file` item,
where one or more files could be specified:

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

> All files under `file` will be automatically transferred to
> Herald Daemon in the form of
> [multipart](https://tools.ietf.org/html/rfc2046#section-5),
> and saved under `data_dir` of `http_remote` executor.
> The [SHA-256](https://en.wikipedia.org/wiki/SHA-2) checksum
> is also applied to validate the data integrity.

This is the final result after local path conversion by
`http_remote`:

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


### Execute tasks manually

Sometimes tasks need to be executed manually, like debugging scripts.
This could be accomplished by trigger `http`.

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
      git_repo: https://github.com/heraldgo/demo-script.git
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

The jobs could be triggered with HTTP POST request.
The `Content-Type` must be `application/json`.
The `json` request body with be set as the trigger parameter,
which will be passed to selector and executor later.

The HTTP request could be sent with `curl` command:

```shell
$ curl -i -H "Content-Type: application/json" -X POST -d '{"command":"uptime"}' http://localhost:8123
$ curl -i -H "Content-Type: application/json" -X POST -d '{"backup":"service1"}' http://localhost:8123
```

Complex logic could be achieved by dealing with trigger and job
parameters in the script.

Please pay great attention that this trigger does not do any authority
control, so do **NOT** open the port to the world, or else anyone could
manipulate your server.


### Flexibility and extendibility

Herald does not restrict the number of triggers, executors, selectors
and routers, so there could be complicated combinations
for your objective.

Since it is able to run any scripts, it could meet your demands most
of the time. Even if you are not satisfied with the components provided
by Herald Daemon, it is easy to
[extend the components with plugin](https://github.com/heraldgo/heraldd#extend-components-with-plugin).
You could also develop your own program based on
[Herald](https://github.com/heraldgo/herald)
core library.

Now I am using Herald to handle the management of the servers.
However, because of the flexible design,
there could be more interesting applications to explore.
