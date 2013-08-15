[![Build Status](https://secure.travis-ci.org/leizongmin/js-xss.png?branch=master)](http://travis-ci.org/leizongmin/js-xss)

过滤XSS攻击
======

## 安装

**npm install xss**


## 原理

通过标签白名单及属性白名单来过滤HTML标签，同时对包含特殊字符的属性值进行处理。默认配置可过滤大多数的XSS攻击代码，可根据实际应用场景来定制白名单及过滤方法。


## 使用方法

### 载入模块

```javascript
var xss = require('xss');
```

### 使用默认的配置

```javascript
var html = xss('<script>alert("xss");</script>');
console.log(html);
```

### 修改默认配置

```javascript
// 添加或更新白名单中的标签 标签名（小写） = ['允许的属性列表（小写）']
xss.whiteList['p'] = ['class', 'style'];
// 删除默认的白名单标签
delete xss.whiteList['div'];

// 自定义处理属性值函数
xss.onTagAttr = function (tag, attr, vaule) {
  // tag：当前标签名（小写）
  // attr：当前属性名（小写）
  // value：当前属性值
  // 返回新的属性值，如果想使用默认的处理方式，不返回任何值即可
  // 比如把属性值中的双引号替换为&amp;quote;：return value.replace(/"/g, '&amp;quote;');
  // 以下为默认的处理代码：
  if (attr === 'href' || attr === 'src') {
    if (/\/\*|\*\//mg.test(value)) {
      return '#';
    }
    if (/^[\s"'`]*((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig.test(value)) {
      return '#';
    }
  } else if (attr === 'style') {
    if (/\/\*|\*\//mg.test(value)) {
      return '#';
    }
    if (/((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig.test(value)) {
      return '';
    }
  }
};

// 自定义处理不在白名单中的标签
xss.onIgnoreTag = function (tag, html) {
  // tag：当前标签名（小写），如：a
  // html：当前标签的HTML代码，如：<a href="ooxx">
  // 返回新的标签HTML代码，如果想使用默认的处理方式，不返回任何值即可
  // 比如将标签替换为[removed]：return '[removed]';
  // 以下为默认的处理代码：
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

### 使用临时配置

```javascript
var options = {
  whiteList:   {},        // 若不指定则使用默认配置，可参考xss.whiteList
  onTagAttr:   function () {},  // 若不指定则使用默认配置，可参考xss.onTagAttr
  onIgnoreTag: function () {}   // 若不指定则使用默认配置，可参考xss.onIgnoreTag
};
var html = xss('<script>alert("xss");</script>', options);
console.log(html);
```

### 在浏览器端使用

```
<script src="https://raw.github.com/leizongmin/js-xss/master/build/xss.js"></script>
<script>
// 使用函数名 filterXSS，用法一样
var html = filterXSS('<script>alert("xss");</scr' + 'ipt>');
alert(html);
</script>
```


## 其他应用


## 测试

### 单元测试

在源码目录执行命令： **npm test**

### 在线测试

在源码目录执行命令： **node lib/cli.js** ，可在命令行中输入HTML代码，并看到过滤后的代码


## 性能

解析速度为 **5.81MB/s** ，而另外一个 **validator** 模块的xss()函数速度仅为 **2.48MB/s** 。

测试代码参考 **benchmark** 目录


## 授权协议

基于MIT协议发布：

```
Copyright (c) 2012-2013 Lei Zongmin(雷宗民) <leizongmin@gmail.com>
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