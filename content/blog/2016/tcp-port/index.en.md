---
title: "Test Tcp Port Connection"
tags: ["TCP", "Firewall", "Telnet", "Netcat", "Socket", "Python"]
date: 2016-12-16T22:01:06+08:00
licensed: true
draft: false
---

While we are checking the status of a web site or web service,
at first we need to test the status of
[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)
connection.

The common connection status includes:

* `Name or service not known`. Name resolution problem.
  Check the name with `nslookup`.
  If all names could not be resolved correctly,
  it should be the DNS problem locally.
* `No route to host`. Could not find the server from route.
  Various reasons could lead to this error, like local route,
  local firewall. It could also be from the server side firewall.
  It may be caused by any problem in the route path.
* `Connection refused`. The server side actively refused the connection.
  It means the server is responsive, but the port is not listened
  (check with `netstat -ntpl`), or the firewall rejects the connection.
* Time out. The connection receives no response after the specified
  period of time. Maybe the server for the IP does not exist or is not
  running. It could also be caused by the server side firewall drops
  the connection.
* Connect successfully. The connection to the server is OK.

The following sections will include some methods on how to test the
status of remote TCP port connection.


## Telnet

`telnet` is a common way used for testing TCP port.
It should be installed if not available.

```
$ telnet github.com 443
Trying 13.250.177.223...
Connected to github.com.
Escape character is '^]'.
```

`Connected to xxx` means successful connection.

However, `telnet` is an interactive command which could not be used
conveniently in a shell script.


## Netcat

[Netcat](https://en.wikipedia.org/wiki/Netcat)
needs to be preinstalled for using the `nc` command.

Test connection and quit:

```
$ nc -z github.com 443
$ echo $?
0
```

This will only check if the port is open, exiting with 0 on
success, 1 on failure.

Check with timeout using `-w` argument:

```
$ nc -z -v -w5 github.com 6789
github.com [13.250.177.223] 6789 (radg): Connection timed out
$ echo $?
1
```


## Bash /dev/tcp

A recent enough bash version provides the built-in virtual file
`/dev/tcp/<host>/<port>` for opening socket connection.
It is not a \*nix feature, and not supported by other shells.

```
$ bash -c 'cat < /dev/null > /dev/tcp/github.com/443'
$ echo $?
0
```

Exiting on 0 means success, while 1 means failure。

Set timeout With `timeout` command:

```
$ timeout 5 bash -c 'cat < /dev/null > /dev/tcp/github.com/6789'
$ echo $?
124

$ timeout 5 bash -c 'cat < /dev/null > /dev/tcp/unknown-hostname/80'
bash: unknown-hostname: Name or service not known
bash: /dev/tcp/unknown-hostname/80: Invalid argument
$ echo $?
1
```

If it isn’t able to establish a connection and the specified timeout
expires, `timeout` will kill bash and exit with 124.
If bash failed within the timeout, the exit code 1 will be directly
returned.


## Write socket program

We could also write a simple program to test the TCP port.

The following `Python` example uses
[socket](https://docs.python.org/3/library/socket.html)
module:

```python
#!/usr/bin/env python

import socket

server = 'github.com'
port = 443
timeout = 5

try:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    sock.connect((server, port))
    print('Connected')
    sock.close()
except socket.error as e:
    print("Couldn't connect to server:", e)
    raise
```
