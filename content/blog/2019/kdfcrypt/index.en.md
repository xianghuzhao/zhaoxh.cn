---
title: "Password Hashing and Verification with KDF in Go"
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

Great attention must be paid when doing the storage
of password authentication information. Any incautious
behavior may lead to the leak of password.

KDF (key derivation function) could derive secret keys with
different length from the password, so it is quite suitable
for password hashing and verification.

[bcrypt]: https://en.wikipedia.org/wiki/Bcrypt
[scrypt]: https://en.wikipedia.org/wiki/Scrypt
[Argon2]: https://en.wikipedia.org/wiki/Argon2
[PBKDF2]: https://en.wikipedia.org/wiki/PBKDF2

There are several KDF algorithms commonly used for password hashing,
like [bcrypt][], [scrypt][], [Argon2][], [PBKDF2][], etc.
According to the password [hashing competition](https://password-hashing.net/)
from 2013 to 2015, [Argon2][] was selected as the winner.
Therefore, Argon2 is currently the most recommended algorithm for
password hashing.


## Do it in Go

[Go](https://golang.org/) provides the cryptography package
[golang.org/x/crypto](https://godoc.org/golang.org/x/crypto)
which includes some common KDFs:

* **Argon2**, [golang.org/x/crypto/argon2](https://godoc.org/golang.org/x/crypto/argon2).
* **Bcrypt**, [golang.org/x/crypto/bcrypt](https://godoc.org/golang.org/x/crypto/bcrypt).
* **Scrypt**, [golang.org/x/crypto/scrypt](https://godoc.org/golang.org/x/crypto/scrypt).
* **PBKDF2**, [golang.org/x/crypto/pbkdf2](https://godoc.org/golang.org/x/crypto/pbkdf2).
* **HKDF**, [golang.org/x/crypto/hkdf](https://godoc.org/golang.org/x/crypto/hkdf).


## kdfcrypt package

It is not very convenient to use `golang.org/x/crypto` directly.
Some extra works are needed, like generation of random salt, preserving
salt and parameters, etc.

[kdfcrypt](https://github.com/xianghuzhao/kdfcrypt)
package is thus created to simplify the process of password
hashing and verification.

`kdfcrypt` provides the common interface for various KDFs to do
password hashing and verification.
Here is a simple example:

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

`kdfcrypt` defines two functions `Encode` and `Verify`.
`Encode` could generate an encoded string according to the parameters.
The encoded string looks like:

```
$argon2id$v=19,m=4096,t=1,p=1$4ns1ibGJDR6IQufkbT8E/w$WQ2lAwbDhZmZQMCMg74L00OHUFzn/IvbwDaxU6bgIys
$ KDF    $ param             $ salt (base64)        $ hash (base64)
```

This string contains full information for password verification,
which could be safely saved and verified with function `Verify`.


## kdfcrypt.Option

The Option struct is passed as argument for Encode.

1. **Algorithm**: Could be one of `argon2id`, `argon2i`, `scrypt`, `pbkdf`, `hkdf`.
2. **Param**: String for the KDF param. Different items are separated by comma ",".
   The detailed items vary among different KDFs.
   Check the details in [README](https://github.com/xianghuzhao/kdfcrypt#supported-kdf).
3. **RandomSaltLength**: The length for the random salt in byte.
4. **Salt**: Salt for the hash. If Salt is not empty, `RandomSaltLength` will be ignored.
5. **HashLength**: The length of the hash result in byte.

> Although various algorithms are provided, `argon2id` is still the
> most recommended one.
> The `bcrypt` is not included, because `golang.org/x/crypto/bcrypt`
> does not provide a function for generating keys directly and
> used as a KDF.
> I once tried to add `bcrypt`, but this would make interfaces and
> data complicated and inconsistent, so I just removed it.


## Use key from KDF directly

Sometimes the keys are needed directly,
which could also be achieved with `kdfcrypt`.
For details of the functions, please check the
[GoDoc](https://godoc.org/github.com/xianghuzhao/kdfcrypt).

### Generation of AES-256 key

`AES-256` algorithm needs the key with 32 bytes,
and it could be generated like this:

```go
kdf, err := kdfcrypt.CreateKDF("argon2id", "m=4096,t=1,p=1")
salt, err := kdfcrypt.GenerateRandomSalt(16)
aes256Key, err := kdf.Derive("password", salt, 32)
```
