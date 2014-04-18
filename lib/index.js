/**
 * 模块入口
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var DEFAULT = require('./default');
var parser = require('./parser');
var FilterXSS = require('./xss');


/**
 * XSS过滤
 *
 * @param {String} html 要过滤的HTML代码
 * @param {Object} options 选项：whiteList, onTag, onTagAttr, onIgnoreTag, onIgnoreTagAttr, safeAttrValue, escapeHtml
 * @return {String}
 */
function filterXSS (html, options) {
  var xss = new FilterXSS(options);
  return xss.process(html);
}


// 输出
exports = module.exports = filterXSS;
exports.FilterXSS = FilterXSS;
for (var i in DEFAULT) exports[i] = DEFAULT[i];
for (var i in parser) exports[i] = parser[i];


// 在浏览器端使用
if (typeof window !== 'undefined') {
  // 低版本浏览器支持
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (item) {
      for(var i=0;i<this.length;i++){
        if(this[i] == item) return i;
      }
      return -1;
    };
  }
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (fn, scope) {
      for (var i = 0; i < this.length; i++) fn.call(scope, this[i], i, this);
    };
  }
  if(!String.prototype.trim){
    String.prototype.trim = function () {
      return this.replace(/(^\s*)|(\s*$)/g, '');
    };
  }
  // 输出
  window.filterXSS = module.exports;
}
