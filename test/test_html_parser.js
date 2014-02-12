/**
 * 测试 html parser
 */

var assert = require('assert');
var parser = require('../lib/parser');
var parseTag = parser.parseTag;
var parseAttr = parser.parseAttr;

describe('test HTML parser', function () {

  function escapeHtml (html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  it('#parseTag', function () {
    var i = 0;
    var html = parseTag('hello<A href="#">www</A>ccc<b>', function (originPosition, position, tag, html, isClosing) {
      i++;
      console.log(arguments);
      if (i === 1) {
        // 第1个标签
        assert.equal(originPosition, 5);
        assert.equal(position, 5);
        assert.equal(tag, 'a');
        assert.equal(html, '<A href="#">');
        assert.equal(isClosing, false);
        return '[link]';
      } else if (i === 2) {
        // 第2个标签
        assert.equal(originPosition, 20);
        assert.equal(position, 14);
        assert.equal(tag, 'a');
        assert.equal(html, '</A>');
        assert.equal(isClosing, true);
        return '[/link]';
      } else if (i === 3) {
        // 第3个标签
        assert.equal(originPosition, 27);
        assert.equal(position, 24);
        assert.equal(tag, 'b');
        assert.equal(html, '<b>');
        assert.equal(isClosing, false);
        return '[B]';
      } else {
        throw new Error();
      }
    }, escapeHtml);
    assert.equal(html, 'hello[link]www[/link]ccc[B]');
  });

  it('#parseAttr', function () {

  });

});
