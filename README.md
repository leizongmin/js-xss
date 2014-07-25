[![NPM version](https://badge.fury.io/js/xss.png)](http://badge.fury.io/js/xss)
[![Build Status](https://secure.travis-ci.org/leizongmin/js-xss.png?branch=master)](http://travis-ci.org/leizongmin/js-xss)
[![Dependencies Status](https://david-dm.org/leizongmin/js-xss.png)](https://david-dm.org/leizongmin/js-xss)

Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist.
======

![xss](https://nodei.co/npm/xss.png?downloads=true&stars=true)

--------------

**NOTE: The format of custom configuration (except Whitelist) from version
0.0.X was changed a lot since version 0.1.X. To use a newer version, it's
suggested to read the following guidelines carefully.**

**[中文版文档](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)**

`xss` is a module used to filter input from users to prevent XSS attacks.
([What is XSS attack?](http://en.wikipedia.org/wiki/Cross-site_scripting))

This module is needed for situations that allows users to input HTML for
typesetting or formatting, including fourms, blogs, e-shops, etc.

The `xss` module controls the usage of tags and their attributes, according to
the whitelist. It is also extendable with a series of APIs privided, which make
it become more flexible, compares with other modules.

**Project Homepage:** https://github.com/leizongmin/js-xss

**Try Online:** http://ucdok.com/project/xss/

---------------


## Features

+ Specifies HTML tags and their attributes allowed with whitelist
+ Handle any tags or attributes using custom function.


## Reference

+ [XSS与字符编码的那些事儿 ---科普文](http://drops.wooyun.org/tips/689)
+ [腾讯实例教程：那些年我们一起学XSS](http://www.wooyun.org/whitehats/%E5%BF%83%E4%BC%A4%E7%9A%84%E7%98%A6%E5%AD%90)
+ [mXSS攻击的成因及常见种类](http://drops.wooyun.org/tips/956)
+ [XSS Filter Evasion Cheat Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)
+ [Data URI scheme](http://en.wikipedia.org/wiki/Data_URI_scheme)
+ [XSS with Data URI Scheme](http://hi.baidu.com/badzzzz/item/bdbafe83144619c199255f7b)


## Benchmark (for references only)

+ the xss module: 8.2 MB/s
+ `xss()` function from module `validator@0.3.7`: 4.4 MB/s

For test code please refer to `benchmark` directory.


## Unit Test

Run `npm test` command in the source directary.


## Active Test

Run the following command, them you can type HTML
code in the command-line, and check the filtered output:

```bash
$ xss -t
```

## Command Line Tool

You can use the xss command line tool to process a file. Usage:

```bash
xss -i <input_file> -o <output_file>
```

Example:

```bash
$ xss -i origin.html -o target.html
```

For more details, please run `$ xss -h` to see it.


## Usages

### In Node.js

To install:

```bash
$ npm install xss
```

Simple usage:

```JavaScript
var xss = require('xss');
var html = xss('<script>alert("xss");</script>');
console.log(html);
```

### In browsers

```HTML
<script src="https://raw.github.com/leizongmin/js-xss/master/dist/xss.js"></script>
<script>
// apply function filterXSS in the same way
var html = filterXSS('<script>alert("xss");</scr' + 'ipt>');
alert(html);
</script>
```

### Bower

```bash
$ bower install xss
```


## Custom filter rules

When using the `xss()` function, the second parameter could be used to specify
custom rules:

```JavaScript
options = {};  // Custom rules
html = xss('<script>alert("xss");</script>', options);
```

To avoid passing `options` every time, you can also do it in a faster way by
creating a `FilterXSS` instance:

```JavaScript
options = {};  // Custom rules
myxss = new xss.FilterXSS(options);
// then apply myxss.process()
html = myxss.process('<script>alert("xss");</script>');
```

Details of parameters in `options` would be described below.

### Whitelist

By specifying a `whiteList`, e.g. `{ 'tagName': [ 'attr-1', 'attr-2' ] }`. Tags
and attributes not in the whitelist would be filter out. For example:

```JavaScript
// only tag a and its attributes href, title, target are allowed
var options = {
  whiteList: {
    a: ['href', 'title', 'target']
  }
};
// With the configuration specified above, the following HTML:
// <a href="#" onclick="hello()"><i>Hello</i></a>
// would become:
// <a href="#">Hello</a>
```

For the default whitelist, please refer `xss.whiteList`.

### Customize the handler function for matched tags

By specifying the handler function with `onTag`:

```JavaScript
function onTag (tag, html, options) {
  // tag is the name of current tag, e.g. 'a' for tag <a>
  // html is the HTML of this tag, e.g. '<a>' for tag <a>
  // options is some addition informations:
  //   isWhite    boolean, whether the tag is in whitelist
  //   isClosing  boolean, whether the tag is a closing tag, e.g. true for </a>
  //   position        integer, the position of the tag in output result
  //   sourcePosition  integer, the position of the tag in input HTML source
  // If a string is returned, the current tag would be replaced with the string
  // If return nothing, the default measure would be taken:
  //   If in whitelist: filter attributes using onTagAttr, as described below
  //   If not in whitelist: handle by onIgnoreTag, as described below
}
```

### Customize the handler function for attributes of matched tags

By specifying the handler function with `onTagAttr`:

```JavaScript
function onTagAttr (tag, name, value, isWhiteAttr) {
  // tag is the name of current tag, e.g. 'a' for tag <a>
  // name is the name of current attribute, e.g. 'href' for href="#"
  // isWhiteAttr whether the tag is in whitelist
  // If a string is returned, the attribute would be replaced with the string
  // If return nothing, the default measure would be taken:
  //   If in whitelist: filter the value using safeAttrValue as described below
  //   If not in whitelist: handle by onIgnoreTagAttr, as described below
}
```

### Customize the handler function for tags not in the whitelist

By specifying the handler function with `onIgnoreTag`:

```JavaScript
function onIgnoreTag (tag, html, options) {
  // Parameters are the same with onTag
  // If a string is returned, the tag would be replaced with the string
  // If return nothing, the default measure would be taken (specifies using
  // escape, as described below)
}
```

### Customize the handler function for attributes not in the whitelist

By specifying the handler function with `onIgnoreTagAttr`:

```JavaScript
function onIgnoreTagAttr (tag, name, value, isWhiteAttr) {
  // Parameters are the same with onTagAttr
  // If a string is returned, the value would be replaced with this string
  // If return nothing, then keep default (remove the attribute)
}
```

### Customize escaping function for HTML

By specifying the handler function with `escapeHtml`. Following is the default
function **(Modification is not recommended)**:

```JavaScript
function escapeHtml (html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

### Customize escaping function for value of attributes

By specifying the handler function with `safeAttrValue`:

```JavaScript
function safeAttrValue (tag, name, value) {
  // Parameters are the same with onTagAttr (without options)
  // Return the value as a string
}
```

### Quick Start

#### Filter out tags not in the whitelist

By using `stripIgnoreTag` parameter:

+ `true` filter out tags not in the whitelist
+ `false`: by default: escape the tag using configured `escape` function

Example:

If `stripIgnoreTag = true` is set, the following code:

```HTML
code:<script>alert(/xss/);</script>
```

would output filtered:

```HTML
code:alert(/xss/);
```

#### Filter out tags and tag bodies not in the whitelist

By using `stripIgnoreTagBody` parameter:

+ `false|null|undefined` by default: do nothing
+ `'*'|true`: filter out all tags not in the whitelist
+ `['tag1', 'tag2']`: filter out only specified tags not in the whitelist

Example:

If `stripIgnoreTagBody = ['script']` is set, the following code:

```HTML
code:<script>alert(/xss/);</script>
```

would output filtered:

```HTML
code:
```

#### Filter out HTML comments

By using `allowCommentTag` parameter:

+ `true`: do nothing
+ `false` by default: filter out HTML comments

Example:

If `allowCommentTag = false` is set, the following code:

```HTML
code:<!-- something --> END
```

would output filtered:

```HTML
code: END
```


## Examples

### Allow attributes of whitelist tags start with `data-`

```JavaScript
var source = '<div a="1" b="2" data-a="3" data-b="4">hello</div>';
var html = xss(source, {
  onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
    if (name.substr(0, 5) === 'data-') {
      // escape its value using built-in escapeAttrValue function
      return name + '="' + xss.escapeAttrValue(value) + '"';
    }
  }
});

console.log('%s\nconvert to:\n%s', source, html);
```

Result:

```
<div a="1" b="2" data-a="3" data-b="4">hello</div>
convert to:
<div data-a="3" data-b="4">hello</div>
```

### Allow tags start with `x-`

```JavaScript
var source = '<x><x-1>he<x-2 checked></x-2>wwww</x-1><a>';
var html = xss(source, {
  onIgnoreTag: function (tag, html, options) {
    if (tag.substr(0, 2) === 'x-') {
      // do not filter its attributes
      return html;
    }
  }
});

console.log('%s\nconvert to:\n%s', source, html);
```

Result:

```
<x><x-1>he<x-2 checked></x-2>wwww</x-1><a>
convert to:
&lt;x&gt;<x-1>he<x-2 checked></x-2>wwww</x-1><a>
```

### Parse images in HTML

```JavaScript
var source = '<img src="img1">a<img src="img2">b<img src="img3">c<img src="img4">d';
var list = [];
var html = xss(source, {
  onTagAttr: function (tag, name, value, isWhiteAttr) {
    if (tag === 'img' && name === 'src') {
      // Use the built-in friendlyAttrValue function to escape attribute
      // values. It supports converting entity tags such as &lt; to printable
      // characters such as <
      list.push(xss.friendlyAttrValue(value));
    }
    // Return nothing, means keep the default handling measure
  }
});

console.log('image list:\n%s', list.join(', '));
```

Result:

```
image list:
img1, img2, img3, img4
```

### Filter out HTML tags (keeps only plain text)

```JavaScript
var source = '<strong>hello</strong><script>alert(/xss/);</script>end';
var html = xss(source, {
  whiteList:          [],        // empty, means filter out all tags
  stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
  stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
                                 // to filter out its content
});

console.log('text: %s', html);
```

Result:

```
text: helloend
```


## License

The MIT License
