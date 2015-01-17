安装
=====

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
