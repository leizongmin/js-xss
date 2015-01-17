自定义过滤规则
=====

在调用 `xss()` 函数进行过滤时，可通过第二个参数来设置自定义规则：

```JavaScript
options = {};  // 自定义规则
html = xss('<script>alert("xss");</script>', options);
```

如果不想每次都传入一个 `options` 参数，可以创建一个 `FilterXSS` 实例
（使用这种方法速度更快）：

```
options = {};  // 自定义规则
myxss = new xss.FilterXSS(options);
// 以后直接调用 myxss.process() 来处理即可
html = myxss.process('<script>alert("xss");</script>');
```

`options` 参数的详细说明见下文。