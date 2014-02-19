/**
 * 应用实例：去除HTML标签（只保留文本内容）
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var xss = require('../');

var source = '<strong>hello</strong><script>alert(/xss/);</script>end';
var html = xss(source, {
  whiteList:          [],        // 白名单为空，表示过滤所有标签
  stripIgnoreTag:     true,      // 过滤所有非白名单标签的HTML
  stripIgnoreTagBody: ['script'] // script标签较特殊，需要过滤标签中间的内容
});

console.log('text: %s', html);

/*
运行结果：
text: helloend
*/