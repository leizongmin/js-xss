Customize Filter Rules
========

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
