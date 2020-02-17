---
author: njutiger
date: 2013-10-22 08:02:47+00:00
draft: false
title: 开发板接线方法
type: post
categories:
- STM32
---

stm32f4 discovery board 与 PL2303 接线顺序：

```
    STM32(USART1)  -> PL2303
    ------------------------
    PB6(USART1_TX) -> RX
    PB7(USART1_RX) -> TX
```

stm32f4 discovery board 与 ENC28J60 接线顺序：

```
    STM32(SPI1)    -> ENC28J60
    --------------------------
    PA4(SPI1_NSS)  -> CS
    PA5(SPI1_SCK)  -> SCK
    PA6(SPI1_MISO) -> SO
    PA7(SPI1_MOSI) -> SI
```
