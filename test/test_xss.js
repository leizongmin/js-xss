/**
 * 测试XSS
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var assert = require('assert');
var _xss = require('../');
var debug = require('debug')('xss:test');


function xss (html, options) {
  debug(JSON.stringify(html));
  var ret = _xss(html, options);
  debug('\t' + JSON.stringify(ret));
  return ret;
}


describe('test XSS', function () {

  it('#normal', function () {

    // 兼容各种奇葩输入
    assert.equal(xss(), '');
    assert.equal(xss(null), '');
    assert.equal(xss(123), '123');
    assert.equal(xss({a: 1111}), '[object Object]');

    // 清除不可见字符
    assert.equal(xss('a\u0000\u0001\u0002\u0003\r\n b'), 'a\u0000\u0001\u0002\u0003\r\n b');
    assert.equal(xss('a\u0000\u0001\u0002\u0003\r\n b', {stripBlankChar: true}), 'a\r\n b');

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
    assert.equal(xss('<scri' + 'pt>'), '&lt;script&gt;');
    assert.equal(xss('<<a>b>'), '&lt;<a>b&gt;');
    assert.equal(xss('<<<a>>b</a><x>'), '&lt;&lt;<a>&gt;b</a>&lt;x&gt;');

    // 过滤不在白名单中的属性
    assert.equal(xss('<a oo="1" xx="2" title="3">yy</a>'), '<a title="3">yy</a>');
    assert.equal(xss('<a title xx oo>pp</a>'), '<a title>pp</a>');
    assert.equal(xss('<a title "">pp</a>'), '<a title>pp</a>');
    assert.equal(xss('<a t="">'), '<a>');

    // 属性内的特殊字符
    assert.equal(xss('<a title="\'<<>>">'), '<a title="\'&lt;&lt;&gt;&gt;">');
    assert.equal(xss('<a title=""">'), '<a title>');
    assert.equal(xss('<a h=title="oo">'), '<a>');
    assert.equal(xss('<a h= title="oo">'), '<a>');
    assert.equal(xss('<a title="javascript&colonalert(/xss/)">'), '<a title="javascript:alert(/xss/)">');
    assert.equal(xss('<a title"hell aa="fdfd title="ok">hello</a>'), '<a>hello</a>');

    // 自动将属性值的单引号转为双引号
    assert.equal(xss('<a title=\'abcd\'>'), '<a title="abcd">');
    assert.equal(xss('<a title=\'"\'>'), '<a title="&quot;">');

    // 没有双引号括起来的属性值
    assert.equal(xss('<a title=home>'), '<a title="home">');
    assert.equal(xss('<a title=abc("d")>'), '<a title="abc(&quot;d&quot;)">');
    assert.equal(xss('<a title=abc(\'d\')>'), '<a title="abc(\'d\')">');

    // 单个闭合标签
    assert.equal(xss('<img src/>'), '<img src />');
    assert.equal(xss('<img src />'), '<img src />');
    assert.equal(xss('<img src//>'), '<img src />');
    assert.equal(xss('<br/>'), '<br />');
    assert.equal(xss('<br />'), '<br />');

    // 畸形属性格式
    assert.equal(xss('<a target = "_blank" title ="bbb">'), '<a target="_blank" title="bbb">');
    assert.equal(xss('<a target = "_blank" title =  title =  "bbb">'), '<a target="_blank" title="title">');
    assert.equal(xss('<img width = 100    height     =200 title="xxx">'),
                     '<img width="100" height="200" title="xxx">');
    assert.equal(xss('<img width = 100    height     =200 title=xxx>'),
                     '<img width="100" height="200" title="xxx">');
    assert.equal(xss('<img width = 100    height     =200 title= xxx>'),
                     '<img width="100" height="200" title="xxx">');
    assert.equal(xss('<img width = 100    height     =200 title= "xxx">'),
                     '<img width="100" height="200" title="xxx">');
    assert.equal(xss('<img width = 100    height     =200 title= \'xxx\'>'),
                     '<img width="100" height="200" title="xxx">');
    assert.equal(xss('<img width = 100    height     =200 title = \'xxx\'>'),
                     '<img width="100" height="200" title="xxx">');
    assert.equal(xss('<img width = 100    height     =200 title= "xxx" no=yes alt="yyy">'),
                     '<img width="100" height="200" title="xxx" alt="yyy">');
    assert.equal(xss('<img width = 100    height     =200 title= "xxx" no=yes alt="\'yyy\'">'),
                     '<img width="100" height="200" title="xxx" alt="\'yyy\'">');

  });

  // 自定义白名单
  it('#white list', function () {

    // 过滤所有标签
    assert.equal(xss('<a title="xx">bb</a>', {whiteList: {}}), '&lt;a title="xx"&gt;bb&lt;/a&gt;');
    assert.equal(xss('<hr>', {whiteList: {}}), '&lt;hr&gt;');
    // 增加白名单标签及属性
    assert.equal(xss('<ooxx yy="ok" cc="no">uu</ooxx>', {whiteList: {ooxx: ['yy']}}), '<ooxx yy="ok">uu</ooxx>');

  });

  // XSS攻击测试：https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  it('#XSS_Filter_Evasion_Cheat_Sheet', function () {

    assert.equal(xss('></SCRI' + 'PT>">\'><SCRI' + 'PT>alert(String.fromCharCode(88,83,83))</SCRI' + 'PT>'),
        '&gt;&lt;/SCRIPT&gt;"&gt;\'&gt;&lt;SCRIPT&gt;alert(String.fromCharCode(88,83,83))&lt;/SCRIPT&gt;');

    assert.equal(xss(';!--"<XSS>=&{()}'), ';!--"&lt;XSS&gt;=&{()}');

    assert.equal(xss('<SCRIPT SRC=http://ha.ckers.org/xss.js></SCRI' + 'PT>'),
        '&lt;SCRIPT SRC=http://ha.ckers.org/xss.js&gt;&lt;/SCRIPT&gt;');

    assert.equal(xss('<IMG SRC="javascript:alert(\'XSS\');">'), '<img src>');

    assert.equal(xss('<IMG SRC=javascript:alert(\'XSS\')>'), '<img src>');

    assert.equal(xss('<IMG SRC=JaVaScRiPt:alert(\'XSS\')>'), '<img src>');

    assert.equal(xss('<IMG SRC=`javascript:alert("RSnake says, \'XSS\'")`>'), '<img src>');

    assert.equal(xss('<IMG """><SCRI' + 'PT>alert("XSS")</SCRI' + 'PT>">'), '<img>&lt;SCRIPT&gt;alert("XSS")&lt;/SCRIPT&gt;"&gt;');

    assert.equal(xss('<IMG SRC=javascript:alert(String.fromCharCode(88,83,83))>'), '<img src>');

    assert.equal(xss('<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>'),
        '<img src>');

    assert.equal(xss('<IMG SRC=&#0000106&#0000097&#0000118&#0000097&#0000115&#0000099&#0000114&#0000105&#0000112&#0000116&#0000058&#0000097&#0000108&#0000101&#0000114&#0000116&#0000040&#0000039&#0000088&#0000083&#0000083&#0000039&#0000041>'),
        '<img src>');

    assert.equal(xss('<IMG SRC=&#x6A&#x61&#x76&#x61&#x73&#x63&#x72&#x69&#x70&#x74&#x3A&#x61&#x6C&#x65&#x72&#x74&#x28&#x27&#x58&#x53&#x53&#x27&#x29>'),
        '<img src>');

    assert.equal(xss('<IMG SRC="jav ascript:alert(\'XSS\');">'), '<img src>');

    assert.equal(xss('<IMG SRC="jav&#x09;ascript:alert(\'XSS\');">'), '<img src>');

    assert.equal(xss('<IMG SRC="jav\nascript:alert(\'XSS\');">'), '<img src>');

    assert.equal(xss('<IMG SRC=java\0script:alert(\"XSS\")>'), '<img src>');

    assert.equal(xss('<IMG SRC=" &#14;  javascript:alert(\'XSS\');">'), '<img src>');

    assert.equal(xss('<SCRIPT/XSS SRC="http://ha.ckers.org/xss.js"></SCRI' + 'PT>'),
        '&lt;SCRIPT/XSS SRC=\"http://ha.ckers.org/xss.js\"&gt;&lt;/SCRIPT&gt;');

    assert.equal(xss('<BODY onload!#$%&()*~+-_.,:;?@[/|\]^`=alert("XSS")>'),
        '&lt;BODY onload!#$%&()*~+-_.,:;?@[/|]^`=alert(\"XSS\")&gt;');

    assert.equal(xss('<<SCRI' + 'PT>alert("XSS");//<</SCRI' + 'PT>'),
        '&lt;&lt;SCRIPT&gt;alert(\"XSS\");//&lt;&lt;/SCRIPT&gt;');

    assert.equal(xss('<SCRIPT SRC=http://ha.ckers.org/xss.js?< B >'),
        '&lt;SCRIPT SRC=http://ha.ckers.org/xss.js?&lt; B &gt;');

    assert.equal(xss('<SCRIPT SRC=//ha.ckers.org/.j'),
        '&lt;SCRIPT SRC=//ha.ckers.org/.j');

    assert.equal(xss('<IMG SRC="javascript:alert(\'XSS\')"'),
        '&lt;IMG SRC=\"javascript:alert(\'XSS\')"');

    assert.equal(xss('<iframe src=http://ha.ckers.org/scriptlet.html <'),
        '&lt;iframe src=http://ha.ckers.org/scriptlet.html &lt;');

    // 过滤 javascript:
    assert.equal(xss('<a style="url(\'javascript:alert(1)\')">', {whiteList: {a: ['style']}}), '<a style>');
    assert.equal(xss('<td background="url(\'javascript:alert(1)\')">', {whiteList: {td: ['background']}}), '<td background>');

    // 过滤 style
    assert.equal(xss('<DIV STYLE="width: \nexpression(alert(1));">', {whiteList: {div: ['style']}}), '<div style>');
    // 不正常的url
    assert.equal(xss('<DIV STYLE="background:\n url (javascript:ooxx);">', {whiteList: {div: ['style']}}), '<div style>');
    assert.equal(xss('<DIV STYLE="background:url (javascript:ooxx);">', {whiteList: {div: ['style']}}), '<div style>');
    // 正常的url
    assert.equal(xss('<DIV STYLE="background: url (ooxx);">', {whiteList: {div: ['style']}}), '<div style="background:url (ooxx);">');

    assert.equal(xss('<IMG SRC=\'vbscript:msgbox("XSS")\'>'), '<img src>');

    assert.equal(xss('<IMG SRC="livescript:[code]">'), '<img src>');

    assert.equal(xss('<IMG SRC="mocha:[code]">'), '<img src>');

    assert.equal(xss('<a href="javas/**/cript:alert(\'XSS\');">'), '<a href>');

    assert.equal(xss('<a href="javascript">'), '<a href>');
    assert.equal(xss('<a href="/javascript/a">'), '<a href="/javascript/a">');
    assert.equal(xss('<a href="/javascript/a">'), '<a href="/javascript/a">');
    assert.equal(xss('<a href="http://aa.com">'), '<a href="http://aa.com">');
    assert.equal(xss('<a href="https://aa.com">'), '<a href="https://aa.com">');
    assert.equal(xss('<a href="mailto:me@ucdok.com">'), '<a href="mailto:me@ucdok.com">');
    assert.equal(xss('<a href="#hello">'), '<a href="#hello">');
    assert.equal(xss('<a href="other">'), '<a href>');

    // 这个暂时不知道怎么处理
    //assert.equal(xss('¼script¾alert(¢XSS¢)¼/script¾'), '');

    assert.equal(xss('<!--[if gte IE 4]><SCRI' + 'PT>alert(\'XSS\');</SCRI' + 'PT><![endif]--> END', {allowCommentTag: true}),
        '&lt;!--[if gte IE 4]&gt;&lt;SCRIPT&gt;alert(\'XSS\');&lt;/SCRIPT&gt;&lt;![endif]--&gt; END');
    assert.equal(xss('<!--[if gte IE 4]><SCRI' + 'PT>alert(\'XSS\');</SCRI' + 'PT><![endif]--> END'), ' END');

    // HTML5新增实体编码 冒号&colon; 换行&NewLine;
    assert.equal(xss('<a href="javascript&colon;alert(/xss/)">'), '<a href>');
    assert.equal(xss('<a href="javascript&colonalert(/xss/)">'), '<a href>');
    assert.equal(xss('<a href="a&NewLine;b">'), '<a href>');
    assert.equal(xss('<a href="a&NewLineb">'), '<a href>');
    assert.equal(xss('<a href="javasc&NewLine;ript&colon;alert(1)">'), '<a href>');

    // data URI 协议过滤
    assert.equal(xss('<a href="data:">'), '<a href>');
    assert.equal(xss('<a href="d a t a : ">'), '<a href>');
    assert.equal(xss('<a href="data: html/text;">'), '<a href>');
    assert.equal(xss('<a href="data:html/text;">'), '<a href>');
    assert.equal(xss('<a href="data:html /text;">'), '<a href>');
    assert.equal(xss('<a href="data: image/text;">'), '<a href>');
    assert.equal(xss('<img src="data: aaa/text;">'), '<img src>');
    assert.equal(xss('<img src="data:image/png; base64; ofdkofiodiofl">'), '<img src>');

    // HTML备注处理
    assert.equal(xss('<!--                               -->', {allowCommentTag: false}), '');
    assert.equal(xss('<!--      a           -->', {allowCommentTag: false}), '');
    assert.equal(xss('<!--sa       -->ss', {allowCommentTag: false}), 'ss');
    assert.equal(xss('<!--                               ', {allowCommentTag: false}), '&lt;!--                               ');

  });

});
