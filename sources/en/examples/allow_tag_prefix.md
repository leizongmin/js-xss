Allow tags start with x-
=====

```JavaScript
var source = '<x><x-1>he<x-2 checked></x-2>wwww</x-1><a>';
var html = xss(source, {
  onIgnoreTag: function (tag, html, options) {
    if (tag.substr(0, 2) === 'x-') {
      // do not filter its attributes
      return html;
    }
  }
});

console.log('%s\nconvert to:\n%s', source, html);
```

Result:

```
<x><x-1>he<x-2 checked></x-2>wwww</x-1><a>
convert to:
&lt;x&gt;<x-1>he<x-2 checked></x-2>wwww</x-1><a>
```
