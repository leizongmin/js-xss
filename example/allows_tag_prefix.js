/**
 * 应用实例：允许名称以x-开头的标签
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var xss = require('../');

var source = '<x><x-1>he<x-2 checked></x-2>wwww</x-1><a>';
var html = xss(source, {
  onIgnoreTag: function (tag, html, options) {
    if (tag.substr(0, 2) === 'x-') {
      // 不对其属性列表进行过滤
      return html;
    }
  }
});

console.log('%s\nconvert to:\n%s', source, html);

/*
运行结果：
<x><x-1>he<x-2 checked></x-2>wwww</x-1><a>
convert to:
&lt;x&gt;<x-1>he<x-2 checked></x-2>wwww</x-1><a>
*/