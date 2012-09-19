过滤XSS攻击
======

## 安装

**npm install xss**


## 使用方法：

```javascript
var xss = require('xss');
// 使用默认的HTML白名单
console.log(xss('<script>alert("fff");</script>'));
// 指定HTML白名单
var whiteList = {
	tag: ['attribute1', 'attribute2']	// 允许的属性
};
console.log(xss('<script>alert("fff");</script>', whiteList));
// 请参考默认的白名单：xss.whiteList

// 过滤指定属性的值，参考默认的 xss.onTagAttr
console.log(xss('<a href="javascript:ooxx">abc</a>', function (tag, attr, value) {
	if (tag === 'a' && attr === 'href') {
		if (value.substr(0, '11') === 'javascript:') {
			return '#';
    	}
  	}
}));
```


## 测试

**npm test**


## 性能

解析速度为**6.26MB/s**，而另外一个**validator**模块的xss()函数速度仅为**2.82MB/s**。

测试代码参考**benchmark**目录


## 授权协议

基于MIT协议发布：

```
Copyright (c) 2012 Lei Zongmin(雷宗民) <leizongmin@gmail.com>
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