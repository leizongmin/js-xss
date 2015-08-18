/**
 * 简单 HTML Parser
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var _ = require('./util');

/**
 * 获取标签的名称
 *
 * @param {String} html 如：'<a hef="#">'
 * @return {String}
 */
function getTagName (html) {
  var i = html.indexOf(' ');
  if (i === -1) {
    var tagName = html.slice(1, -1);
  } else {
    var tagName = html.slice(1, i + 1);
  }
  tagName = _.trim(tagName).toLowerCase();
  if (tagName.slice(0, 1) === '/') tagName = tagName.slice(1);
  if (tagName.slice(-1) === '/') tagName = tagName.slice(0, -1);
  return tagName;
}

/**
 * 是否为闭合标签
 *
 * @param {String} html 如：'<a hef="#">'
 * @return {Boolean}
 */
function isClosing (html) {
  return (html.slice(0, 2) === '</');
}

/**
 * 分析HTML代码，调用相应的函数处理，返回处理后的HTML
 *
 * @param {String} html
 * @param {Function} onTag 处理标签的函数
 *   参数格式： function (sourcePosition, position, tag, html, isClosing)
 * @param {Function} escapeHtml 对HTML进行转义的函数
 * @return {String}
 */
function parseTag (html, onTag, escapeHtml) {
  'user strict';

  var rethtml = '';        // 待返回的HTML
  var lastPos = 0;         // 上一个标签结束位置
  var tagStart = false;    // 当前标签开始位置
  var quoteStart = false;  // 引号开始位置
  var currentPos = 0;      // 当前位置
  var len = html.length;   // HTML长度
  var currentHtml = '';    // 当前标签的HTML代码
  var currentTagName = ''; // 当前标签的名称

  // 逐个分析字符
  for (currentPos = 0; currentPos < len; currentPos++) {
    var c = html.charAt(currentPos);
    if (tagStart === false) {
      if (c === '<') {
        tagStart = currentPos;
        continue;
      }
    } else {
      if (quoteStart === false) {
        if (c === '<') {
          rethtml += escapeHtml(html.slice(lastPos, currentPos));
          tagStart = currentPos;
          lastPos = currentPos;
          continue;
        }
        if (c === '>') {
          rethtml += escapeHtml(html.slice(lastPos, tagStart));
          currentHtml = html.slice(tagStart, currentPos + 1);
          currentTagName = getTagName(currentHtml);
          rethtml += onTag(tagStart,
                           rethtml.length,
                           currentTagName,
                           currentHtml,
                           isClosing(currentHtml));
          lastPos = currentPos + 1;
          tagStart = false;
          continue;
        }
        // HTML标签内的引号仅当前一个字符是等于号时才有效
        if ((c === '"' || c === "'") && html.charAt(currentPos - 1) === '=') {
          quoteStart = c;
          continue;
        }
      } else {
        if (c === quoteStart) {
          quoteStart = false;
          continue;
        }
      }
    }
  }
  if (lastPos < html.length) {
    rethtml += escapeHtml(html.substr(lastPos));
  }

  return rethtml;
}

// 不符合属性名称规则的正则表达式
var REGEXP_ATTR_NAME = /[^a-zA-Z0-9_:\.\-]/img;

/**
 * 分析标签HTML代码，调用相应的函数处理，返回HTML
 *
 * @param {String} html 如标签'<a href="#" target="_blank">' 则为 'href="#" target="_blank"'
 * @param {Function} onAttr 处理属性值的函数
 *   函数格式： function (name, value)
 * @return {String}
 */
function parseAttr (html, onAttr) {
  'user strict';

  var lastPos = 0;        // 当前位置
  var retAttrs = [];      // 待返回的属性列表
  var tmpName = false;    // 临时属性名称
  var len = html.length;  // HTML代码长度

  function addAttr (name, value) {
    name = _.trim(name);
    name = name.replace(REGEXP_ATTR_NAME, '').toLowerCase();
    if (name.length < 1) return;
    var ret = onAttr(name, value || '');
    if (ret) retAttrs.push(ret);
  };

  // 逐个分析字符
  for (var i = 0; i < len; i++) {
    var c = html.charAt(i);
    var v, j;
    if (tmpName === false && c === '=') {
      tmpName = html.slice(lastPos, i);
      lastPos = i + 1;
      continue;
    }
    if (tmpName !== false) {
      // HTML标签内的引号仅当前一个字符是等于号时才有效
      if (i === lastPos && (c === '"' || c === "'") && html.charAt(i - 1) === '=') {
        j = html.indexOf(c, i + 1);
        if (j === -1) {
          break;
        } else {
          v = _.trim(html.slice(lastPos + 1, j));
          addAttr(tmpName, v);
          tmpName = false;
          i = j;
          lastPos = i + 1;
          continue;
        }
      }
    }
    if (c === ' ') {
      if (tmpName === false) {
        j = findNextEqual(html, i);
        if (j === -1) {
          v = _.trim(html.slice(lastPos, i));
          addAttr(v);
          tmpName = false;
          lastPos = i + 1;
          continue;
        } else {
          i = j - 1;
          continue;
        }
      } else {
        j = findBeforeEqual(html, i - 1);
        if (j === -1) {
          v = _.trim(html.slice(lastPos, i));
          v = stripQuoteWrap(v);
          addAttr(tmpName, v);
          tmpName = false;
          lastPos = i + 1;
          continue;
        } else {
          continue;
        }
      }
    }
  }

  if (lastPos < html.length) {
    if (tmpName === false) {
      addAttr(html.slice(lastPos));
    } else {
      addAttr(tmpName, stripQuoteWrap(_.trim(html.slice(lastPos))));
    }
  }

  return _.trim(retAttrs.join(' '));
}

function findNextEqual (str, i) {
  for (; i < str.length; i++) {
    var c = str[i];
    if (c === ' ') continue;
    if (c === '=') return i;
    return -1;
  }
}

function findBeforeEqual (str, i) {
  for (; i > 0; i--) {
    var c = str[i];
    if (c === ' ') continue;
    if (c === '=') return i;
    return -1;
  }
}

function isQuoteWrapString (text) {
  if ((text[0] === '"' && text[text.length - 1] === '"') ||
      (text[0] === '\'' && text[text.length - 1] === '\'')) {
    return true;
  } else {
    return false;
  }
};

function stripQuoteWrap (text) {
  if (isQuoteWrapString(text)) {
    return text.substr(1, text.length - 2);
  } else {
    return text;
  }
};


exports.parseTag = parseTag;
exports.parseAttr = parseAttr;
