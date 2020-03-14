---
title: "Go 中使用 KDF 进行密码哈希和验证"
tags:
  - Go
  - KDF
  - Password Hashing
  - Password Verification
  - Cryptographic Salt
  - Encrypt
  - AES
  - Base64
  - Argon2
  - Bcrypt
  - Scrypt
  - PBKDF2
  - HKDF
date: 2019-12-12T23:27:31+08:00
licensed: true
draft: false
---

存储密码认证信息是需要非常小心的，否则会有泄漏的风险。

KDF (key derivation function，密钥派生函数) 可以通过特定算法
将密码派生出指定长度的密钥，非常适用于密码验证的密码哈希处理。

[bcrypt]: https://en.wikipedia.org/wiki/Bcrypt
[scrypt]: https://en.wikipedia.org/wiki/Scrypt
[Argon2]: https://en.wikipedia.org/wiki/Argon2
[PBKDF2]: https://en.wikipedia.org/wiki/PBKDF2

常用于密码哈希的 KDF 算法有 [bcrypt][]，[scrypt][]，[Argon2][]，[PBKDF2][]。
在 2013 到 2015 年间进行的
[密码哈希竞赛](https://password-hashing.net/)
宣布 [Argon2][] 成为获胜者，所以目前最为推荐用于密码哈希的算法就是 Argon2。


## Go 语言实现

[Go](https://golang.org/) 中提供了
[golang.org/x/crypto](https://godoc.org/golang.org/x/crypto)，
其中包括常用的 KDF：

* **Argon2**, [golang.org/x/crypto/argon2](https://godoc.org/golang.org/x/crypto/argon2)。
* **Bcrypt**, [golang.org/x/crypto/bcrypt](https://godoc.org/golang.org/x/crypto/bcrypt)。
* **Scrypt**, [golang.org/x/crypto/scrypt](https://godoc.org/golang.org/x/crypto/scrypt)。
* **PBKDF2**, [golang.org/x/crypto/pbkdf2](https://godoc.org/golang.org/x/crypto/pbkdf2)。
* **HKDF**, [golang.org/x/crypto/hkdf](https://godoc.org/golang.org/x/crypto/hkdf)。


## kdfcrypt

直接使用 `golang.org/x/crypto` 还不算特别方便，
用于密码验证还需要额外做些处理，比如生成随机盐值
(salt)，保存盐值和参数。

于是我写了
[kdfcrypt](https://github.com/xianghuzhao/kdfcrypt)
这个包用于简化密码哈希和验证的过程。

`kdfcrypt` 主要提供了不同 KDF 用于密码哈希和验证的 Go 通用接口。
这是一个简单的例子：

```go
package main

import (
	"fmt"

	"github.com/xianghuzhao/kdfcrypt"
)

func main() {
	encoded, _ := kdfcrypt.Encode("password", &kdfcrypt.Option{
		Algorithm:        "argon2id",
		Param:            "m=65536,t=1,p=4",
		RandomSaltLength: 16,
		HashLength:       32,
	})

	// $argon2id$v=19,m=65536,t=1,p=4$mD+rvcR+6nuAV6MJFOmDjw$IqfwTPk9RMGeOv4pCE1QiURuSoi655GUVjcQAk81eXM
	fmt.Println(encoded)

	match, _ := kdfcrypt.Verify("password", encoded)
	fmt.Println(match) // true
}
```

`kdfcrypt` 包含两个重要的函数 `Encode` 和 `Verify`。
`Encode` 根据指定参数生成一个编码后的字符串，字符串的形式为：

```
$argon2id$v=19,m=4096,t=1,p=1$4ns1ibGJDR6IQufkbT8E/w$WQ2lAwbDhZmZQMCMg74L00OHUFzn/IvbwDaxU6bgIys
$ KDF    $ param             $ salt (base64)        $ hash (base64)
```

这个字符串包含了用于密码验证的所有信息，可以直接安全保存下来，
以供 `Verify` 函数验证。


## kdfcrypt.Option

`kdfcrypt.Option` struct 作为参数传递给 `Encode` 函数。
包括以下选项：

1. **Algorithm**：目前可选的算法有 `argon2id`，`argon2i`，`scrypt`，`pbkdf`，`hkdf`。
2. **Param**：算法参数字符串。每种算法需要的参数类型不同，多个参数可以用逗号分隔开。
   更详细的参数参见 [README](https://github.com/xianghuzhao/kdfcrypt#supported-kdf)。
3. **RandomSaltLength**：随机盐值的字节数长度。
   选择合适长度的随机盐值，可以有效防止
   [彩虹表](https://en.wikipedia.org/wiki/Rainbow_table)
   破解。
4. **Salt**：指定盐值。如果选择此项，`RandomSaltLength` 将被忽略。
5. **HashLength**：最终密码哈希生成的字节数。

> 虽然有多种算法可选，但是目前最推荐的还是 `argon2id`。
> 这里没有包含 `bcrypt` 算法，是由于 `golang.org/x/crypto/bcrypt`
> 并没有提供专门生成不同长度哈希的函数，无法直接用作 KDF，
> 我曾经尝试把它加入进去，但是导致接口和数据变得复杂且不一致，
> 所以干脆将它舍去。


## 直接使用 KDF

某些情况下需要直接使用 KDF 生成的密钥，
也可以通过 `kdfcrypt` 实现。
详细的接口函数参见
[GoDoc](https://godoc.org/github.com/xianghuzhao/kdfcrypt).

### 生成 AES-256 密钥

`AES-256` 算法需要使用 32 字节的密钥，可以这样生成：

```go
kdf, err := kdfcrypt.CreateKDF("argon2id", "m=4096,t=1,p=1")
salt, err := kdfcrypt.GenerateRandomSalt(16)
aes256Key, err := kdf.Derive("password", salt, 32)
```
