---
title: "Add Bookmarks for PDF File"
tags: [PDF, Bookmark, Python, venv, PDFtk, Ghostscript]
date: 2019-10-08T03:16:55+08:00
licensed: true
draft: false
---

Bookmarks in PDF files provide a convenient way to jump between pages.
But the bookmarks are not always included in a PDF file.
Especially on smartphone or e-reader, it could be a disaster without bookmarks.

Then I looked for methods of adding bookmarks for PDF.
There are many tools and programming libraries which could do this job,
since PDF is an
[open format](http://www.adobe.com/content/dam/Adobe/en/devnet/acrobat/pdfs/pdf_reference_1-7.pdf).
But I could not find a suitable one.
What I found are either too complicated or insufficient for my
requirements.
For example, `ghostscript` could add bookmarks through `pdfmark`,
but it needs a complicated `pdfmark` file, and title in Chinese
must be converted to `UTF-16BE` format beforehand.

Therefore, I wrote the
[pdf-bookmark](https://github.com/xianghuzhao/pdf-bookmark)
command to implement this feature.
Meanwhile, the `bmk` file format is also defined for simplifying
the description of bookmarks.


## Installation of pdf-bookmark

`pdf-bookmark` must run under [Python3](https://www.python.org/).
Install `pdf-bookmark` with `pip`:

```shell
$ pip install pdf-bookmark
```

> It is a good practice to run the above command under
> [venv](https://docs.python.org/3/tutorial/venv.html)
> in order to avoid the conflicts with system Python packages.

### Installation of Ghostscript

`pdf-bookmark` utilizes [Ghostscript](https://www.ghostscript.com/)
to generate bookmarks for PDF files, which must be installed before
running `pdf-bookmark`.

`Ghostscript` is included in many Linux distributions. Take Arch Linux
as an example:

```shell
$ sudo pacman -S ghostscript
$ gs --version
```

### Installation of PDFtk

[PDFtk](https://www.pdflabs.com/tools/pdftk-server/) is used for
exporting bookmarks from PDF file. If you need this feature, `PDFtk`
must be installed.

> [pdftk-java](https://gitlab.com/pdftk-java/pdftk) is a java port of PDFtk.
> In principle it could replace the original PDFtk.
> But the current version 3.0.8 has
> [a bug](https://gitlab.com/pdftk-java/pdftk/issues/32),
> which will lead to wrong page number.
> Thus the [original pdftk](https://www.pdflabs.com/tools/pdftk-server/)
> is still needed before that bug is fixed.


## bmk file format

The `bmk` file is used to describe bookmark of a PDF file,
including title, page number, level, etc.

```
序................1
Chapter 1................4
Chapter 2................5
  2.1 Section 1................6
    2.1.1 SubSection 1................6
    2.1.2 SubSection 2................8
  2.2 Section 2................12
Chapter 3................20
Appendix................36
```

This is the a simple `bmk` file, which looks quite like the
content of a book, hence you can copy the content and modify from it.

Each line represents a bookmark item. The title and the page number are
separated by at least 4 dots "`.`".

The level of a bookmark is specified by the indentation of spaces. The
default indentation is 2 spaces, and the number of spaces could be
configured with inline command.

Import the bookmark and create a new pdf file:

```shell
$ pdf-bookmark -p input.pdf -b bookmark.bmk -o new-with-bookmark.pdf
```

### Inline command

`bmk` format also defines some inline commands to do more controls on the
bookmarks. These commands start with `!!!` and modify some properties of
bookmark. The new property will affect bookmarks after the line until it
is changed again.

The page number in PDF file does not always start from the first page.
And the PDF file could be divided into several pieces, like preface,
content, main body, appendix, etc. Page numbers are not always Arabic.
Roman and letters could also be used. Some level of bookmarks could also
be collapsed and hidden, which could be expanded with mouse click.
These are what inline commands could do.

```
!!! collapse_level = 2

!!! num_style = Roman
Preface................I
Content................IV

!!! new_index = 12
!!! num_style = Arabic
Introduction................1
Chapter 1................4
Chapter 2................5
  2.1 Section 1................6
  2.2 Section 2................7
Chapter 3................10
Appendix................11
```

With these inline commands, you do not need to recalculate the index number for each page.

Here are all supported inline commands:

1. `new_index`. Default: 1.
   The following bookmark index will be recalculated from
   the new index number (`new_index + page - 1`).
2. `num_start`. Default: 1.
   Specify the number of first page if it does not start from 1 (`new_index + page - num_start`).
3. `num_style`. Default: `Arabic`.
   The page number style. Could be `Arabic`, `Roman` and `Letters`.
4. `collapse_level`. Default: 0.
   On which level the bookmarks are collapsed. 0 means expanding all.
5. `level_indent`. Default: 2.
   Number of indentation spaces for a new level.



## Export bookmarks from PDF file

`PDFtk` must be installed for exporting bookmarks.

Export bookmarks:

```shell
$ pdf-bookmark -p input.pdf
```

The default format if `bmk`, which could be changed by `-f` arguments.
