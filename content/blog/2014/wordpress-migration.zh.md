---
date: 2014-03-05T16:36:57+08:00
title: WordPress 站点迁移
tags: [WordPress, MySQL]
licensed: true
---

## 备份






1. 备份站点目录
2. 备份数据库

```shell
$ mysqldump -u username -p --databases wordpressdb > wordpressdb.sql
```

3. 备份服务器配置




## 恢复






1. 恢复站点目录
2. 恢复数据库

```shell
$ mysql -u root -p
mysql> CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
mysql> source wordpressdb.sql;
mysql> GRANT SELECT, LOCK TABLES, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON `wordpressdb`.* TO 'username'@'localhost';
mysql> \q
$ mysql -u username -p -D wordpressdb
```

3. 如果域名有更改，还需修改相应配置

```shell
$ mysql -u username -p -D wordpressdb
mysql> UPDATE wp_options SET option_value = replace( option_value, 'http://old.domain', 'http://new.domain') ;
```



如果 post 中含有链接，也可以一并替换

```sql
UPDATE wp_posts SET post_content = replace( post_content, 'http://old.domain', 'http://new.domain') ;
UPDATE wp_comments SET comment_content = replace( comment_content, 'http://old.domain', 'http://new.domain') ;
UPDATE wp_comments SET comment_author_url = replace( comment_author_url, 'http://old.domain', 'http://new.domain') ;
```
