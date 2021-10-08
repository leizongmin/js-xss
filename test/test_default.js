/**
 * tests for default options
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

var assert = require("assert");
var _default = require("../lib/default");
var debug = require("debug")("xss:test");

function xss(html, options) {
  debug(JSON.stringify(html));
  var ret = _xss(html, options);
  debug("\t" + JSON.stringify(ret));
  return ret;
}

describe("test default", function () {
  it("#stripCommentTag", function () {
    assert.equal(_default.stripCommentTag("<!-- hello -->"), "");
    assert.equal(_default.stripCommentTag("<!--hello-->"), "");
    assert.equal(_default.stripCommentTag("xx <!-- hello --> yy"), "xx  yy");
    assert.equal(_default.stripCommentTag("xx<!--hello-->yy"), "xxyy");
    assert.equal(
      _default.stripCommentTag("<!-- <!-- <!-- hello --> --> -->"),
      " --> -->"
    );
  });

  // it("#stripCommentTag benchmark", function () {
  //   for (var i = 1; i <= 50000; i++) {
  //     var time = Date.now();
  //     var attack_str = "" + "<!--".repeat(i * 10000) + "-";
  //     _default.stripCommentTag(attack_str);
  //     var time_cost = Date.now() - time;
  //     console.log(
  //       "attack_str.length: " + attack_str.length + ": " + time_cost + " ms"
  //     );
  //   }
  // });
});
