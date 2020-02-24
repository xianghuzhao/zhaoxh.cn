---
author: njutiger
date: 2015-07-29 01:39:25+00:00
draft: false
reproduce: true
title: '[转] linux shell 正则表达式(BREs,EREs,PREs)差异比较'
type: post
categories:
- 未分类
---



原文：<http://www.cnblogs.com/chengmo/archive/2010/10/10/1847287.html>


正则表达式：在计算机科学中，是指一个用来描述或者匹配一系列符合某个句法规则的字符串的 单个字符串。在很多文本编辑器或其他工具里，正则表达式通常被用来检索和/或替换那些符合某个模式的文本内容。许多程序设计语言都支持利用正则表达式进行 字符串操作。例如，在Perl中就内建了一个功能强大的正则表达式引擎。正则表达式这个概念最初是由Unix中的工具软件（例如sed和grep）普及开 的。正则表达式通常缩写成“regex”，单数有regexp、regex，复数有regexps、regexes、regexen。这些是正则表达式的 定义。 由于起源于unix系统，因此很多语法规则一样的。但是随着逐渐发展，后来扩展出以下几个类型。了解这些对于学习正则表达式。



**一、正则表达式分类：**

1、基本的正则表达式（Basic Regular Expression 又叫 Basic RegEx  简称 BREs）

2、扩展的正则表达式（Extended Regular Expression 又叫 Extended RegEx 简称 EREs）

3、Perl 的正则表达式（Perl Regular Expression 又叫 Perl RegEx 简称 PREs）



说明：只有掌握了正则表达式，才能全面地掌握 Linux 下的常用文本工具（例如：grep、egrep、GUN sed、 Awk 等） 的用法



**二、Linux 中常用文本工具与正则表达式的关系**

常握 Linux 下几种常用文本工具的特点，对于我们更好的使用正则表达式是很有帮助的



* **grep , egrep 正则表达式特点：**



  1）grep 支持：BREs、EREs、PREs 正则表达式

  grep 指令后不跟任何参数，则表示要使用 ”BREs“

  grep 指令后跟 ”-E" 参数，则表示要使用 “EREs“

  grep 指令后跟 “-P" 参数，则表示要使用 “PREs"



  2）egrep 支持：EREs、PREs 正则表达式

  egrep 指令后不跟任何参数，则表示要使用 “EREs”

  egrep 指令后跟 “-P" 参数，则表示要使用 “PREs"



  3）grep 与 egrep 正则匹配文件，处理文件方法

  a. grep 与 egrep 的处理对象：文本文件

  b. grep 与 egrep 的处理过程：查找文本文件中是否含要查找的 “关键字”（关键字可以是正则表达式） ，如果含有要查找的 ”关健字“，那么默认返回该文本文件中包含该”关健字“的该行的内容，并在标准输出中显示出来，除非使用了“>" 重定向符号,

  c. grep 与 egrep 在处理文本文件时，是按行处理的






* **sed 正则表达式特点**



  1）sed 文本工具支持：BREs、EREs

  sed 指令默认是使用"BREs"

  sed 命令参数 “-r ” ，则表示要使用“EREs"

  2）sed 功能与作用

  a. sed 处理的对象：文本文件

  b. sed 处理操作：对文本文件的内容进行 --- 查找、替换、删除、增加等操作

  c. sed 在处理文本文件的时候，也是按行处理的





* **Awk（gawk）正则表达式特点**



  1）Awk 文本工具支持：EREs

  awk 指令默认是使用 “EREs"

  2）Awk 文本工具处理文本的特点

  a. awk 处理的对象：文本文件

  b. awk 处理操作：主要是对列进行操作








**三、常见3中类型正则表达式比较**

<table cellpadding="4" width="546" cellspacing="1" border="0" bgcolor="#666666" >
<tbody >
<tr >

<td bgcolor="#cccccc" width="69" >字符
</td>

<td bgcolor="#cccccc" width="163" >说明
</td>

<td bgcolor="#cccccc" width="69" >Basic RegEx
</td>

<td bgcolor="#cccccc" width="75" >Extended RegEx
</td>

<td bgcolor="#cccccc" width="69" >python RegEx
</td>

<td bgcolor="#cccccc" width="92" >Perl regEx
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >转义
</td>

<td bgcolor="#ffffff" width="163" >
</td>

<td bgcolor="#ffffff" width="69" >\
</td>

<td bgcolor="#ffffff" width="75" >\
</td>

<td bgcolor="#ffffff" width="69" >\
</td>

<td bgcolor="#ffffff" width="92" >\
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >^
</td>

<td bgcolor="#ffffff" width="163" >匹配行首，例如'^dog'匹配以字符串dog开头的行（注意：awk 指令中，'^'则是匹配字符串的开始）
</td>

<td bgcolor="#ffffff" width="69" >^
</td>

<td bgcolor="#ffffff" width="75" >^
</td>

<td bgcolor="#ffffff" width="69" >^
</td>

<td bgcolor="#ffffff" width="92" >^
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >$
</td>

<td bgcolor="#ffffff" width="163" >匹配行尾，例如：'^、dog$'匹配以字符串 dog 为结尾的行（注意：awk 指令中，'$'则是匹配字符串的结尾）
</td>

<td bgcolor="#ffffff" width="69" >$
</td>

<td bgcolor="#ffffff" width="75" >$
</td>

<td bgcolor="#ffffff" width="69" >$
</td>

<td bgcolor="#ffffff" width="92" >$
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >^$
</td>

<td bgcolor="#ffffff" width="163" >匹配空行
</td>

<td bgcolor="#ffffff" width="69" >^$
</td>

<td bgcolor="#ffffff" width="75" >^$
</td>

<td bgcolor="#ffffff" width="69" >^$
</td>

<td bgcolor="#ffffff" width="92" >^$
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >^string$
</td>

<td bgcolor="#ffffff" width="163" >匹配行，例如：'^dog$'匹配只含一个字符串 dog 的行
</td>

<td bgcolor="#ffffff" width="69" >^string$
</td>

<td bgcolor="#ffffff" width="75" >^string$
</td>

<td bgcolor="#ffffff" width="69" >^string$
</td>

<td bgcolor="#ffffff" width="92" >^string$
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\<
</td>

<td bgcolor="#ffffff" width="163" >匹配单词，例如：'\<frog' （等价于'\bfrog'），匹配以 frog 开头的单词
</td>

<td bgcolor="#ffffff" width="69" >\<
</td>

<td bgcolor="#ffffff" width="75" >\<
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="92" >**不支持**（但可以使用\b来匹配单词，例如：'\bfrog'）
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\>
</td>

<td bgcolor="#ffffff" width="163" >匹配单词，例如：'frog\>'（等价于'frog\b '），匹配以 frog 结尾的单词
</td>

<td bgcolor="#ffffff" width="69" >\>
</td>

<td bgcolor="#ffffff" width="75" >\>
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="92" >**不支持**（但可以使用\b来匹配单词，例如：'frog\b'）
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\<x\>
</td>

<td bgcolor="#ffffff" width="163" >匹配一个单词或者一个特定字符，例如：'\<frog\>'（等价于'\bfrog\b'）、'\<G\>'
</td>

<td bgcolor="#ffffff" width="69" >\<x\>
</td>

<td bgcolor="#ffffff" width="75" >\<x\>
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="92" >**不支持**（但可以使用\b来匹配单词，例如：'\bfrog\b'
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >()
</td>

<td bgcolor="#ffffff" width="163" >匹配表达式，例如：不支持'（frog）'
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（但可以使用\(\)，如：\(dog\)
</td>

<td bgcolor="#ffffff" width="75" >()
</td>

<td bgcolor="#ffffff" width="69" >()
</td>

<td bgcolor="#ffffff" width="92" >()
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\(\)
</td>

<td bgcolor="#ffffff" width="163" >匹配表达式，例如：不支持'（frog）'
</td>

<td bgcolor="#ffffff" width="69" >\(\)
</td>

<td bgcolor="#cccccc" width="75" >**不支持**（同())
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同())
</td>

<td bgcolor="#cccccc" width="92" >**不支持**（同())
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >？
</td>

<td bgcolor="#ffffff" width="163" >匹配前面的子表达式 0 次或 1 次（等价于{0,1}），例如：where(is)?能匹配"where" 以及"whereis"
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同\?)
</td>

<td bgcolor="#ffffff" width="75" >？
</td>

<td bgcolor="#ffffff" width="69" >？
</td>

<td bgcolor="#ffffff" width="92" >？
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\?
</td>

<td bgcolor="#ffffff" width="163" >匹配前面的子表达式 0 次或 1 次（等价于'\{0,1\}'），例如：'where\(is\)\? '能匹配 "where"以及"whereis"
</td>

<td bgcolor="#ffffff" width="69" >\?
</td>

<td bgcolor="#cccccc" width="75" >**不支持**（同?)
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同?)
</td>

<td bgcolor="#cccccc" width="92" >**不支持**（同?)
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >?
</td>

<td bgcolor="#ffffff" width="163" >当该字符紧跟在任何一个其他限制符（*, +, ?, {n},{n,}, {n,m}） 后面时，匹配模式是非贪婪的。非贪婪模式尽可能少的匹配所搜索的字符串，而默认的贪婪模式则尽可能多的匹配所搜索的字符串。例如，对于字符串 "oooo"，'o+?' 将匹配单个"o"，而 'o+' 将匹配所有 'o'
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="92" >**不支持**
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >.
</td>

<td bgcolor="#ffffff" width="163" >匹配除换行符（'\n'）之外的任意单个字符（注意：awk 指令中的句点能匹配换行符）
</td>

<td bgcolor="#ffffff" width="69" >.
</td>

<td bgcolor="#ffffff" width="75" >.（如果要匹配包括“\n”在内的任何一个字符，请使用：'(^$)|（.）
</td>

<td bgcolor="#ffffff" width="69" >.
</td>

<td bgcolor="#ffffff" width="92" >.（如果要匹配包括“\n”在内的任何一个字符，请使用：' [.\n] '
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >*
</td>

<td bgcolor="#ffffff" width="163" >匹配前面的子表达式 0 次或多次（等价于{0, }），例如：zo* 能匹配 "z"以及 "zoo"
</td>

<td bgcolor="#ffffff" width="69" >*
</td>

<td bgcolor="#ffffff" width="75" >*
</td>

<td bgcolor="#ffffff" width="69" >*
</td>

<td bgcolor="#ffffff" width="92" >*
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\+
</td>

<td bgcolor="#ffffff" width="163" >匹配前面的子表达式 1 次或多次（等价于'\{1, \}'），例如：'where\(is\)\+ '能匹配 "whereis"以及"whereisis"
</td>

<td bgcolor="#ffffff" width="69" >\+
</td>

<td bgcolor="#cccccc" width="75" >**不支持**（同+)
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同+)
</td>

<td bgcolor="#cccccc" width="92" >**不支持**（同+)
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >+
</td>

<td bgcolor="#ffffff" width="163" >匹配前面的子表达式 1 次或多次（等价于{1, }），例如：zo+能匹配 "zo"以及 "zoo"，但不能匹配 "z"
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同\+)
</td>

<td bgcolor="#ffffff" width="75" >+
</td>

<td bgcolor="#ffffff" width="69" >+
</td>

<td bgcolor="#ffffff" width="92" >+
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >{n}
</td>

<td bgcolor="#ffffff" width="163" >n 必须是一个 0 或者正整数，匹配子表达式 n 次，例如：zo{2}能匹配
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同\{n\})
</td>

<td bgcolor="#ffffff" width="75" >{n}
</td>

<td bgcolor="#ffffff" width="69" >{n}
</td>

<td bgcolor="#ffffff" width="92" >{n}
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >{n,}
</td>

<td bgcolor="#ffffff" width="163" >"zooz"，但不能匹配 "Bob"n 必须是一个 0 或者正整数，匹配子表达式大于等于 n次，例如：go{2,}
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同\{n,\})
</td>

<td bgcolor="#ffffff" width="75" >{n,}
</td>

<td bgcolor="#ffffff" width="69" >{n,}
</td>

<td bgcolor="#ffffff" width="92" >{n,}
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >{n,m}
</td>

<td bgcolor="#ffffff" width="163" >能匹配 "good"，但不能匹配 godm 和 n 均为非负整数，其中 n <= m，最少匹配 n 次且最多匹配 m 次 ，例如：o{1,3}将配"fooooood" 中的前三个 o（请注意在逗号和两个数之间不能有空格）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同\{n,m\})
</td>

<td bgcolor="#ffffff" width="75" >{n,m}
</td>

<td bgcolor="#ffffff" width="69" >{n,m}
</td>

<td bgcolor="#ffffff" width="92" >{n,m}
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >x|y
</td>

<td bgcolor="#ffffff" width="163" >匹配 x 或 y，例如： 不支持'z|（food）' 能匹配 "z" 或"food"；'（z|f）ood' 则匹配"zood" 或 "food"
</td>

<td bgcolor="#cccccc" width="69" >**不支持**（同x\|y)
</td>

<td bgcolor="#ffffff" width="75" >x|y
</td>

<td bgcolor="#ffffff" width="69" >x|y
</td>

<td bgcolor="#ffffff" width="92" >x|y
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[0-9]
</td>

<td bgcolor="#ffffff" width="163" >匹配从 0 到 9 中的任意一个数字字符（注意：要写成递增）
</td>

<td bgcolor="#ffffff" width="69" >[0-9]
</td>

<td bgcolor="#ffffff" width="75" >[0-9]
</td>

<td bgcolor="#ffffff" width="69" >[0-9]
</td>

<td bgcolor="#ffffff" width="92" >[0-9]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[xyz]
</td>

<td bgcolor="#ffffff" width="163" >字符集合，匹配所包含的任意一个字符，例如：'[abc]'可以匹配"lay" 中的 'a'（注意：如果元字符，例如：. *等，它们被放在[ ]中，那么它们将变成一个普通字符）
</td>

<td bgcolor="#ffffff" width="69" >[xyz]
</td>

<td bgcolor="#ffffff" width="75" >[xyz]
</td>

<td bgcolor="#ffffff" width="69" >[xyz]
</td>

<td bgcolor="#ffffff" width="92" >[xyz]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[^xyz]
</td>

<td bgcolor="#ffffff" width="163" >负值字符集合，匹配未包含的任意一个字符（注意：不包括换行符），例如：'[^abc]' 可以匹配 "Lay" 中的'L'（注意：[^xyz]在awk 指令中则是匹配未包含的任意一个字符+换行符）
</td>

<td bgcolor="#ffffff" width="69" >[^xyz]
</td>

<td bgcolor="#ffffff" width="75" >[^xyz]
</td>

<td bgcolor="#ffffff" width="69" >[^xyz]
</td>

<td bgcolor="#ffffff" width="92" >[^xyz]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[A-Za-z]
</td>

<td bgcolor="#ffffff" width="163" >匹配大写字母或者小写字母中的任意一个字符（注意：要写成递增）
</td>

<td bgcolor="#ffffff" width="69" >[A-Za-z]
</td>

<td bgcolor="#ffffff" width="75" >[A-Za-z]
</td>

<td bgcolor="#ffffff" width="69" >[A-Za-z]
</td>

<td bgcolor="#ffffff" width="92" >[A-Za-z]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[^A-Za-z]
</td>

<td bgcolor="#ffffff" width="163" >匹配除了大写与小写字母之外的任意一个字符（注意：写成递增）
</td>

<td bgcolor="#ffffff" width="69" >[^A-Za-z]
</td>

<td bgcolor="#ffffff" width="75" >[^A-Za-z]
</td>

<td bgcolor="#ffffff" width="69" >[^A-Za-z]
</td>

<td bgcolor="#ffffff" width="92" >[^A-Za-z]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\d
</td>

<td bgcolor="#ffffff" width="163" >匹配从 0 到 9 中的任意一个数字字符（等价于 [0-9]）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\d
</td>

<td bgcolor="#ffffff" width="92" >\d
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\D
</td>

<td bgcolor="#ffffff" width="163" >匹配非数字字符（等价于 [^0-9]）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\D
</td>

<td bgcolor="#ffffff" width="92" >\D
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\S
</td>

<td bgcolor="#ffffff" width="163" >匹配任何非空白字符（等价于[^\f\n\r\t\v]）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\S
</td>

<td bgcolor="#ffffff" width="92" >\S
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\s
</td>

<td bgcolor="#ffffff" width="163" >匹配任何空白字符，包括空格、制表符、换页符等等（等价于[ \f\n\r\t\v]）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\s
</td>

<td bgcolor="#ffffff" width="92" >\s
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\W
</td>

<td bgcolor="#ffffff" width="163" >匹配任何非单词字符 (等价于[^A-Za-z0-9_])
</td>

<td bgcolor="#ffffff" width="69" >\W
</td>

<td bgcolor="#ffffff" width="75" >\W
</td>

<td bgcolor="#ffffff" width="69" >\W
</td>

<td bgcolor="#ffffff" width="92" >\W
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\w
</td>

<td bgcolor="#ffffff" width="163" >匹配包括下划线的任何单词字符（等价于[A-Za-z0-9_]）
</td>

<td bgcolor="#ffffff" width="69" >\w
</td>

<td bgcolor="#ffffff" width="75" >\w
</td>

<td bgcolor="#ffffff" width="69" >\w
</td>

<td bgcolor="#ffffff" width="92" >\w
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\B
</td>

<td bgcolor="#ffffff" width="163" >匹配非单词边界，例如：'er\B' 能匹配 "verb" 中的'er'，但不能匹配"never" 中的'er'
</td>

<td bgcolor="#ffffff" width="69" >\B
</td>

<td bgcolor="#ffffff" width="75" >\B
</td>

<td bgcolor="#ffffff" width="69" >\B
</td>

<td bgcolor="#ffffff" width="92" >\B
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\b
</td>

<td bgcolor="#ffffff" width="163" >匹配一个单词边界，也就是指单词和空格间的位置，例如： 'er\b' 可以匹配"never" 中的 'er'，但不能匹配 "verb" 中的'er'
</td>

<td bgcolor="#ffffff" width="69" >\b
</td>

<td bgcolor="#ffffff" width="75" >\b
</td>

<td bgcolor="#ffffff" width="69" >\b
</td>

<td bgcolor="#ffffff" width="92" >\b
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\t
</td>

<td bgcolor="#ffffff" width="163" >匹配一个横向制表符（等价于 \x09和 \cI）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\t
</td>

<td bgcolor="#ffffff" width="92" >\t
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\v
</td>

<td bgcolor="#ffffff" width="163" >匹配一个垂直制表符（等价于 \x0b和 \cK）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\v
</td>

<td bgcolor="#ffffff" width="92" >\v
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\n
</td>

<td bgcolor="#ffffff" width="163" >匹配一个换行符（等价于 \x0a 和\cJ）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\n
</td>

<td bgcolor="#ffffff" width="92" >\n
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\f
</td>

<td bgcolor="#ffffff" width="163" >匹配一个换页符（等价于\x0c 和\cL）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\f
</td>

<td bgcolor="#ffffff" width="92" >\f
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\r
</td>

<td bgcolor="#ffffff" width="163" >匹配一个回车符（等价于 \x0d 和\cM）
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >\r
</td>

<td bgcolor="#ffffff" width="92" >\r
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\\
</td>

<td bgcolor="#ffffff" width="163" >匹配转义字符本身"\"
</td>

<td bgcolor="#ffffff" width="69" >\\
</td>

<td bgcolor="#ffffff" width="75" >\\
</td>

<td bgcolor="#ffffff" width="69" >\\
</td>

<td bgcolor="#ffffff" width="92" >\\
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\cx
</td>

<td bgcolor="#ffffff" width="163" >匹配由 x 指明的控制字符，例如：\cM匹配一个Control-M 或回车符，x 的值必须为A-Z 或 a-z 之一，否则，将 c 视为一个原义的 'c' 字符
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >
</td>

<td bgcolor="#ffffff" width="92" >\cx
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\xn
</td>

<td bgcolor="#ffffff" width="163" >匹配 n，其中 n 为十六进制转义值。十六进制转义值必须为确定的两个数字长，例如：'\x41' 匹配 "A"。'\x041' 则等价于'\x04' & "1"。正则表达式中可以使用 ASCII 编码
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#cccccc" width="75" >**不支持**
</td>

<td bgcolor="#ffffff" width="69" >
</td>

<td bgcolor="#ffffff" width="92" >\xn
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >\num
</td>

<td bgcolor="#ffffff" width="163" >匹配 num，其中 num是一个正整数。表示对所获取的匹配的引用
</td>

<td bgcolor="#cccccc" width="69" >**不支持**
</td>

<td bgcolor="#ffffff" width="75" >\num
</td>

<td bgcolor="#ffffff" width="69" >\num
</td>

<td bgcolor="#ffffff" width="92" >
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:alnum:]
</td>

<td bgcolor="#ffffff" width="163" >匹配任何一个字母或数字（[A-Za-z0-9]），例如：'[[:alnum:]] '
</td>

<td bgcolor="#ffffff" width="69" >[:alnum:]
</td>

<td bgcolor="#ffffff" width="75" >[:alnum:]
</td>

<td bgcolor="#ffffff" width="69" >[:alnum:]
</td>

<td bgcolor="#ffffff" width="92" >[:alnum:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:alpha:]
</td>

<td bgcolor="#ffffff" width="163" >匹配任何一个字母（[A－Za－z]）， 例如：' [[:alpha:]] '
</td>

<td bgcolor="#ffffff" width="69" >[:alpha:]
</td>

<td bgcolor="#ffffff" width="75" >[:alpha:]
</td>

<td bgcolor="#ffffff" width="69" >[:alpha:]
</td>

<td bgcolor="#ffffff" width="92" >[:alpha:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:digit:]
</td>

<td bgcolor="#ffffff" width="163" >匹配任何一个数字（[0-9]），例如：'[[:digit:]] '
</td>

<td bgcolor="#ffffff" width="69" >[:digit:]
</td>

<td bgcolor="#ffffff" width="75" >[:digit:]
</td>

<td bgcolor="#ffffff" width="69" >[:digit:]
</td>

<td bgcolor="#ffffff" width="92" >[:digit:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:lower:]
</td>

<td bgcolor="#ffffff" width="163" >匹配任何一个小写字母（[a-z]）， 例如：' [[:lower:]] '
</td>

<td bgcolor="#ffffff" width="69" >[:lower:]
</td>

<td bgcolor="#ffffff" width="75" >[:lower:]
</td>

<td bgcolor="#ffffff" width="69" >[:lower:]
</td>

<td bgcolor="#ffffff" width="92" >[:lower:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:upper:]
</td>

<td bgcolor="#ffffff" width="163" >匹配任何一个大写字母（[A-Z]）
</td>

<td bgcolor="#ffffff" width="69" >[:upper:]
</td>

<td bgcolor="#ffffff" width="75" >[:upper:]
</td>

<td bgcolor="#ffffff" width="69" >[:upper:]
</td>

<td bgcolor="#ffffff" width="92" >[:upper:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:space:]
</td>

<td bgcolor="#ffffff" width="163" >任何一个空白字符： 支持制表符、空格，例如：' [[:space:]] '
</td>

<td bgcolor="#ffffff" width="69" >[:space:]
</td>

<td bgcolor="#ffffff" width="75" >[:space:]
</td>

<td bgcolor="#ffffff" width="69" >[:space:]
</td>

<td bgcolor="#ffffff" width="92" >[:space:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:blank:]
</td>

<td bgcolor="#ffffff" width="163" >空格和制表符（横向和纵向），例如：'[[:blank:]]'ó'[\s\t\v]'
</td>

<td bgcolor="#ffffff" width="69" >[:blank:]
</td>

<td bgcolor="#ffffff" width="75" >[:blank:]
</td>

<td bgcolor="#ffffff" width="69" >[:blank:]
</td>

<td bgcolor="#ffffff" width="92" >[:blank:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:graph:]
</td>

<td bgcolor="#ffffff" width="163" >任何一个可以看得见的且可以打印的字符（注意：不包括空格和换行符等），例如：'[[:graph:]] '
</td>

<td bgcolor="#ffffff" width="69" >[:graph:]
</td>

<td bgcolor="#ffffff" width="75" >[:graph:]
</td>

<td bgcolor="#ffffff" width="69" >[:graph:]
</td>

<td bgcolor="#ffffff" width="92" >[:graph:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:print:]
</td>

<td bgcolor="#ffffff" width="163" >任何一个可以打印的字符（注意：不包括：[:cntrl:]、字符串结束符'\0'、EOF 文件结束符（-1）， 但包括空格符号），例如：'[[:print:]] '
</td>

<td bgcolor="#ffffff" width="69" >[:print:]
</td>

<td bgcolor="#ffffff" width="75" >[:print:]
</td>

<td bgcolor="#ffffff" width="69" >[:print:]
</td>

<td bgcolor="#ffffff" width="92" >[:print:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:cntrl:]
</td>

<td bgcolor="#ffffff" width="163" >任何一个控制字符（ASCII 字符集中的前 32 个字符，即：用十进制表示为从 0 到31，例如：换行符、制表符等等），例如：' [[:cntrl:]]'
</td>

<td bgcolor="#ffffff" width="69" >[:cntrl:]
</td>

<td bgcolor="#ffffff" width="75" >[:cntrl:]
</td>

<td bgcolor="#ffffff" width="69" >[:cntrl:]
</td>

<td bgcolor="#ffffff" width="92" >[:cntrl:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:punct:]
</td>

<td bgcolor="#ffffff" width="163" >任何一个标点符号（不包括：[:alnum:]、[:cntrl:]、[:space:]这些字符集）
</td>

<td bgcolor="#ffffff" width="69" >[:punct:]
</td>

<td bgcolor="#ffffff" width="75" >[:punct:]
</td>

<td bgcolor="#ffffff" width="69" >[:punct:]
</td>

<td bgcolor="#ffffff" width="92" >[:punct:]
</td>
</tr>
<tr >

<td bgcolor="#ffffff" width="69" >[:xdigit:]
</td>

<td bgcolor="#ffffff" width="163" >任何一个十六进制数（即：0-9，a-f，A-F）
</td>

<td bgcolor="#ffffff" width="69" >[:xdigit:]
</td>

<td bgcolor="#ffffff" width="75" >[:xdigit:]
</td>

<td bgcolor="#ffffff" width="69" >[:xdigit:]
</td>

<td bgcolor="#ffffff" width="92" >[:xdigit:]
</td>
</tr>
</tbody>
</table>


**四、三种不同类型正则表达式比较**

注意： 当使用 BERs（基本正则表达式）时，必须在下列这些符号前加上转义字符（'\'），屏蔽掉它们的 speical meaning  “?,+,|,{,},（,）” 这些字符，需要加入转义符号”\”

注意：修饰符用在正则表达式结尾，例如：/dog/i，其中 “ i “ 就是修饰符，它代表的含义就是：匹配时不区分大小写，那么修饰符有哪些呢？常见的修饰符如下:

*  g    全局匹配（即：一行上的每个出现，而不只是一行上的第一个出现）
*  s    把整个匹配串当作一行处理
*  m    多行匹配
*  i    忽略大小写
*  x    允许注释和空格的出现
*  U    非贪婪匹配




以上就是linux 常见3种类型正则表达式异同之处，整体了解这些，我相信在使用这些工具的时候，就可以更加清楚明晰了。
