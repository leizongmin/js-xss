/**
 * tests for filterXSSWithResult() function
 *
 * @author Joya Biswas <joyabiswas0103@gmail.com>
 */

var assert = require("assert");
var xss = require("../");

describe("filterXSSWithResult", function () {
  it("should record removed tags", function () {
    var result = xss.filterXSSWithResult(
      '<script>alert("xss");</script><p>Hello</p>'
    );

    assert.strictEqual(result.html, '&lt;script&gt;alert("xss");&lt;/script&gt;<p>Hello</p>');
    assert.strictEqual(result.removed.length, 2);
    assert.deepStrictEqual(result.removed[0], {
      type: "tag",
      tag: "script",
      html: "<script>",
      isClosing: false,
    });
    assert.deepStrictEqual(result.removed[1], {
      type: "tag",
      tag: "script",
      html: "</script>",
      isClosing: true,
    });
  });

  it("should record removed attributes", function () {
    var result = xss.filterXSSWithResult(
      '<a href="#" onclick="evil()">click</a>'
    );

    assert.strictEqual(result.html, '<a href="#">click</a>');
    assert.strictEqual(result.removed.length, 1);
    assert.deepStrictEqual(result.removed[0], {
      type: "attr",
      tag: "a",
      attr: "onclick",
      value: "evil()",
    });
  });

  it("should return empty removed array for clean HTML", function () {
    var result = xss.filterXSSWithResult("<p>This is safe</p>");

    assert.strictEqual(result.html, "<p>This is safe</p>");
    assert.strictEqual(result.removed.length, 0);
  });

  it("should record both dangerous tags and attributes", function () {
    var result = xss.filterXSSWithResult(
      '<script>bad()</script><a href="#" onclick="evil()">x</a>'
    );

    assert.strictEqual(result.removed.length, 3);
    assert.ok(
      result.removed.some(
        (item) => item.type === "tag" && item.tag === "script"
      ),
      "should have removed script tag"
    );
    assert.ok(
      result.removed.some(
        (item) => item.type === "attr" && item.attr === "onclick"
      ),
      "should have removed onclick attribute"
    );
  });

  it("should still call user's original onIgnoreTag hook", function () {
    var called = false;
    var originalTag = null;

    var result = xss.filterXSSWithResult('<script>test</script>', {
      onIgnoreTag: function (tag, html, options) {
        called = true;
        originalTag = tag;
      },
    });

    assert.strictEqual(called, true);
    assert.strictEqual(originalTag, "script");
  });

  it("should still call user's original onIgnoreTagAttr hook", function () {
    var called = false;
    var originalAttr = null;

    var result = xss.filterXSSWithResult('<a onclick="evil()">test</a>', {
      onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
        called = true;
        originalAttr = name;
      },
    });

    assert.strictEqual(called, true);
    assert.strictEqual(originalAttr, "onclick");
  });

  it("should not mutate the original options object", function () {
    var options = {
      onIgnoreTag: function () {},
      onIgnoreTagAttr: function () {},
    };
    var originalOptions = JSON.parse(JSON.stringify(options));

    xss.filterXSSWithResult("<script>test</script>", options);

    // Check that original hooks are preserved
    assert.deepStrictEqual(
      typeof options.onIgnoreTag,
      "function",
      "onIgnoreTag should still be a function"
    );
    assert.deepStrictEqual(
      typeof options.onIgnoreTagAttr,
      "function",
      "onIgnoreTagAttr should still be a function"
    );
  });
});
