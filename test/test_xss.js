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
    assert.equal(xss('<a href=abc("d")>'), '<a href="abc(&quote;d&quote;)">');
    assert.equal(xss('<a href=abc(\'d\')>'), '<a href="abc(\'d\')">');

    // 单个闭合标签
    assert.equal(xss('<img src="#"/>'), '<img src="#" />');
    assert.equal(xss('<img src="#" />'), '<img src="#" />');
    assert.equal(xss('<img src="#"//>'), '<img src="#">');

  });

  // 自定义白名单
  it('#white list', function () {

    // 过滤所有标签
    assert.equal(xss('<a href="xx">bb</a>', {whiteList: {}}), '&lt;a href="xx"&gt;bb&lt;/a&gt;');
    assert.equal(xss('<hr>', {whiteList: {}}), '&lt;hr&gt;');
    // 增加白名单标签及属性
    assert.equal(xss('<ooxx yy="ok" cc="no">uu</ooxx>', {whiteList: {ooxx: ['yy']}}), '<ooxx yy="ok">uu</ooxx>');

  });

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


  // XSS攻击测试：https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  it('#XSS_Filter_Evasion_Cheat_Sheet', function () {

    assert.equal(xss('></SCRIPT>">\'><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>'),
        '&gt;&lt;/SCRIPT&gt;"&gt;\'&gt;&lt;SCRIPT&gt;alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;');

    assert.equal(xss(';!--"<XSS>=&{()}'), ';!--"&lt;XSS&gt;=&{()}');

    assert.equal(xss('<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRIPT>'),
        '&lt;SCRIPT SRC=http://ha.ckers.org/xss.js&gt;&lt;/SCRIPT&gt;');

    assert.equal(xss('<IMG SRC="javascript:alert(\'XSS\');">'), '<img src="#">');

    assert.equal(xss('<IMG SRC=javascript:alert(\'XSS\')>'), '<img src="#">');

    assert.equal(xss('<IMG SRC=JaVaScRiPt:alert(\'XSS\')>'), '<img src="#">');

    assert.equal(xss('<IMG SRC=`javascript:alert("RSnake says, \'XSS\'")`>'), '<img src="#">');

    assert.equal(xss('<IMG """><SCRIPT>alert("XSS")</SCRIPT>">'), '<img>');

    assert.equal(xss('<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>'), '<img src="#">');

    assert.equal(xss('<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>'),
        '<img src="#">');

    //assert.equal(xss('<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>'),
    //    '<img src="F   M LEJN   ALN      !">');

    assert.equal(xss('<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>'),
        '<img src>');

    assert.equal(xss('<IMG SRC="jav ascript:alert(\'XSS\');">'), '<img src="#">');

    assert.equal(xss('<IMG SRC="jav&#x09;ascript:alert(\'XSS\');">'), '<img src="#">');

    assert.equal(xss('<IMG SRC="jav\nascript:alert(\'XSS\');">'), '<img src="#">');

    assert.equal(xss('<IMG SRC=java\0script:alert(\"XSS\")>'), '<img src="#">');

    assert.equal(xss('<IMG SRC=" &#14;  javascript:alert(\'XSS\');">'), '<img src="#">');

    assert.equal(xss('<SCRIPT/XSS SRC="http://ha.ckers.org/xss.js"></SCRIPT>'),
        '&lt;SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"&gt;&lt;/SCRIPT&gt;');

    assert.equal(xss('<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>'),
        '&lt;BODY onload!#$%&()*~+-_.,:;?@[/|]^`=alert(\"XSS\")&gt;');

    assert.equal(xss('<<SCRIPT>alert("XSS");//<</SCRIPT>'),
        '&lt;&lt;SCRIPT&gt;alert(\"XSS\");//&lt;&lt;/SCRIPT&gt;');

    assert.equal(xss('<SCRIPT SRC=http://ha.ckers.org/xss.js?< B >'),
        '&lt;SCRIPT SRC=http://ha.ckers.org/xss.js?&lt; B &gt;');

    assert.equal(xss('<SCRIPT SRC=//ha.ckers.org/.j'),
        '&lt;SCRIPT SRC=//ha.ckers.org/.j');

    assert.equal(xss('<IMG SRC="javascript:alert(\'XSS\')"'),
        '&lt;IMG SRC=\"javascript:alert(\'XSS\')"');

    assert.equal(xss('<iframe src=http://ha.ckers.org/scriptlet.html <'),
        '&lt;iframe src=http://ha.ckers.org/scriptlet.html &lt;');

    assert.equal(xss('<a style="url(\'javascript:alert(1)\')">', {whiteList: {a: ['style']}}), '<a style>');

    assert.equal(xss('<IMG SRC=\'vbscript:msgbox("XSS")\'>'), '<img src="#">');

    assert.equal(xss('<IMG SRC="livescript:[code]">'), '<img src="#">');

    assert.equal(xss('<IMG SRC="mocha:[code]">'), '<img src="#">');

    assert.equal(xss('<a href="javas/**/cript:alert(\'XSS\');">'), '<a href="#">');

    // 这个暂时不知道怎么处理
    //assert.equal(xss('¼script¾alert(¢XSS¢)¼/script¾'), '');

    assert.equal(xss('<!--[if gte IE 4]><SCRIPT>alert(\'XSS\');</SCRIPT><![endif]-->'),
        '&lt;!--[if gte IE 4]&gt;&lt;SCRIPT&gt;alert(\'XSS\');&lt;/SCRIPT&gt;&lt;![endif]--&gt;');

  });

});
