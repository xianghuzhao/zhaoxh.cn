---
author: Xianghu Zhao
date: 2015-04-27T11:24:04+08:00
draft: false
title: Change openstack-dashboard document root from /dashboard to /
type: post
categories:
- 未分类
---

The default entry for OpenStack Dashboard is
`http://example.com/dashboard`.
If you would like to avoid the subpath, here are two methods.


## Modify the configuration

Sometimes we want this direct url for OpenStack dashboard:
<http://example.com/>, not <http://example.com/dashboard/>

To change openstack-dashboard login url from /dashboard to / run the following steps:

1.  Edit /etc/httpd/conf.d/openstack-dashboard.conf

    Change

    ```
    WSGIScriptAlias /dashboard /usr/share/openstack-dashboard/openstack_dashboard/wsgi/django.wsgi
    ```

    into

    ```
    WSGIScriptAlias / /usr/share/openstack-dashboard/openstack_dashboard/wsgi/django.wsgi
    ```

2.  Edit /etc/openstack-dashboard/local_settings

    Add the following lines:

    ```
    LOGIN_URL = '/auth/login/'
    LOGOUT_URL = '/auth/logout/'
    LOGIN_REDIRECT_URL = '/'
    ```

3.  restart apache2 service


## Use apache redirect

Another way to accomplish this is using redirect in apache.
This method is preferred for me.

Edit /etc/httpd/conf.d/openstack-dashboard.conf

```
RedirectMatch ^/$ http://www.example.com/dashboard
```

Please note that the following would not work correctly:

```
Redirect / https://www.example.com/dashboard/
```

Because it will also redirect all sub paths, not only "/".
