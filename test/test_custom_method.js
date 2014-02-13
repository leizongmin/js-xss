/**
 * 测试XSS 自定义处理函数
 */

var assert = require('assert');
var xss = require('../');


describe('test custom XSS method', function () {

  it('#onTag - match tag', function () {
    var source = 'dd<a href="#"><b><c>haha</c></b></a><br>ff';
    var i = 0;
    var html = xss(source, {
      onTag: function (tag, html, options) {
        console.log(arguments);
        i++;
        if (i === 1) {
          assert.equal(tag, 'a');
          assert.equal(html, '<a href="#">');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 2);
          assert.equal(options.originPosition, 2);
          assert.equal(options.isWhite, true);
        } else if (i === 2) {
          assert.equal(tag, 'b');
          assert.equal(html, '<b>');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 14);
          assert.equal(options.originPosition, 14);
          assert.equal(options.isWhite, true);
        } else if (i === 3) {
          assert.equal(tag, 'c');
          assert.equal(html, '<c>');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 17);
          assert.equal(options.originPosition, 17);
          assert.equal(options.isWhite, false);
        } else if (i === 4) {
          assert.equal(tag, 'c');
          assert.equal(html, '</c>');
          assert.equal(options.isClosing, true);
          assert.equal(options.position, 30);
          assert.equal(options.originPosition, 24);
          assert.equal(options.isWhite, false);
        } else if (i === 5) {
          assert.equal(tag, 'b');
          assert.equal(html, '</b>');
          assert.equal(options.isClosing, true);
          assert.equal(options.position, 40);
          assert.equal(options.originPosition, 28);
          assert.equal(options.isWhite, true);
        } else if (i === 6) {
          assert.equal(tag, 'a');
          assert.equal(html, '</a>');
          assert.equal(options.isClosing, true);
          assert.equal(options.position, 44);
          assert.equal(options.originPosition, 32);
          assert.equal(options.isWhite, true);
        } else if (i === 7) {
          assert.equal(tag, 'br');
          assert.equal(html, '<br>');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 48);
          assert.equal(options.originPosition, 36);
          assert.equal(options.isWhite, true);
        } else {
          throw new Error();
        }
      }
    });
    console.log(html);
    assert.equal(html, 'dd<a href="#"><b>&lt;c&gt;haha&lt;/c&gt;</b></a><br>ff');

  });

  it('#onTag - return new html', function () {
    var source = 'dd<a href="#"><b><c>haha</c></b></a><br>ff';
    var i = 0;
    var html = xss(source, {
      onTag: function (tag, html, options) {
        console.log(html);
        return html;
      }
    });
    console.log(html);
    assert.equal(html, source);
  });

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
    var originPosition = [];
    var html = xss('TTG:<ooxx href="ooy" >ds</ooxx>--ds  d<yy hh uu>', {
      onIgnoreTag: function (tag, html, options) {
        isClosing.push(options.isClosing);
        position.push(options.position);
        originPosition.push(options.originPosition);
      }
    });
    //console.log(html);
    assert.deepEqual(isClosing, [false, true, false]);
    assert.deepEqual(position, [4, 30, 50]);
    assert.deepEqual(originPosition, [4, 24, 38]);

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