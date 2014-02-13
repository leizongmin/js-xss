/**
 * 应用实例：允许标签以data-开头的属性
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var xss = require('../');

var source = '<div a="1" b="2" data-a="3" data-b="4">hello</div>';
var html = xss(source, {
  onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
    if (name.substr(0, 5) === 'data-') {
      // 通过内置的escapeAttrValue函数来对属性值进行转义
      return name + '="' + xss.escapeAttrValue(value) + '"';
    }
  }
});

console.log('%s\nconvert to:\n%s', source, html);

/*
运行结果：
<div a="1" b="2" data-a="3" data-b="4">hello</div>
convert to:
<div data-a="3" data-b="4">hello</div>
*/