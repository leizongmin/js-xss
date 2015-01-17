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

## Filter out tags not in the whitelist

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

## Filter out tags and tag bodies not in the whitelist

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

## Filter out HTML comments

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
