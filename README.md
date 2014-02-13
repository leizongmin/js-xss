[![Build Status](https://secure.travis-ci.org/leizongmin/js-xss.png?branch=master)](http://travis-ci.org/leizongmin/js-xss)

XSS代码过滤
======

![xss](https://nodei.co/npm/xss.png?downloads=true&stars=true)

**注意：0.1.x版本与0.0.x版本在自定义配置（除白名单配置外）格式上有较大改动，如果
要使用新版本，请详细阅读下文的使用说明**


## 特性

+ 白名单控制允许的HTML标签及各标签的属性
+ 通过自定义处理函数，可对任意标签及其属性进行处理


## 参考资料

+ [XSS与字符编码的那些事儿 ---科普文](http://drops.wooyun.org/tips/689)
+ [腾讯实例教程：那些年我们一起学XSS](http://www.wooyun.org/whitehats/%E5%BF%83%E4%BC%A4%E7%9A%84%E7%98%A6%E5%AD%90)
+ [XSS Filter Evasion Cheat Sheet](https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet)
+ [Data URI scheme](http://en.wikipedia.org/wiki/Data_URI_scheme)
+ [XSS with Data URI Scheme](http://hi.baidu.com/badzzzz/item/bdbafe83144619c199255f7b)


## 使用

### 在Node.js中使用

安装：

```bash
$ npm install xss
```

简单使用方法：

```JavaScript
var xss = require('xss');
var html = xss('<script>alert("xss");</script>');
console.log(html);
```

### 在浏览器端使用

```HTML
<script src="https://raw.github.com/leizongmin/js-xss/master/build/xss.js"></script>
<script>
// 使用函数名 filterXSS，用法一样
var html = filterXSS('<script>alert("xss");</scr' + 'ipt>');
alert(html);
</script>
```


## 自定义过滤规则

在调用 `xss()` 函数进行过滤时，可通过第二个参数来设置自定义规则：

```JavaScript
options = {};  // 自定义规则
html = xss('<script>alert("xss");</script>', options);
```

具体用法详见下文。

### 白名单

通过 `whiteList` 来指定，格式为：`{'标签名': ['属性1', '属性2']}`。不在白名单中
的标签将被过滤，不在白名单中的属性也会被过滤。以下是示例：

```JavaScript
// 只允许a标签，该标签只允许href, title, target这三个属性
var options = {
  whiteList: {
    a: ['href', 'title', 'target']
  }
};
// 使用以上配置后，下面的HTML
// <a href="#" onclick="hello()"><i>大家好</i></a>
// 将被过滤为
// <a href="#">大家好</a>
```

默认白名单参考 `xss.whiteList`。

### 自定义匹配到标签时的处理方法

通过 `onTag` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onTag (tag, html, options) {
  // tag是当前的标签名称，比如<a>标签，则tag的值是'a'
  // html是该标签的HTML，比如<a>标签，则html的值是'<a>'
  // options是一些附加的信息，具体如下：
  //   isWhite    boolean类型，表示该标签是否在白名单中
  //   isClosing  boolean类型，表示该标签是否为闭合标签，比如</a>时为true
  //   position        integer类型，表示当前标签在输出的结果中的起始位置
  //   sourcePosition  integer类型，表示当前标签在原HTML中的起始位置
  // 如果返回一个字符串，则当前标签将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法：
  //   在白名单中：  通过onTagAttr来过滤属性，详见下文
  //   不在白名单中：通过onIgnoreTag指定，详见下文
}
```

### 自定义匹配到标签的属性时的处理方法

通过 `onTagAttr` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onTagAttr (tag, name, value, isWhiteAttr) {
  // tag是当前的标签名称，比如<a>标签，则tag的值是'a'
  // name是当前属性的名称，比如href="#"，则name的值是'href'
  // value是当前属性的值，比如href="#"，则value的值是'#'
  // isWhiteAttr是否为白名单中的属性
  // 如果返回一个字符串，则当前属性值将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法
  //   在白名单中：  输出该属性
  //   不在白名单中：通过onIgnoreTagAttr指定，详见下文
}
```

### 自定义匹配到不在白名单中的标签时的处理方法

通过 `onIgnoreTag` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onIgnoreTag (tag, html, options) {
  // 参数说明与onTag相同
  // 如果返回一个字符串，则当前标签将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法（通过escape指定，详见下文）
}
```

### 自定义匹配到不在白名单中的属性时的处理方法

通过 `onIgnoreTagAttr` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onIgnoreTagAttr (tag, name, value, isWhiteAttr) {
  // 参数说明与onTagAttr相同
  // 如果返回一个字符串，则当前属性值将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法（删除该属）
}
```

### 自定义HTML转义函数

通过 `escapeHtml` 来指定相应的处理函数。以下是默认代码 **（不建议修改）** ：

```JavaScript
function escapeHtml (html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

### 自定义标签属性值的转义函数

通过 `safeAttrValue` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function safeAttrValue (tag, name, value) {
  // 参数说明与onTagAttr相同（没有options参数）
  // 返回一个字符串表示该属性值
}
```

### 快捷配置

#### stripIgnoreTag

是否去掉不在白名单只的标签：

+ `true`：（默认），去掉不在白名单中的标签
+ `false`：使用配置的`escape`函数对该标签进行转义


## 应用实例

### 去掉&lt;script&gt;标签及标签体内的JS代码

```JavaScript
// 待续
```

### 允许标签以data-开头的属性

```JavaScript
// 待续
```

### 允许名称以x开头的标签

```JavaScript
// 待续
```

### 分析HTML代码中的图片列表

```JavaScript
// 待续
```


## MIT协议

```
Copyright (c) 2012-2014 Zongmin Lei(雷宗民) <leizongmin@gmail.com>
http://ucdok.com

The MIT License

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```