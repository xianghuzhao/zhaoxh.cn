---
title: Comparison of Web Frameworks
date: 2017-03-16T13:16:46+08:00
tags: [RESTful, Web Framework]
draft: false
---

This is not finished because I found this project:
<https://github.com/the-benchmarker/web-frameworks>.

The followings are only the plan which will never be done.


## Objective

These frameworks are mostly used for creating RESTful api, not as a full-stack web framework.

1. Ruby: pure RACK, roda, grape, sinatra, rails-api
2. Python: pure WSGI, flask, falcon
3. Node.js: pure node (Connect.js), express.js, koa
4. Go: pure go (http.ServeMux), gin, echo, martini, goji


## Methods

Only test the router. No database or other calculations involved.

Test GET, POST, PUT, DELETE, PATCH. Just return some value immediately.

Test some complicated route with parameters.

There may be more than one web server for each language:

1. Ruby (1.9.3, 2.0, 2.4 ...): unicorn, goliath, webrick, passenger
2. Python(2.7, 3.6, PyPy): uWSGI, gunicorn
3. Node.js:
4. Go: net/http


## Results

Generate result tables and graphs.

http://klen.github.io/py-frameworks-bench/

The benchmark has a three kinds of tests:

1. JSON test. Serialize a object to JSON and return `application/json` response.
2. Remote test. Load and return http response from a remote server.
3. Complete test. Load some data from DB using ORM, insert a new object, sort and render to template.
