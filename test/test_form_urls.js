/**
 * 表单提交地址的协议过滤回归测试。
 */
var assert = require("assert");
var xss = require("../");

describe("form submission URLs", function () {
  var options = {
    whiteList: {
      form: ["action"],
      button: ["formaction"],
      input: ["type", "formaction"],
    },
  };
  var targets = [
    { tag: "form", attr: "action" },
    { tag: "button", attr: "formaction" },
    { tag: "input", attr: "formaction" },
  ];

  targets.forEach(function (target) {
    var prefix = "<" + target.tag + " " + target.attr;
    var suffix = "></" + target.tag + ">";

    [
      "javascript:void(0)",
      "JaVaScRiPt:void(0)",
      " \tjavascript:void(0)",
      "java\tscript:void(0)",
      "java\nscript:void(0)",
      "java\rscript:void(0)",
      "java\u0000script:void(0)",
      "&#106;avascript: void(0)",
      "&#x6a;avascript&#x3a;void(0)",
      "javascript&#58;void(0)",
      "javascript&colon;void(0)",
      "java&Tab;script: void(0)",
      "java&NewLine;script: void(0)",
      "vbscript:msgbox(1)",
      "data:text/html,test",
      "data:image/svg+xml,test",
      "mailto:recipient@example.com",
      "tel:123",
      "ftp://example.com",
      "custom:destination",
    ].forEach(function (value) {
      it("rejects " + JSON.stringify(value) + " in " + target.attr, function () {
        assert.strictEqual(
          xss(prefix + '="' + value + '"' + suffix, options),
          prefix + suffix
        );
      });
    });

    [
      "",
      "http://example.com/submit",
      "https://example.com/submit",
      "HTTPS://example.com/submit",
      "/submit",
      "//example.com/submit",
      "./submit",
      "../submit",
      "submit",
      "submit/result",
      "?next=javascript:example",
      "#javascript:example",
      "/path/javascript:example",
      "submit?next=javascript:example",
      "submit#javascript:example",
      "https://example.com/?next=javascript:example",
    ].forEach(function (value) {
      it("preserves " + JSON.stringify(value) + " in " + target.attr, function () {
        var expected = value ? prefix + '="' + value + '"' + suffix : prefix + suffix;
        assert.strictEqual(xss(prefix + '="' + value + '"' + suffix, options), expected);
      });
    });
  });

  it("blocks both form actions and submitter overrides in complete forms", function () {
    assert.strictEqual(
      xss('<form action="javascript:void(0)"><input type="submit"></form>', options),
      '<form action><input type="submit"></form>'
    );
    assert.strictEqual(
      xss('<form action="/submit"><button formaction="javascript:void(0)">Go</button></form>', options),
      '<form action="/submit"><button formaction>Go</button></form>'
    );
    assert.strictEqual(
      xss('<form action="/submit"><input type="submit" formaction="javascript:void(0)"></form>', options),
      '<form action="/submit"><input type="submit" formaction></form>'
    );
  });

  it("applies to allowList and mixed-case tag and attribute names", function () {
    assert.strictEqual(
      xss('<FORM ACTION="javascript:void(0)"></FORM>', {
        allowList: { FORM: ["ACTION"] },
      }),
      "<form action></form>"
    );
  });

  it("applies through the class, result API and exported safeAttrValue", function () {
    var html = '<form action="javascript:void(0)"></form>';
    assert.strictEqual(new xss.FilterXSS(options).process(html), "<form action></form>");
    assert.strictEqual(xss.filterXSSWithResult(html, options).html, "<form action></form>");
    assert.strictEqual(xss.safeAttrValue("form", "action", "javascript:void(0)"), "");
    assert.strictEqual(xss.safeAttrValue("button", "formaction", "data:image/png,test"), "");
  });

  it("decodes entities and escapes accepted destinations", function () {
    assert.strictEqual(
      xss('<form action="https&#58;//example.com/submit"></form>', options),
      '<form action="https://example.com/submit"></form>'
    );
    assert.strictEqual(
      xss('<form action="/submit?q=&quot;&lt;&gt;"></form>', options),
      '<form action="/submit?q=&quot;&lt;&gt;"></form>'
    );
  });

  it("keeps default form and href protections", function () {
    var html = '<form action="javascript:void(0)"></form>';
    assert.strictEqual(xss(html), '&lt;form action="javascript:void(0)"&gt;&lt;/form&gt;');
    assert.strictEqual(xss('<a href="javascript:void(0)">Go</a>'), "<a href>Go</a>");
    assert.strictEqual(xss('<img src="data:image/png,test">'), '<img src="data:image/png,test">');
    assert.strictEqual(xss('<p title="javascript:void(0)">Go</p>', {
      whiteList: { p: ["title"] },
    }), '<p title="javascript:void(0)">Go</p>');
  });
});
