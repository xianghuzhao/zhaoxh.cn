---
title: Compare RESTful frameworks of different programming languages
date: 2017-03-16T13:16:46+08:00
draft: true
---

These frameworks are mostly used for creating RESTful api, not as a full-stack web framework.


<!--more-->



  1. Ruby: pure RACK, grape, sinatra, rails-api


  2. Python: pure WSGI, flask, falcon


  3. Node.js: pure node (Connect.js), express.js, koa


  4. Go: pure go (http.ServeMux), gin, echo, martini, goji



Only test the router. No database or other calculations involved.

Test GET, POST, PUT, DELETE, PATCH. Just return some value immediately.

Test some complicated route with parameters.

There may be more than one web server for each language:



  1. Ruby (1.9.3, 2.0, 2.4 ...): unicorn, goliath, webrick, passenger


  2. Python(2.7, 3.6, PyPy): uWSGI, gunicorn


  3. Node.js:


  4. Go: net/http



Generate result tables and graphs.

http://klen.github.io/py-frameworks-bench/

The benchmark has a three kind of tests:



  1. JSON test. Serialize a object to JSON and return `application/json` response.


  2. Remote test. Load and return http response from a remote server.


  3. Complete test. Load some data from DB using ORM, insert a new object, sort and render to template.


Here is some example:

<https://github.com/the-benchmarker/web-frameworks>