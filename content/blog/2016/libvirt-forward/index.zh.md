---
title: Libvirt 端口转发
date: 2016-08-13T02:08:36+00:00
tags: [Libvirt, Port Forwarding, Firewall, CentOS, KVM, NAT, iptables]
licensed: true
draft: false
---

通过 [libvirt](https://libvirt.org/)
创建的 [KVM](https://www.linux-kvm.org/)
虚拟机，如果虚拟网络设置为 NAT 而不是 bridge
的话，从宿主机之外是没有办法直接访问的，只能在宿主机上进行连接。

如果想开放虚拟机的某个服务端口，比如 ssh 或者
http，可以在宿主机上设置 iptables 规则。

本文参考 [libvirt 网络配置文档](https://wiki.libvirt.org/page/Networking)。


## 禁用 firewalld

在 CentOS 7 下 `firewalld` 与 `libvirtd` 有冲突，必须先禁用
`firewalld`。

```shell
$ sudo systemctl stop firewalld.service
$ sudo systemctl disable firewalld.service
```


## 允许路由转发

添加 `/etc/sysctl.conf` 选项允许 ip forward：

```
net.ipv4.ip_forward = 1
```

修改后要重启才会生效。如果要即时生效，需要直接运行：

```shell
$ sudo sysctl -p
```


## 设置 iptables 转发规则

需要实现的是，当访问宿主机 (`HOST_IP`) 的特定端口 (`HOST_PORT`)
时，转发给指定的虚拟机端口 (`GUEST_IP:GUEST_PORT`)。

在宿主机上运行以下 `iptables` 命令：

```shell
$ sudo iptables -I FORWARD -o virbr0 -d $GUEST_IP --dport $GUEST_PORT -j ACCEPT
$ sudo iptables -t nat -I PREROUTING -p tcp --dport $HOST_PORT -j DNAT --to $GUEST_IP:$GUEST_PORT
```

然后就可以通过 `HOST_IP:HOST_PORT` 访问到虚拟机的端口了。

不过这样操作并不是很方便，虚拟机以及端口多了的话会很混乱。


## 使用 hook 脚本自动配置

通过 `virsh start` 启动和虚拟机关闭时，会自动调用 hook 脚本
`/etc/libvirt/hooks/qemu`，于是可以通过脚本来自动添加和删除
iptables 规则。

为了简化虚拟机端口转发配置，我写了
[libvirt-forward](https://github.com/xianghuzhao/libvirt-forward)
这个程序。此程序在 CentOS 6/7 下面成功测试过。

程序支持 `json` 和 `yaml` 两种配置格式，如果要使用
`yaml` 格式需要安装 `PyYAML`：

```shell
$ sudo yum install PyYAML
```

复制 `qemu-hook` 程序到 `/etc/libvirt/hooks` 目录下面，建立符号链接：

```shell
$ sudo cp libvirt-forward/qemu-hook /etc/libvirt/hooks/qemu-hook
$ sudo ln -s qemu-hook qemu
```

创建配置文件目录：

```shell
$ sudo mkdir -p /etc/libvirt/hooks/config
$ sudo cp libvirt-forward/config/config.yaml.example /etc/libvirt/hooks/config/config.yaml
```

编辑 `config.yaml`：

```yaml
public_ip: 222.222.222.222

local_range: 192.168.122.0/24

domain:
  MySQL:
    private_ip: 192.168.122.20
    local_range: 192.168.122.0/25
    port_map:
      tcp:
        - [10022, 22]
        - 3306

  Apache:
    private_ip: 192.168.122.30
    port_map:
      tcp:
        - [20022, 22]
        - 80
        - 443
```

`public_ip` 为宿主机 ip 地址。每个虚拟机的转发规则对应
`domain` 下某个选项，选项名字和
libvirt 虚拟机名字相同，虚拟机名字可以通过
`virsh list --all` 查看。

`private_ip` 则是虚拟机的 ip 地址。
`port_map` 里设置需要转发的端口列表，转发端口相同的话只需要指定一个端口号，否则需要指定
`[HOST_PORT, GUEST_PORT]`。

修改完配置后需要关闭虚拟机，然后通过 `virsh start VMNAME` 启动时才会生效，
虚拟机关闭后，转发规则也会自动删除。
