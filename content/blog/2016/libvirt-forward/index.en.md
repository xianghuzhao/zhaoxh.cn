---
title: Libvirt Forwarding
date: 2016-08-13T02:08:36+00:00
tags: [Libvirt, Port Forwarding, Firewall, CentOS, KVM, NAT, iptables]
licensed: true
draft: false
---

The [KVM](https://www.linux-kvm.org/) virtual machine
could be managed by [libvirt](https://libvirt.org/).
If the virtual network is set to NAT, the virtual machine
could not be accessed from outside the host.
Incoming connections to the VM are only allowd from host and other
virtual machines on this host.

If you would like to provide services (like ssh or http) from the VM,
port forwarding could be setup with `iptables` on the host.

This article takes [libvirt network wiki](https://wiki.libvirt.org/page/Networking)
as reference.


## Disable firewalld

There are conflicts between `firewalld` and `libvirtd` on CentOS 7.
`firewalld` must be disabled first.

```shell
$ sudo systemctl stop firewalld.service
$ sudo systemctl disable firewalld.service
```


## Allow ip forward

Add option to `/etc/sysctl.conf` to allow ip forward:

```
net.ipv4.ip_forward = 1
```

It will not take effect until reboot. Use `sysctl` command
to make it take effect immediately.

```shell
$ sudo sysctl -p
```


## iptables forwarding rules

What we need now is to forward the traffic from `HOST_IP` on `HOST_PORT`
to specified virtual machine's `GUEST_IP:GUEST_PORT`.

Run the following `iptables` commands on host:

```shell
$ sudo iptables -I FORWARD -o virbr0 -d $GUEST_IP --dport $GUEST_PORT -j ACCEPT
$ sudo iptables -t nat -I PREROUTING -p tcp --dport $HOST_PORT -j DNAT --to $GUEST_IP:$GUEST_PORT
```

Then the virtual machine could be connected from `HOST_IP:HOST_PORT`.

Using these commands is not very convenient, especially when there are
a lot of VMs and ports.


## Automation with hook script

When VMs are started by `virsh start` or shutdown, the hook script
`/etc/libvirt/hooks/qemu` will run automatically. We could use
this script to add and delete the rules of iptables.

In order to simplify the configuration of port forwarding, I wrote
[libvirt-forward](https://github.com/xianghuzhao/libvirt-forward).
It works well on CentOS 6/7.

This program supports `json` and `yaml` configuration. In case you
are going to use `yaml`, please install `PyYAML` first:

```shell
$ sudo yum install PyYAML
```

Copy `qemu-hook` to `/etc/libvirt/hooks` directory and create symbolic
link:

```shell
$ sudo cp libvirt-forward/qemu-hook /etc/libvirt/hooks/qemu-hook
$ sudo ln -s qemu-hook qemu
```

Create configuration directory:

```shell
$ sudo mkdir -p /etc/libvirt/hooks/config
$ sudo cp libvirt-forward/config/config.yaml.example /etc/libvirt/hooks/config/config.yaml
```

Edit `config.yaml`:

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

`public_ip` is the ip address of host.
The forward rules for each VM are configured under `domain`.
The domain name must be the same as the libvirt VM name,
which could be found by `virsh list --all`.

`private_ip` is the ip address of VM.
`port_map` includes the list of ports to be forwarded.
If the port number is the same for both the host and guest,
only one number is needed, or specify `[HOST_PORT, GUEST_PORT]`.

After the modification of configuration,
please shutdown the VM, and use `virsh start VMNAME` to start the VM,
then the rules are automatically added.
After shutdown the VM, these rules will be deleted.
