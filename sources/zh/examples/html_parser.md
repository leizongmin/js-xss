Parse images in HTML
======

```JavaScript
var source = '<img src="img1">a<img src="img2">b<img src="img3">c<img src="img4">d';
var list = [];
var html = xss(source, {
  onTagAttr: function (tag, name, value, isWhiteAttr) {
    if (tag === 'img' && name === 'src') {
      // Use the built-in friendlyAttrValue function to escape attribute
      // values. It supports converting entity tags such as &lt; to printable
      // characters such as <
      list.push(xss.friendlyAttrValue(value));
    }
    // Return nothing, means keep the default handling measure
  }
});

console.log('image list:\n%s', list.join(', '));
```

Result:

```
image list:
img1, img2, img3, img4
```
