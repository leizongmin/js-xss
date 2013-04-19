/**
 * 工具函数
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var utils = module.exports;

/**
 * 过滤代码块
 *
 * @param {array} tags 要隐藏的标签列表
 * @param {function} next 对不在列表中的标签的处理函数
 */
utils.tagFilter = function (tags, next) {
  if (typeof(next) !== 'function') {
    next = function () {};
  }
  var hidden = [];
  var posStart = false;
  return {
    onIgnoreTag: function (tag, html, options) {
      if (tags.indexOf(tag) !== -1) {
        var ret = '[removed]';
        if (posStart !== false && options.isClosing) {
          var end = options.position + ret.length;
          hidden.push([posStart, end]);
          posStart = false;
        } else {
          posStart = options.position;
        }
        return ret;
      } else {
        return next(tag, html, options);
      }
    },
    filter: function (html) {
      var rethtml = '';
      var lastPos = 0;
      hidden.forEach(function (pos) {
        rethtml += html.slice(lastPos, pos[0]);
        lastPos = pos[1];
      });
      rethtml += html.slice(lastPos);
      return rethtml;
    }
  };
};

