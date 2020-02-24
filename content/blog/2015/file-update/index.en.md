---
author: njutiger
date: 2015-07-08 08:59:00+00:00
draft: false
reproduce: true
title: '[转] Reliable file updates with Python'
type: post
categories:
- 未分类
---

Original link: [http://blog.gocept.com/2013/07/15/reliable-file-updates-with-python/](http://blog.gocept.com/2013/07/15/reliable-file-updates-with-python/)





## [Reliable file updates with Python](http://blog.gocept.com/2013/07/15/reliable-file-updates-with-python/)





Posted on [July 15, 2013](http://blog.gocept.com/2013/07/15/reliable-file-updates-with-python/) by [Christian Kauhaus](http://blog.gocept.com/author/ckauhaus/)







Programs need to update files. Although most programmers know that unexpected things can happen while performing I/O, I often see code that has been written in a surprisingly naïve way. In this article, I would like to share some insights on how to improve I/O reliability in Python code.













Consider the following Python snippet. Some operation is performed on data coming from and going back into a file:







```python
with open(filename) as f:
   input = f.read()
output = do_something(input)
with open(filename, 'w') as f:
   f.write(output)
```







Pretty simple? Probably not as simple as it looks at the first glance. I often debug applications that show strange behaviour on production servers. Here are examples of failure modes I have seen:



* A run away server process spills out huge amounts of logs and the disk fills up. _write()_ raises an exception right after truncating the file, leaving the file empty.
* Several instances of our application happen to run in parallel. After they have finished, the file contents is garbage because it intermingles output from multiple instances.
* The application triggers some follow-up action after completing the write. Seconds later, the power goes off. After we have restarted the server, we see the old file contents again. The data already passed to other applications does not correspond to what we see in the file anymore.

Nothing of what follows is really new. My goal is to present common approaches and techniques to Python developers who are less experienced in system programming. I will provide code examples to make it easy for developers to incorporate these approaches into their own code.





## What does “reliability” mean anyway?


In the broadest sense, reliability means that an operation is performing its required function under all stated conditions. With regard to file updates, the function in question is to create, replace or extend the contents of a file. It might be rewarding to seek inspiration from database theory here. The [ACID](https://en.wikipedia.org/wiki/ACID) properties of the classic transaction model will serve as guidelines to improve reliability.

To get started, let’s see how the initial example can be rated against the four ACID properties:



* **Atomicity** requires that a transaction either succeeds or fails completely. In the example shown above, a full disk will likely result in a partially written file. Additionally, if other programs read the file while it is being written, they get a half-finished version even in the absence of write errors.
* **Consistency** denotes that updates must bring the system from one valid state to another. Consistency can be subdivided into internal and external consistency: Internal consistency means that the file’s data structures are consistent. External consistency means that the file’s contents is aligned with other data related to it. In this example, it is hard to reason about consistency since we don’t know enough about the application. But since consistency requires atomicity, we can say at least that internal consistency is not guaranteed.
* **Isolation** is violated if running transactions concurrently yields different results from running the same transactions sequentially. It is clear that the code above has no protection against [lost updates](http://drtom.ch/posts/2011/11/12/The_Lost_Update_Problem_-_Part_1/) or other isolation failures.
* **Durability** means that changes need to be permanent. Before we signal success to the user, we must be sure that our data hits non-volatile storage and not just a write cache. Perhaps the code above has been written with the assumption in mind that disk I/O takes place immediately when we call write(). This assumption is not warranted by POSIX semantics.









## Use a database system if you can


If we would be able to gain all four ACID properties, we would have come a long way towards increased reliability. But this requires significant coding effort. Why reinvent the wheel? Most database systems already have ACID transactions.

Reliable data storage is a solved problem. **If you need reliable storage, use a database.** Chances are high that you will not do it by yourself as good as those who have been working on it for years if not decades. If you do not want to set up a “big” database server, you can use [sqlite](http://www.sqlite.org) for example. It has ACID transactions, it’s small, it’s free, and it’s included in Python’s [standard library](http://docs.python.org/3/library/sqlite3.html).

The article could finish here. But there are valid reasons not to use a database. They are often tied to _file format_ or _file location_ constraints. Both are not easily controllable with database systems. Reasons include:



* we must process files generated by other applications, which are in a fixed format or at a fixed location
* we must write files for consumption by other applications (and the same restrictions apply)
* our files must be human-readable or human-editable

…and so on. You get the point.

If we are set out to implement reliable file updates on our own, there are some programming techniques to consider. In the following, I will present four common patterns of performing file updates. After that, I will discuss what steps can be taken to establish ACID properties with each file update pattern.









## File update patterns


Files can be updated in a multitude of ways, but I see at least four common patterns. These will serve as a basis for the rest of this article.





### Truncate-Write


This is probably the most basic pattern. In the following example, hypothetical domain model code reads data, performs some computation, and re-opens the existing file in write mode:







```python
with open(filename, 'r') as f:
   model.read(f)
model.process()
with open(filename, 'w') as f:
   model.write(f)
```







A variant of this pattern opens the file in read-write mode (the “plus” modes in Python), seeks to the start, issues an explicit _truncate()_ call and rewrites the contents:







```python
with open(filename, 'a+') as f:
   f.seek(0)
   model.input(f.read())
   model.compute()
   f.seek(0)
   f.truncate()
   f.write(model.output())
```







An advantage of this variant is that we open file only once and keep it open all the time. This simplifies locking for example.









### Write-Replace


Another widely used pattern is to write new contents into a temporary file and replace the original file after that:







```python
with tempfile.NamedTemporaryFile(
      'w', dir=os.path.dirname(filename), delete=False) as tf:
   tf.write(model.output())
   tempname = tf.name
os.rename(tempname, filename)
```







This method is more robust against errors than the _truncate-write_ method. See below for a discussion of atomicity and consistency properties. It is used by many applications.

These first two patterns are so common that the ext4 filesystem in the Linux kernel even [detects them](http://www.mjmwired.net/kernel/Documentation/filesystems/ext4.txt#310) and fixes some reliability shortcomings automatically. But don’t depend on it: you are not always using ext4, and the administrator might have disabled this feature.









### Append


The third pattern is to append new data to an existing file:







```python
with open(filename, 'a') as f:
   f.write(model.output())
```







This pattern is used for writing log files and other cumulative data processing tasks. Technically, its outstanding feature is its extreme simplicity. An interesting extension is to perform append-only updates during regular operation and to reorganize the file into a more compact form periodically.









### Spooldir


Here we treat a directory as logical data store and create a new uniquely named file for each record:







```python
with open(unique_filename(), 'w') as f:
   f.write(model.output())
```







This pattern shares its cumulative nature with the _append_ pattern. A big advantage is that we can put a little amount of metadata into the file name. This can be used, for example, to convey information about the processing status. A particular clever implementation of the _spooldir_ pattern is the [maildir](https://en.wikipedia.org/wiki/Maildir) format. Maildirs use a naming scheme with additional subdirectories to perform update operations in a reliable and lock-free way. The [md](https://pypi.python.org/pypi/md/) and [gocept.filestore](https://pypi.python.org/pypi/gocept.filestore/) libraries provide convenient wrappers for maildir operations.

If your file name generation is not guaranteed to give unique results, there is even a possibility to demand that the file must be actually new. Use the low-level _os.open()_ call with proper flags:







```python
fd = os.open(filename, os.O_WRONLY | os.O_CREAT| os.O_EXCL, 0o666)
with os.fdopen(fd, 'w') as f:
   f.write(...)
```







After opening the file with *O_EXCL*, we use _os.fdopen_ to convert the raw file descriptor into a regular Python file object.












## Applying ACID properties to file updates


In the following, I will try to enhance the file update patterns. Let’s see what we can do to meet each ACID property in turn. I will keep this as simple as possible, since we are not planning to write a complete database system. Please note that the material presented in this section is not exhaustive, but it may give you a good starting point for your own experimentation.





### Atomicity


The **write-replace** pattern gives you atomicity for free since the underlying _os.rename()_ function [is atomic](http://rcrowley.org/2010/01/06/things-unix-can-do-atomically.html). This means that at any given point in time, any process sees either the old or the new file. This pattern has a natural robustness against write errors: if the write operation triggers an exception, the rename operation is never performed and thus, we are not in the danger of overwriting a good old file with a damaged new one.

The **append** patterns is not atomic by itself, because we risk to append incomplete records. But there is a trick to make updates appear atomic: Annotate each written record with a checksum. When reading the log later on, discard all records that do not have a valid checksum. This way, only complete records will be processed. In the following example, an application makes periodic measurements and appends a one-line JSON record each time to a log. We compute a CRC32 checksum of the record’s byte representation and append it to the same line:







```python
with open(logfile, 'ab') as f:
    for i in range(3):
        measure = {'timestamp': time.time(), 'value': random.random()}
        record = json.dumps(measure).encode()
        checksum = '{:8x}'.format(zlib.crc32(record)).encode()
        f.write(record + b' ' + checksum + b'\n')
```







This example code simulates the measurements by creating a random value every second.




```shell
$ cat log
{"timestamp": 1373396987.258189, "value": 0.9360123151217828} 9495b87a
{"timestamp": 1373396987.25825, "value": 0.40429005476999424} 149afc22
{"timestamp": 1373396987.258291, "value": 0.232021160265939} d229d937
```




To process the log file, we read one record per line, split off the checksum, and compare it to the read record:







```python
with open(logfile, 'rb') as f:
    for line in f:
        record, checksum = line.strip().rsplit(b' ', 1)
        if checksum.decode() == '{:8x}'.format(zlib.crc32(record)):
            print('read measure: {}'.format(json.loads(record.decode())))
        else:
            print('checksum error for record {}'.format(record))
```







Now we simulate a truncated write by chopping the last line:




```shell
$ cat log
{"timestamp": 1373396987.258189, "value": 0.9360123151217828} 9495b87a
{"timestamp": 1373396987.25825, "value": 0.40429005476999424} 149afc22
{"timestamp": 1373396987.258291, "value": 0.23202
```




When the log is read, the last incomplete line is rejected:




```shell
$ read_checksummed_log.py log
read measure: {'timestamp': 1373396987.258189, 'value': 0.9360123151217828}
read measure: {'timestamp': 1373396987.25825, 'value': 0.40429005476999424}
checksum error for record b'{"timestamp": 1373396987.258291, "value":'
```




The checksummed log record approach is used by a large number of applications including many database systems.

Individual files in the **spooldir** can likewise feature a checksum in each file. Another, probably easier, approach is to borrow from the _write-replace_ pattern: first write the file aside and move it to its final location afterwards. Devise a naming scheme that protects work-in-progress files from being processed by consumers. In the following example, all file names ending with `.tmp` are ignored by readers and are thus safe to use during write operations:







```python
newfile = generate_id()
with open(newfile + '.tmp', 'w') as f:
   f.write(model.output())
os.rename(newfile + '.tmp', newfile)
```







At last, **truncate-write** is non-atomic. I am sorry that I am not able to offer you an atomic variant. Right after performing the truncate operation, the file is nulled and no new content has been written yet. If a concurrent program reads the file now or, worse yet, an exception occurs and our program gets aborted, we see neither the old nor the new version.









### Consistency


Most things I have said about atomicity can be applied to consistency as well. In fact, atomic updates are a prerequisite for internal consistency. External consistency means to update several files in sync. As this cannot easily be done, lock files can be used to ensure that read and write access do not interfere. Consider a directory where files need to be consistent with each other. A common pattern is to designate a lock file, which controls access for the whole directory.

Example writer code:







```python
with open(os.path.join(dirname, '.lock'), 'a+') as lockfile:
   fcntl.flock(lockfile, fcntl.LOCK_EX)
   model.update(dirname)
```







Example reader code:







```python
with open(os.path.join(dirname, '.lock'), 'a+') as lockfile:
   fcntl.flock(lockfile, fcntl.LOCK_SH)
   model.readall(dirname)
```







This method only works if we have control over all readers. Since there may be only one writer active at a time (the exclusive lock is blocking all shared locks), the scalability of this method is limited.

To take it one step further, we can apply the **write-replace** pattern to whole directories. This involves creating a new directory for each update _generation_ and changing a symlink once the update is complete. For example, a mirroring application maintains a directory of tarballs together with an index file, which lists file name, file size, and a checksum. When the upstream mirror gets updated, it is not enough to implement an atomic file update for every tarball and the index file in isolation. Instead, we need to flip both the tarballs and the index file at the same time to avoid checksum mismatches. To solve this problem, we maintain a subdirectory for each generation and symlink the active generation:




```
mirror
|-- 483
|   |-- a.tgz
|   |-- b.tgz
|   `-- index.json
|-- 484
|   |-- a.tgz
|   |-- b.tgz
|   |-- c.tgz
|   `-- index.json
`-- current -> 483
```




Here, the new generation 484 is in the process of being updated. When all tarballs are present and the index file is up to date, we can switch the `current` symlink with a single, atomic _os.symlink()_ call. Other applications see always either the complete old or the complete new generation. It is important that readers need to _os.chdir()_ into the `current` directory and refer to files without their full path names. Otherwise, there is a race condition when a reader first opens `current/index.json` and then opens `current/a.tgz`, but in the meanwhile the symlink target has been changed.









### Isolation


Isolation means that concurrent updates to the same file are _serializable_ — there exists a serial schedule that gives the same results as the parallel schedule actually performed. “Real” database systems use advanced techniques like [MVCC](https://en.wikipedia.org/wiki/Multiversion_concurrency_control) to maintain serializability while allowing for a great degree of parallelism. Back on our own, we better use locks to serialize file updates.

Locking **truncate-write** updates is easy. Just acquire an exclusive lock prior to all file operations. The following example code reads an integer from a file, increments it, and updates the file:







```python
def update():
   with open(filename, 'r+') as f:
      fcntl.flock(f, fcntl.LOCK_EX)
      n = int(f.read())
      n += 1
      f.seek(0)
      f.truncate()
      f.write('{}\n'.format(n))
```







Locking updates using the **write-replace** pattern can be tricky. Using a lock the same way as in _truncate-write_ can lead to updates conflicts. A naïve implementation could look like this:







```python
def update():
   with open(filename) as f:
      fcntl.flock(f, fcntl.LOCK_EX)
      n = int(f.read())
      n += 1
      with tempfile.NamedTemporaryFile(
            'w', dir=os.path.dirname(filename), delete=False) as tf:
         tf.write('{}\n'.format(n))
         tempname = tf.name
      os.rename(tempname, filename)
```







What is wrong with this code? Imagine two processes compete to update a file. The first process just goes ahead, but the second process is blocked in the _fcntl.flock()_ call. When the first process replaces the file and releases the lock, the already open file descriptor in the second process now points to a “ghost” file (not reachable by any path name) with old contents. To avoid this conflict, we must check that our open file is still the same after returning from _fcntl.flock()_. So I have written a new _LockedOpen_ context manager to replace the built-in _open_ context. It ensures that we actually open the right file:







```python
class LockedOpen(object):

    def __init__(self, filename, *args, **kwargs):
        self.filename = filename
        self.open_args = args
        self.open_kwargs = kwargs
        self.fileobj = None

    def __enter__(self):
        f = open(self.filename, *self.open_args, **self.open_kwargs)
        while True:
            fcntl.flock(f, fcntl.LOCK_EX)
            fnew = open(self.filename, *self.open_args, **self.open_kwargs)
            if os.path.sameopenfile(f.fileno(), fnew.fileno()):
                fnew.close()
                break
            else:
                f.close()
                f = fnew
        self.fileobj = f
        return f

    def __exit__(self, _exc_type, _exc_value, _traceback):
        self.fileobj.close()

    def update(self):
        with LockedOpen(filename, 'r+') as f:
            n = int(f.read())
            n += 1
            with tempfile.NamedTemporaryFile(
                    'w', dir=os.path.dirname(filename), delete=False) as tf:
                tf.write('{}\n'.format(n))
                tempname = tf.name
            os.rename(tempname, filename)
```






Locking **append** updates is as easy as locking _truncate-write_ updates: acquire an exclusive lock, append, done. Long-running processes, which leave a file permanently open, may need to release locks between updates to let others in.

The **spooldir** pattern has the elegant property that it does not require any locking. Again, it depends on using a clever naming scheme and a robust unique file name generation. The [maildir specification](http://cr.yp.to/proto/maildir.html) is a good example for a spooldir design. It can be easily adapted to other cases, which have nothing to do with mail.









### Durability


Durability is a bit special because it depends not only on the application, but also on OS and hardware configuration. In theory, we can assume that _os.fsync()_ or _os.fdatasync()_ calls do not return until data has reached permanent storage. In practice, we may run into several problems: we may be facing incomplete fsync implementations or awkward disk controller configurations, which never give any persistence guarantee. A talk from a [MySQL dev](http://www.oscon.com/oscon2008/public/schedule/detail/3172) goes into great detail of what can go wrong. Some database systems like PostgreSQL even offer a [choice of persistence mechanisms](http://www.postgresql.org/docs/9.2/static/runtime-config-wal.html) so that the administrator can select the best suited one at runtime. The poor man’s option although is to just use _os.fsync()_ and hope that it has been implemented correctly.

With the **truncate-write** pattern, we have to issue an fsync after finishing write operations but before closing the file. Note that there is usually another level of write caching involved. The _glibc buffer_ holds back writes inside the process even before they are passed to the kernel. To get the glibc buffer empty as well, we have to _flush()_ it before fsync’ing:







```python
with open(filename, 'w') as f:
   model.write(f)
   f.flush()
   os.fdatasync(f)
```







Alternatively, you can invoke Python with the **-u** flag to get unbuffered writes for all file I/O.

I prefer _os.fdatasync()_ over _os.fsync()_ most of the time to avoid synchronous metadata updates (ownership, size, mtime, …). Metadata updates can result in seeky disk I/O, which slows things down quite a bit.

Applying the same trick to **write-replace** style updates is only half of the story. We make sure that the newly written file has been pushed to non-volatile storage before replacing the old file, but what about the replace operation itself? We have no guarantee that the directory update is performed right on. There are lengthy discussions on [how to sync a directory update](http://stackoverflow.com/questions/3764822/how-to-durably-rename-a-file-in-posix/5809073#5809073) on the net, but in our case (old and new file are in the same directory) we can get away with this rather simple solution:







```python
os.rename(tempname, filename)
dirfd = os.open(os.path.dirname(filename), os.O_DIRECTORY)
os.fsync(dirfd)
os.close(dirfd)
```







We open the directory with the low-level _os.open()_ call (Python’s built-in _open()_ does not support opening directories) and perform a _os.fsync()_ on the directory’s file descriptor.

Persisting **append** updates is again quite similar to what I have said about _truncate-write_.

The **spooldir** pattern has the same directory sync problems as the _write-replace_ pattern. Fortunately, the same solution applies here as well: first sync the file, then sync the directory.












## Conclusion


It is possible to update files reliably. I have shown that all four ACID properties can be met. The code examples presented above may serve as a toolbox. Pick the programming techniques that match your needs best. At times, you don’t need all four ACID properties but only one or two. I hope that this article helps you to make an informed decision about what to implement and what to leave out.
