/**
 * 测试XSS 自定义处理函数
 *
 * @author 老雷<leizongmin@gmail.com>
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
          assert.equal(options.sourcePosition, 2);
          assert.equal(options.isWhite, true);
        } else if (i === 2) {
          assert.equal(tag, 'b');
          assert.equal(html, '<b>');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 14);
          assert.equal(options.sourcePosition, 14);
          assert.equal(options.isWhite, true);
        } else if (i === 3) {
          assert.equal(tag, 'c');
          assert.equal(html, '<c>');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 17);
          assert.equal(options.sourcePosition, 17);
          assert.equal(options.isWhite, false);
        } else if (i === 4) {
          assert.equal(tag, 'c');
          assert.equal(html, '</c>');
          assert.equal(options.isClosing, true);
          assert.equal(options.position, 30);
          assert.equal(options.sourcePosition, 24);
          assert.equal(options.isWhite, false);
        } else if (i === 5) {
          assert.equal(tag, 'b');
          assert.equal(html, '</b>');
          assert.equal(options.isClosing, true);
          assert.equal(options.position, 40);
          assert.equal(options.sourcePosition, 28);
          assert.equal(options.isWhite, true);
        } else if (i === 6) {
          assert.equal(tag, 'a');
          assert.equal(html, '</a>');
          assert.equal(options.isClosing, true);
          assert.equal(options.position, 44);
          assert.equal(options.sourcePosition, 32);
          assert.equal(options.isWhite, true);
        } else if (i === 7) {
          assert.equal(tag, 'br');
          assert.equal(html, '<br>');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 48);
          assert.equal(options.sourcePosition, 36);
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

  it('#onIgnoreTag - match tag', function () {
    var source = 'dd<a href="#"><b><c>haha</c></b></a><br>ff';
    var i = 0;
    var html = xss(source, {
      onIgnoreTag: function (tag, html, options) {
        console.log(arguments);
        i++;
        if (i === 1) {
          assert.equal(tag, 'c');
          assert.equal(html, '<c>');
          assert.equal(options.isClosing, false);
          assert.equal(options.position, 17);
          assert.equal(options.sourcePosition, 17);
          assert.equal(options.isWhite, false);
        } else if (i === 2) {
          assert.equal(tag, 'c');
          assert.equal(html, '</c>');
          assert.equal(options.isClosing, true);
          assert.equal(options.position, 30);
          assert.equal(options.sourcePosition, 24);
          assert.equal(options.isWhite, false);
        } else {
          throw new Error();
        }
      }
    });
    console.log(html);
    assert.equal(html, 'dd<a href="#"><b>&lt;c&gt;haha&lt;/c&gt;</b></a><br>ff');
  });

  it('#onIgnoreTag - return new html', function () {
    var source = 'dd<a href="#"><b><c>haha</c></b></a><br>ff';
    var i = 0;
    var html = xss(source, {
      onIgnoreTag: function (tag, html, options) {
        console.log(html);
        return '[' + (options.isClosing ? '/' : '') + 'removed]';
      }
    });
    console.log(html);
    assert.equal(html, 'dd<a href="#"><b>[removed]haha[/removed]</b></a><br>ff');
  });

  it('#onTagAttr - match attr', function () {
    var source = '<a href="#" target="_blank" checked data-a="b">hi</a href="d">';
    var i = 0;
    var html = xss(source, {
      onTagAttr: function (tag, name, value, isWhiteAttr) {
        console.log(arguments);
        assert.equal(tag, 'a');
        i++;
        if (i === 1) {
          assert.equal(name, 'href');
          assert.equal(value, '#');
          assert.equal(isWhiteAttr, true);
        } else if (i === 2) {
          assert.equal(name, 'target');
          assert.equal(value, '_blank');
          assert.equal(isWhiteAttr, true);
        } else if (i === 3) {
          assert.equal(name, 'checked');
          assert.equal(value, '');
          assert.equal(isWhiteAttr, false);
        } else if (i === 4) {
          assert.equal(name, 'data-a');
          assert.equal(value, 'b');
          assert.equal(isWhiteAttr, false);
        } else {
          throw new Error();
        }
      }
    });
    console.log(html);
    assert.equal(html, '<a href="#" target="_blank">hi</a>');
  });

  it('#onTagAttr - match attr', function () {
    var source = '<a href="#" target="_blank" checked data-a="b">hi</a href="d">';
    var i = 0;
    var html = xss(source, {
      onTagAttr: function (tag, name, value, isWhiteAttr) {
        console.log(arguments);
        return '$' + name + '$';
      }
    });
    console.log(html);
    assert.equal(html, '<a $href$ $target$ $checked$ $data-a$>hi</a>');
  });

  it('#onIgnoreTagAttr - match attr', function () {
    var source = '<a href="#" target="_blank" checked data-a="b">hi</a href="d">';
    var i = 0;
    var html = xss(source, {
      onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        console.log(arguments);
        assert.equal(tag, 'a');
        i++;
        if (i === 1) {
          assert.equal(name, 'checked');
          assert.equal(value, '');
          assert.equal(isWhiteAttr, false);
        } else if (i === 2) {
          assert.equal(name, 'data-a');
          assert.equal(value, 'b');
          assert.equal(isWhiteAttr, false);
        } else {
          throw new Error();
        }
      }
    });
    console.log(html);
    assert.equal(html, '<a href="#" target="_blank">hi</a>');
  });

  it('#onIgnoreTagAttr - match attr', function () {
    var source = '<a href="#" target="_blank" checked data-a="b">hi</a href="d">';
    var i = 0;
    var html = xss(source, {
      onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        console.log(arguments);
        return '$' + name + '$';
      }
    });
    console.log(html);
    assert.equal(html, '<a href="#" target="_blank" $checked$ $data-a$>hi</a>');
  });

  it('#escapeHtml - default', function () {
    var source = '<x>yy</x><a>bb</a>';
    var html = xss(source);
    console.log(html);
    assert.equal(html, '&lt;x&gt;yy&lt;/x&gt;<a>bb</a>');
  });

  it('#escapeHtml - return new value', function () {
    var source = '<x>yy</x><a>bb</a>';
    var html = xss(source, {
      escapeHtml: function (str) {
        return (str ? '[' + str + ']' : str);
      }
    });
    console.log(html);
    assert.equal(html, '[<x>][yy][</x>]<a>[bb]</a>');
  });

  it('#safeAttrValue - default', function () {
    var source = '<a href="javascript:alert(/xss/)" title="hi">link</a>';
    var html = xss(source);
    console.log(html);
    assert.equal(html, '<a href title="hi">link</a>');
  });

  it('#safeAttrValue - return new value', function () {
    var source = '<a href="javascript:alert(/xss/)" title="hi">link</a>';
    var html = xss(source, {
      safeAttrValue: function (tag, name, value) {
        console.log(arguments);
        assert.equal(tag, 'a');
        return '$' + name + '$';
      }
    });
    console.log(html);
    assert.equal(html, '<a href="$href$" title="$title$">link</a>');
  });

  it('#stripIgnoreTag', function () {
    var source = '<x>yy</x><a>bb</a>';
    var html = xss(source, {
      stripIgnoreTag: true
    });
    console.log(html);
    assert.equal(html, 'yy<a>bb</a>');
  });

  it('#stripTagBody - true', function () {
    var source = '<a>link</a><x>haha</x><y>a<y></y>b</y>k';
    var html = xss(source, {
      stripIgnoreTagBody: true
    });
    console.log(html);
    assert.equal(html, '<a>link</a>bk');
  });

  it('#stripIgnoreTagBody - *', function () {
    var source = '<a>link</a><x>haha</x><y>a<y></y>b</y>k';
    var html = xss(source, {
      stripIgnoreTagBody: '*'
    });
    console.log(html);
    assert.equal(html, '<a>link</a>bk');
  });

  it('#stripIgnoreTagBody - [\'x\']', function () {
    var source = '<a>link</a><x>haha</x><y>a<y></y>b</y>k';
    var html = xss(source, {
      stripIgnoreTagBody: ['x']
    });
    console.log(html);
    assert.equal(html, '<a>link</a>&lt;y&gt;a&lt;y&gt;&lt;/y&gt;b&lt;/y&gt;k');
  });

  it('#stripIgnoreTagBody - [\'x\'] & onIgnoreTag', function () {
    var source = '<a>link</a><x>haha</x><y>a<y></y>b</y>k';
    var html = xss(source, {
      stripIgnoreTagBody: ['x'],
      onIgnoreTag: function (tag, html, options) {
        return '$' + tag + '$';
      }
    });
    console.log(html);
    assert.equal(html, '<a>link</a>$y$a$y$$y$b$y$k');
  });

  it('#stripIgnoreTag & stripIgnoreTagBody', function () {
    var source = '<scri' + 'pt>alert(/xss/);</scri' + 'pt>';
    var html = xss(source, {
      stripIgnoreTag:     true,
      stripIgnoreTagBody: ['script']
    });
    console.log(html);
    assert.equal(html, '');
  });

  it('#stripIgnoreTag & stripIgnoreTagBody - 2', function () {
    var source = 'ooxx<scri' + 'pt>alert(/xss/);</scri' + 'pt>';
    var html = xss(source, {
      stripIgnoreTag:     true,
      stripIgnoreTagBody: ['script']
    });
    console.log(html);
    assert.equal(html, 'ooxx');
  });

});