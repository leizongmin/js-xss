/**
 * 测试 html parser
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var assert = require('assert');
var parser = require('../lib/parser');
var parseTag = parser.parseTag;
var parseAttr = parser.parseAttr;
var debug = require('debug')('xss:test');

describe('test HTML parser', function () {

  function escapeHtml (html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function attr (n, v) {
    if (v) {
      return n + '="' + v.replace(/"/g, '&quote;') + '"';
    } else {
      return n;
    }
  }

  it('#parseTag', function () {
    var i = 0;
    var html = parseTag('hello<A href="#">www</A>ccc<b><br/>', function (sourcePosition, position, tag, html, isClosing) {
      i++;
      debug(arguments);
      if (i === 1) {
        // 第1个标签
        assert.equal(sourcePosition, 5);
        assert.equal(position, 5);
        assert.equal(tag, 'a');
        assert.equal(html, '<A href="#">');
        assert.equal(isClosing, false);
        return '[link]';
      } else if (i === 2) {
        // 第2个标签
        assert.equal(sourcePosition, 20);
        assert.equal(position, 14);
        assert.equal(tag, 'a');
        assert.equal(html, '</A>');
        assert.equal(isClosing, true);
        return '[/link]';
      } else if (i === 3) {
        // 第3个标签
        assert.equal(sourcePosition, 27);
        assert.equal(position, 24);
        assert.equal(tag, 'b');
        assert.equal(html, '<b>');
        assert.equal(isClosing, false);
        return '[B]';
      } else if (i === 4) {
        // 第4个标签
        assert.equal(sourcePosition, 30);
        assert.equal(position, 27);
        assert.equal(tag, 'br');
        assert.equal(html, '<br/>');
        assert.equal(isClosing, false);
        return '[BR]';
      } else {
        throw new Error();
      }
    }, escapeHtml);
    debug(html);
    assert.equal(html, 'hello[link]www[/link]ccc[B][BR]');
  });

  it('#parseAttr', function () {
    var i = 0;
    var html = parseAttr('href="#"attr1=b attr2=c attr3 attr4=\'value4"\'attr5/', function (name, value) {
      i++;
      debug(arguments);
      if (i === 1) {
        assert.equal(name, 'href');
        assert.equal(value, '#');
        return attr(name, value);
      } else if (i === 2) {
        assert.equal(name, 'attr1');
        assert.equal(value, 'b');
        return attr(name, value);
      } else if (i === 3) {
        assert.equal(name, 'attr2');
        assert.equal(value, 'c');
        return attr(name, value);
      } else if (i === 4) {
        assert.equal(name, 'attr3');
        assert.equal(value, '');
        return attr(name, value);
      } else if (i === 5) {
        assert.equal(name, 'attr4');
        assert.equal(value, 'value4"');
        return attr(name, value);
      } else if (i === 6) {
        assert.equal(name, 'attr5');
        assert.equal(value, '');
        return attr(name, value);
      } else {
        throw new Error();
      }
    });
    debug(html);
    assert.equal(html, 'href="#" attr1="b" attr2="c" attr3 attr4="value4&quote;" attr5');
  });

  it('#parseTag & #parseAttr', function () {
    var html = parseTag('hi:<a href="#"target=_blank title="this is a link">link</a>', function (sourcePosition, position, tag, html, isClosing) {
      if (tag === 'a') {
        if (isClosing) return '</a>';
        var attrhtml = parseAttr(html.slice(2, -1), function (name, value) {
          if (name === 'href' || name === 'target') {
            return attr(name, value);
          }
        });
        return '<a ' + attrhtml + '>';
      } else {
        return escapeHtml(html);
      }
    }, escapeHtml);
    debug(html);
    assert.equal(html, 'hi:<a href="#" target="_blank">link</a>');
  });

});
