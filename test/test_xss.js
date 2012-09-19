/**
 * 测试XSS
 */

var assert = require('assert');
var xss = require('../');


describe('test XSS', function () {

  it('#normal', function () {

    // 过滤不在白名单的标签
    assert.equal(xss('<b>abcd</b>'), '<b>abcd</b>');
    assert.equal(xss('<o>abcd</o>'), '&lt;o&gt;abcd&lt;/o&gt;');
    assert.equal(xss('<b>abcd</o>'), '<b>abcd&lt;/o&gt;');
    assert.equal(xss('<b><o>abcd</b></o>'), '<b>&lt;o&gt;abcd</b>&lt;/o&gt;');
    assert.equal(xss('<hr>'), '<hr>');
    assert.equal(xss('<xss>'), '&lt;xss&gt;');
    assert.equal(xss('<xss o="x">'), '&lt;xss o="x"&gt;');
    assert.equal(xss('<a><b>c</b></a>'), '<a><b>c</b></a>');
    assert.equal(xss('<a><c>b</c></a>'), '<a>&lt;c&gt;b&lt;/c&gt;</a>');

    // 过滤不是标签的<>
    assert.equal(xss('<>>'), '&lt;&gt;&gt;');
    assert.equal(xss('<script>'), '&lt;script&gt;');
    assert.equal(xss('<<a>b>'), '&lt;<a>b&gt;');
    assert.equal(xss('<<<a>>b</a><x>'), '&lt;&lt;<a>&gt;b</a>&lt;x&gt;');

    // 过滤不再白名单中的属性
    assert.equal(xss('<a oo="1" xx="2" href="3">yy</a>'), '<a href="3">yy</a>');
    assert.equal(xss('<a href xx oo>pp</a>'), '<a href>pp</a>');
    assert.equal(xss('<a href "">pp</a>'), '<a href>pp</a>');
    assert.equal(xss('<a t="">'), '<a>');

    // 属性内的特殊字符
    assert.equal(xss('<a href="\'<<>>">'), '<a href="\'<<>>">');
    assert.equal(xss('<a href=""">'), '&lt;a href=\"\"\"&gt;');
    assert.equal(xss('<a h=href="oo">'), '<a>');
    assert.equal(xss('<a h= href="oo">'), '<a href="oo">');

    // 自动将属性值的单引号转为双引号
    assert.equal(xss('<a href=\'abcd\'>'), '<a href="abcd">');
    assert.equal(xss('<a href=\'"\'>'), '<a href="&quote;">');

    // 没有双引号括起来的属性值
    assert.equal(xss('<a href=home>'), '<a href="home">');
    assert.equal(xss('<a href=home class="b">'), '<a href="home" class="b">');

  });

  it('#white list', function () {

    // 过滤所有标签
    assert.equal(xss('<a href="xx">bb</a>', {}), '&lt;a href="xx"&gt;bb&lt;/a&gt;');
    assert.equal(xss('<hr>', {}), '&lt;hr&gt;');

    // 增加白名单标签及属性
    assert.equal(xss('<ooxx yy="ok" cc="no">uu</ooxx>', {ooxx: ['yy']}), '<ooxx yy="ok">uu</ooxx>');

  });

  it('#process attribute value', function () {

    // 过滤指定属性值
    assert.equal(xss('<a href="javascript:ooxx">abc</a>', function (tag, attr, value) {
      if (tag === 'a' && attr === 'href') {
        if (value.substr(0, '11') === 'javascript:') {
          return '#';
        }
      }
    }), '<a href="#">abc</a>');

  });

  // XSS攻击测试：https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  it('#XSS_Filter_Evasion_Cheat_Sheet', function () {

    assert.equal(xss('></SCRIPT>">\'><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>'),
        '&gt;&lt;/SCRIPT&gt;"&gt;\'&gt;&lt;SCRIPT&gt;alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;');

    assert.equal(xss(';!--"<XSS>=&{()}'), ';!--"&lt;XSS&gt;=&{()}');

    assert.equal(xss('<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>'),
        '&lt;SCRIPT SRC=http://ha.ckers.org/xss.js&gt;&lt;/SCRIPT&gt;');

    assert.equal(xss('<IMG SRC="javascript:alert(\'XSS\');">'), '<img src="#">');

    //assert.equal(xss('<IMG SRC=javascript:alert(\'XSS\')>'), '<img src="#">');

  });

});
