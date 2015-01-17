Filter out HTML tags (keeps only plain text)
=====

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
