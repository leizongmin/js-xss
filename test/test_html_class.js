/**
 * tests for html parser
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

var assert = require("assert");
var parser = require("../lib/parser");
var parseTag = parser.parseTag;
var parseAttr = parser.parseAttr;
var debug = require("debug")("xss:test");

describe("test HTML parser", function () {

    function escapeHtml(html) {
        return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function attr(n, v) {
        if (v) {
            return n + '="' + v.replace(/"/g, "&quote;") + '"';
        } else {
            return n;
        }
    }

    it("parse span with double class", function () {
        var html = parseTag(
            'hi:<a href="#"target=_blank title="this is a link" alt  = hello   class   = "hello1 hello2">link</a>',
            function (sourcePosition, position, tag, html, isClosing) {
                if (tag === "a") {
                    if (isClosing) return "</a>";
                    var attrhtml = parseAttr(html.slice(2, -1), function (name, value) {
                        if (name === "href" || name === "target" || name === "alt" || name === "class") {
                            return attr(name, value);
                        }
                    });
                    return "<a " + attrhtml + ">";
                } else {
                    return escapeHtml(html);
                }
            },
            escapeHtml
        );
        debug(html);
        assert.equal(html, 'hi:<a href="#" target="_blank" alt="hello" class="hello1 hello2">link</a>');
    });
});
