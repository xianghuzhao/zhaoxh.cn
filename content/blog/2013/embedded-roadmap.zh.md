---
author: njutiger
date: 2013-10-17 01:54:51+00:00
draft: false
title: 无线平台的开发路线
type: post
categories:
- STM32
---


1. 实现有线网络芯片 enc28j60 的连接
2. Lwip 裸机方式的移植 (enc28j60)
3. FreeRTOS 的移植
4. Lwip 在 FreeRTOS 上的移植 (enc28j60)
5. 基本网络功能的测试
6. Wifi 芯片的驱动 (SDIO)，集成进 Lwip
7. WEP 加密
8. AD-HOC
9. WPA/WPA2 加密
10. 测试 USB 接口 Wifi
11. bootloader 设计
12. 考虑尝试集成芯片 RT5350
