/**
 * 过滤XSS攻击
 *
 * @author 老雷<leizongmin@gmail.com>
 */

/*
 * 默认HTML标签白名单
 * 标签名=>属性列表
 */
var defaultWhiteList = {
  h1:     ['style', 'class'],
  h2:     ['style', 'class'],
  h3:     ['style', 'class'],
  h4:     ['style', 'class'],
  h5:     ['style', 'class'],
  h6:     ['style', 'class'],
  hr:     ['style', 'class'],
  span:   ['style', 'class'],
  strong: ['style', 'class'],
  b:      ['style', 'class'],
  i:      ['style', 'class'],
  br:     [],
  p:      ['style', 'class'],
  pre:    ['style', 'class'],
  code:   ['style', 'class'],
  a:      ['style', 'class', 'target', 'href', 'title'],
  img:    ['style', 'class', 'src', 'alt', 'title'],
  div:    ['style', 'class'],
  table:  ['style', 'class', 'width', 'border'],
  tr:     ['style', 'class'],
  td:     ['style', 'class', 'width', 'colspan'],
  th:     ['style', 'class', 'width', 'colspan'],
  tbody:  ['style', 'class'],
  ul:     ['style', 'class'],
  li:     ['style', 'class'],
  ol:     ['style', 'class'],
  dl:     ['style', 'class'],
  dt:     ['style', 'class'],
  em:     ['style'],
  cite:   ['style'],
  section:['style', 'class'],
  header: ['style', 'class'],
  footer: ['style', 'class'],
  blockquote: ['style', 'class'],
  audio:  ['autoplay', 'controls', 'loop', 'preload', 'src'],
  video:  ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width'],
};

// 正则表达式
var REGEXP_LT = /</g;
var REGEXP_GT = />/g;
var REGEXP_QUOTE = /"/g;
var REGEXP_ATTR_NAME = /[^a-zA-Z0-9_:\.\-]/img;
var REGEXP_ATTR_VALUE = /&#([a-zA-Z0-9]*);?/img;
var REGEXP_DEFAULT_ON_TAG_ATTR_1 = /\/\*|\*\//mg;
var REGEXP_DEFAULT_ON_TAG_ATTR_2 = /^[\s"'`]*((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;
var REGEXP_DEFAULT_ON_TAG_ATTR_3 = /\/\*|\*\//mg;
var REGEXP_DEFAULT_ON_TAG_ATTR_4 = /((j\s*a\s*v\s*a|v\s*b|l\s*i\s*v\s*e)\s*s\s*c\s*r\s*i\s*p\s*t\s*|m\s*o\s*c\s*h\s*a):/ig;


/**
 * 过滤属性值
 *
 * @param {string} tag 标签名
 * @param {string} attr 属性名
 * @param {string} value 属性值
 * @return {string} 若不需要修改属性值，不返回任何值
 */
function defaultOnTagAttr (tag, attr, value) {
  if (attr === 'href' || attr === 'src') {
    REGEXP_DEFAULT_ON_TAG_ATTR_1.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_1.test(value)) {
      return '#';
    }
    REGEXP_DEFAULT_ON_TAG_ATTR_2.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_2.test(value)) {
      return '#';
    }
  } else if (attr === 'style') {
    REGEXP_DEFAULT_ON_TAG_ATTR_3.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_3.test(value)) {
      return '#';
    }
    REGEXP_DEFAULT_ON_TAG_ATTR_4.lastIndex = 0;
    if (REGEXP_DEFAULT_ON_TAG_ATTR_4.test(value)) {
      return '';
    }
  }
};

/**
 * 过滤非白名单的标签
 *
 * @param {string} tag 标签名
 * @param {string} html 标签HTML代码（包括属性值）
 * @param {object} options 更多属性：
 *                   position：在返回的HTML代码中的开始位置
 *                   originalPosition：在原HTML代码中的开始位置
 *                   isClosing：是否为闭合标签，如</a>
 * @return {string} 若不返回任何值，则默认替换<>为&lt;&gt;
 */
function defaultOnIgnoreTag (tag, html, options) {
  return noTag(html);
};


/**
 * 转换<>为&lt; &gt
 *
 * @param {string} text
 * @return {string}
 */
function noTag (text) {
  return text.replace(REGEXP_LT, '&lt;').replace(REGEXP_GT, '&gt;');
};



/**
 * XSS过滤
 *
 * @param {string} html 要过滤的HTML代码
 * @param {object} options 选项：whiteList, onTagAttr, onIgnoreTag
 * @return {string}
 */
function filterXSS (html, options) {
  'use strict';

  options = options || {};
  var whiteList = options.whiteList || exports.whiteList;
  var onTagAttr = options.onTagAttr || exports.onTagAttr;
  var onIgnoreTag = options.onIgnoreTag || exports.onIgnoreTag;

  var rethtml = '';
  var lastPos = 0;
  var tagStart = false;
  var quoteStart = false;
  var currentPos = 0;

  /**
   * 过滤不合法的属性
   */
  function filterAttributes (tagName, attrs) {
    tagName = tagName.toLowerCase();
    var whites = whiteList[tagName];
    var lastPos = 0;
    var _attrs = [];
    var tmpName = false;
    var hasSprit = false;
    var addAttr = function (name, value) {
      name =  name.trim();
      if (!hasSprit && name === '/') {
        hasSprit = true;
        return;
      };
      name = name.replace(REGEXP_ATTR_NAME, '').toLowerCase();
      if (name.length < 1) return;
      if (whites.indexOf(name) !== -1) {
        if (value) {
          value = value.trim().replace(REGEXP_QUOTE, '&quote;');
          // 转换unicode字符 及过滤不可见字符
          value = value.replace(REGEXP_ATTR_VALUE, function (str, code) {
            code = parseInt(code);
            return String.fromCharCode(code);
          });
          var _value = '';
          for (var i = 0, len = value.length; i < len; i++) {
            _value += value.charCodeAt(i) < 32 ? ' ' : value[i];
          }
          value = _value.trim();
          var newValue = onTagAttr(tagName, name, value);
          if (typeof(newValue) !== 'undefined') {
            value = newValue;
          }
        }
        _attrs.push(name + (value ? '="' + value + '"' : ''));
      }
    };
    for (var i = 0, len = attrs.length; i < len; i++) {
      var c = attrs[i];
      if (tmpName === false && c === '=') {
        tmpName = attrs.slice(lastPos, i);
        lastPos = i + 1;
        continue;
      }
      if (tmpName !== false) {
        if (i === lastPos && (c === '"' || c === "'")) {
          var j = attrs.indexOf(c, i + 1);
          if (j === -1) {
            break;
          } else {
            var v = attrs.slice(lastPos + 1, j).trim();
            addAttr(tmpName, v);
            tmpName = false;
            i = j;
            lastPos = i + 1;
            continue;
          }
        }
      }
      if (c === ' ') {
        var v = attrs.slice(lastPos, i).trim();
        if (tmpName === false) {
          addAttr(v);
        } else {
          addAttr(tmpName, v);
        }
        tmpName = false;
        lastPos = i + 1;
        continue;
      }
    }
    if (lastPos < attrs.length) {
      if (tmpName === false) {
        addAttr(attrs.slice(lastPos));
      } else {
        addAttr(tmpName, attrs.slice(lastPos));
      }
    }
    if (hasSprit) _attrs.push('/');
    return _attrs.join(' ');
  };

  /**
   * 检查标签是否合法
   */
  function addNewTag (tag, end) {
    rethtml += noTag(html.slice(lastPos, tagStart));
    lastPos = end + 1;
    var spos = tag.slice(0, 2) === '</' ? 2 : 1;
    
    var i = tag.indexOf(' ');
    if (i === -1) {
      var tagName = tag.slice(spos, tag.length - 1).trim();
    } else {
      var tagName = tag.slice(spos, i + 1).trim();
    }
    tagName = tagName.toLowerCase();
    if (tagName in whiteList) {
      // 过滤不合法的属性
      if (i === -1) {
        rethtml += tag.slice(0, spos) + tagName + '>';
      } else {
        var attrs = filterAttributes(tagName, tag.slice(i + 1, tag.length - 1).trim());
        rethtml += tag.slice(0, spos) + tagName + (attrs.length > 0 ? ' ' + attrs : '') + '>';
      }
    } else {
      // 过滤不合法的标签
      var options = {
        isClosing:        (spos === 2),
        position:         rethtml.length,
        originalPosition: currentPos - tag.length + 1
      };
      var tagHtml = onIgnoreTag(tagName, tag, options);
      if (typeof(tagHtml) === 'undefined') {
        tagHtml = noTag(tag);
      }
      rethtml += tagHtml;
    }
  };

  // 逐个分析字符
  for (var currentPos = 0, len = html.length; currentPos < len; currentPos++) {
    var c = html[currentPos];
    if (tagStart === false) {
      if (c === '<') {
        tagStart = currentPos;
        continue;
      }
    } else {
      if (quoteStart === false) {
        if (c === '<') {
          rethtml += noTag(html.slice(lastPos, currentPos));
          tagStart = currentPos;
          lastPos = currentPos;
          continue;
        }
        if (c === '>') {
          addNewTag(html.slice(tagStart, currentPos + 1), currentPos);
          tagStart = false;
          continue;
        }
        if (c === '"' || c === "'") {
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
    rethtml += noTag(html.substr(lastPos));
  }
  return rethtml;
};

// 默认配置
exports = module.exports = filterXSS;
exports.whiteList = defaultWhiteList;
exports.onTagAttr = defaultOnTagAttr;
exports.onIgnoreTag = defaultOnIgnoreTag;

// 工具函数
exports.utils = require('./utils');

// 在浏览器端使用
if (typeof window !== 'undefined') {
  window.filterXSS = module.exports;
}
