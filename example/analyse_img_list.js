/**
 * 应用实例：分析HTML代码中的图片列表
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var xss = require('../');

var source = '<img src="img1">a<img src="img2">b<img src="img3">c<img src="img4">d';
var list = [];
var html = xss(source, {
  onTagAttr: function (tag, name, value, isWhiteAttr) {
    if (tag === 'img' && name === 'src') {
      // 使用内置的friendlyAttrValue函数来对属性值进行转义，可将&lt;这类的实体标记转换成打印字符<
      list.push(xss.friendlyAttrValue(value));
    }
    // 不返回任何值，表示还是按照默认的方法处理
  }
});

console.log('image list:\n%s', list.join(', '));

/*
运行结果：
image list:
img1, img2, img3, img4
*/