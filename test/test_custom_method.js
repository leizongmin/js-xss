/**
 * 测试XSS 自定义处理函数
 */

var assert = require('assert');
var xss = require('../');


describe('test custom XSS method', function () {


/*
  // 自定义过滤属性函数
  it('#process attribute value', function () {

    assert.equal(xss('<a href="ignore:ooxx">abc</a><a href="ooxx">', {
      onTagAttr: function (tag, attr, value) {
        if (tag === 'a' && attr === 'href') {
          if (value.substr(0, 7) === 'ignore:') {
            return '#';
          }
        }
      }
    }), '<a href="#">abc</a><a href="ooxx">');

  });

  // 自定义处理不在白名单中的标签
  it('#process ignore tag', function () {

    // 过滤标签
    assert.equal(xss('<ooxx xxyy>ookk</ooxx><img>', {
      onIgnoreTag: function (tag, html) {
        return '';
      }
    }), 'ookk<img>');
    assert.equal(xss('<ooxx xxyy>ookk</ooxx><img>', {
      onIgnoreTag: function (tag, html) {
        return '[removed]';
      }
    }), '[removed]ookk[removed]<img>');

    // 检验附加属性
    var isClosing = [];
    var position = [];
    var originalPosition = [];
    var html = xss('TTG:<ooxx href="ooy" >ds</ooxx>--ds  d<yy hh uu>', {
      onIgnoreTag: function (tag, html, options) {
        isClosing.push(options.isClosing);
        position.push(options.position);
        originalPosition.push(options.originalPosition);
      }
    });
    //console.log(html);
    assert.deepEqual(isClosing, [false, true, false]);
    assert.deepEqual(position, [4, 30, 50]);
    assert.deepEqual(originalPosition, [4, 24, 38]);

    // 替换检验 utils.tagFilter()
    var filter = xss.utils.tagFilter(['script']);
    var html = xss('<b >script is <script t="d">alert("xss"); ooxx()</script>, wahaha!!</b>', {
      onIgnoreTag:  filter.onIgnoreTag
    });
    assert.equal(filter.filter(html), '<b>script is , wahaha!!</b>');

    var filter = xss.utils.tagFilter(['x2']);
    var html = xss('<x1></b><x2>dds</x2><x3>fd</x3>', {
      onIgnoreTag:  filter.onIgnoreTag
    });
    assert.equal(filter.filter(html), '&lt;x1&gt;</b>&lt;x3&gt;fd&lt;/x3&gt;');

  });
*/

});