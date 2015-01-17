Quick Start
=====

## Installing

### NPM

```bash
$ npm install xss
```

### Bower

```bash
$ bower install xss
```

Or

```bash
$ bower install https://github.com/leizongmin/js-xss.git
```


## Usages

### Node.js

```JavaScript
var xss = require('xss');
var html = xss('<script>alert("xss");</script>');
console.log(html);
```

### Browser

Shim mode (reference file `test/test.html`):

```HTML
<script src="https://raw.github.com/leizongmin/js-xss/master/dist/xss.js"></script>
<script>
// apply function filterXSS in the same way
var html = filterXSS('<script>alert("xss");</scr' + 'ipt>');
alert(html);
</script>
```

AMD mode (reference file `test/test_amd.html`):

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
