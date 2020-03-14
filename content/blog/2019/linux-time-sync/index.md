---
title: "Linux 下的时间同步"
tags: [Linux, 'Time Sync', NTP, systemd, systemd-timesyncd, NTP daemon, chrony]
date: 2019-02-20T00:09:38+08:00
licensed: true
draft: false
---

[NTP (Network Time Protocol)](https://en.wikipedia.org/wiki/Network_Time_Protocol)
是目前广泛使用的时间同步协议。

以下介绍的几种 NTP 工具是相互排斥，不能同时运行的。
根据自己的需要选取一种即可。


## systemd-timesyncd

[systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/systemd-timesyncd.service.html)
是 `systemd` 自带的时间同步服务。`systemd-timesyncd` 只实现了
[SNTP](https://tools.ietf.org/html/rfc4330) 客户端。
SNTP 是一个简化版的 NTP 协议，且 `systemd-timesyncd` 不提供 NTP 服务功能。

通常在不需要使用 NTP 服务的情况，`systemd-timesyncd` 完全可以满足要求，
它跟随 `systemd` 一起安装，配置也简单。

使用 `timedatectl` 命令查看 NTP 状态：

```
$ timedatectl status
               Local time: Fri 2019-02-13 15:06:55 CST
           Universal time: Fri 2019-02-13 07:06:55 UTC
                 RTC time: Fri 2019-02-13 07:06:55
                Time zone: Asia/Shanghai (CST, +0800)
System clock synchronized: no
              NTP service: inactive
          RTC in local TZ: no
```

开启 `systemd-timesyncd` 服务：

```shell
$ sudo timedatectl set-ntp true
```

```
$ timedatectl                                                                                                                                                                                                                                           [2020/03/13 15:09:05]
               Local time: Fri 2019-02-13 15:09:25 CST
           Universal time: Fri 2019-02-13 07:09:25 UTC
                 RTC time: Fri 2019-02-13 07:09:26
                Time zone: Asia/Shanghai (CST, +0800)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

通过 `systemd` 也可以查看服务状态：

```shell
$ sudo systemctl status systemd-timesyncd.service
```

查看详细同步信息：

```
$ timedatectl timesync-status
       Server: 119.28.183.184 (0.arch.pool.ntp.org)
Poll interval: 1min 4s (min: 32s; max 34min 8s)
         Leap: normal
      Version: 4
      Stratum: 2
    Reference: 647A24C4
    Precision: 1us (-23)
Root distance: 26.595ms (max: 5s)
       Offset: -19.989ms
        Delay: 110.115ms
       Jitter: 0
 Packet count: 1
    Frequency: -0.594ppm
```


## NTP daemon

[NTP daemon](http://www.ntp.org/) 是 NTP 的官方参考实现，
长期以来一直作为 Linux 发行版默认的 NTP 服务。

禁用 `systemd-timesyncd` 以避免冲突：

```shell
$ sudo systemctl stop systemd-timesyncd.service
$ sudo systemctl disable systemd-timesyncd.service
```

安装 NTP daemon，以 Arch Linux 为例：

```shell
$ sudo pacman -S ntp
```

启动 NTP daemon：

```shell
$ sudo systemctl start ntpd.service
$ sudo systemctl enable ntpd.service
```

查看同步状态：

```
$ ntpq -p
     remote           refid      st t when poll reach   delay   offset  jitter
==============================================================================
+stratum2-1.ntp. 89.175.20.7      2 u   40   64  177  118.526   39.404  28.122
*ntp.xtom.nl     194.80.204.184   2 u   37   64  177  156.387   32.179  28.038
-ntp5.flashdance 192.36.143.152   2 u   43   64  177  374.351   -0.402  28.598
+185.216.231.25  17.253.4.125     2 u   47   64   77  194.210   22.839  27.734
```

如果需要选择 NTP 服务器，可以在 `/etc/ntp.conf` 里面配置。


## chrony

[chrony](https://chrony.tuxfamily.org/) 是 NTP 的另一种实现。
在 CentOS 7 里，`chrony` 已经替代 `NTP daemon` 成为默认的 NTP 服务。

同样需要先禁用 `systemd-timesyncd`：

```shell
$ sudo systemctl stop systemd-timesyncd.service
$ sudo systemctl disable systemd-timesyncd.service
```

安装 chrony：

```shell
$ sudo pacman -S chrony
```

编辑配置文件 `/etc/chrony.conf`，选择合适的 NTP 服务器。

启动 NTP daemon：

```shell
$ sudo systemctl start chronyd.service
$ sudo systemctl enable chronyd.service
```

使用 `chronyc` 查看同步状态：

```
$ chronyc tracking
Reference ID    : B9D8E719 (185.216.231.25)
Stratum         : 3
Ref time (UTC)  : Wed Feb 13 07:41:58 2019
System time     : 0.000005473 seconds slow of NTP time
Last offset     : +0.005614544 seconds
RMS offset      : 0.005614544 seconds
Frequency       : 0.594 ppm fast
Residual freq   : -357.167 ppm
Skew            : 6.564 ppm
Root delay      : 0.210207403 seconds
Root dispersion : 0.024726424 seconds
Update interval : 2.2 seconds
Leap status     : Normal
```
