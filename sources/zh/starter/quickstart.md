安装与使用
=====

## 安装

### NPM

```bash
$ npm install xss
```

### Bower

```bash
$ bower install xss
```

或者

```bash
$ bower install https://github.com/leizongmin/js-xss.git
```


## 使用方法

### 在Node.js中使用

```JavaScript
var xss = require('xss');
var html = xss('<script>alert("xss");</script>');
console.log(html);
```

### 在浏览器端使用

Shim模式（参考文件 `test/test.html`）:

```HTML
<script src="https://raw.github.com/leizongmin/js-xss/master/dist/xss.js"></script>
<script>
// 使用函数名 filterXSS，用法一样
var html = filterXSS('<script>alert("xss");</scr' + 'ipt>');
alert(html);
</script>
```

AMD模式（参考文件 `test/test_amd.html`）:

```HTML
<script>
require.config({
  baseUrl: './'
})
require(['xss'], function (xss) {
  var html = xss('<script>alert("xss");</scr' + 'ipt>');
  alert(html);
});
</script>
```

## 去掉不在白名单上的标签

通过 `stripIgnoreTag` 来设置：

+ `true`：去掉不在白名单上的标签
+ `false`：（默认），使用配置的`escapehtmlape`函数对该标签进行转义

示例：

当设置 `stripIgnoreTag = true`时，以下代码

```HTML
code:<script>alert(/xss/);</script>
```

过滤后将输出

```HTML
code:alert(/xss/);
```

## 去掉不在白名单上的标签及标签体

通过 `stripIgnoreTagBody` 来设置：

+ `false|null|undefined`：（默认），不特殊处理
+ `'*'|true`：去掉所有不在白名单上的标签
+ `['tag1', 'tag2']`：仅去掉指定的不在白名单上的标签

示例：

当设置 `stripIgnoreTagBody = ['script']`时，以下代码

```HTML
code:<script>alert(/xss/);</script>
```

过滤后将输出

```HTML
code:
```

## 去掉HTML备注

通过 `allowCommentTag` 来设置：

+ `true`：不处理
+ `false`：（默认），自动去掉HTML中的备注

示例：

当设置 `allowCommentTag = false` 时，以下代码

```HTML
code:<!-- something --> END
```

过滤后将输出

```HTML
code: END
```
