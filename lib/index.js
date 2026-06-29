/**
 * xss
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

var DEFAULT = require("./default");
var parser = require("./parser");
var FilterXSS = require("./xss");

/**
 * filter xss function
 *
 * @param {String} html
 * @param {Object} options { whiteList, onTag, onTagAttr, onIgnoreTag, onIgnoreTagAttr, safeAttrValue, escapeHtml }
 * @return {String}
 */
function filterXSS(html, options) {
  var xss = new FilterXSS(options);
  return xss.process(html);
}

/**
 * Filter XSS and return both the sanitized HTML and a list of removed elements.
 * Addresses feature request: https://github.com/leizongmin/js-xss/issues/284
 *
 * @param {String} html    - dirty HTML string to sanitize
 * @param {Object} options - same options as filterXSS()
 * @return {Object} { html: String, removed: Array }
 *
 * Each item in `removed` is one of:
 *   { type: "tag",  tag: "script", html: "<script>",  isClosing: false }
 *   { type: "attr", tag: "a",      attr: "onclick",   value: "evil()" }
 */
function filterXSSWithResult(html, options) {
  var removed = [];

  // Copy options so we don't mutate the caller's object
  var opts = {};
  if (options) {
    for (var key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        opts[key] = options[key];
      }
    }
  }

  // Save any hooks the user may have already provided
  var originalOnIgnoreTag = opts.onIgnoreTag;
  var originalOnIgnoreTagAttr = opts.onIgnoreTagAttr;

  // Override onIgnoreTag to record removed tags
  opts.onIgnoreTag = function (tag, tagHtml, tagOptions) {
    removed.push({
      type: "tag",
      tag: tag,
      html: tagHtml,
      isClosing: !!(tagOptions && tagOptions.isClosing),
    });
    // Still call the user's original hook if they had one
    if (originalOnIgnoreTag) {
      return originalOnIgnoreTag(tag, tagHtml, tagOptions);
    }
  };

  // Override onIgnoreTagAttr to record removed attributes
  opts.onIgnoreTagAttr = function (tag, name, value, isWhiteAttr) {
    removed.push({
      type: "attr",
      tag: tag,
      attr: name,
      value: value,
    });
    // Still call the user's original hook if they had one
    if (originalOnIgnoreTagAttr) {
      return originalOnIgnoreTagAttr(tag, name, value, isWhiteAttr);
    }
  };

  var cleanHtml = filterXSS(html, opts);

  return {
    html: cleanHtml,
    removed: removed,
  };
}
exports = module.exports = filterXSS;
exports.filterXSS = filterXSS;
exports.filterXSSWithResult = filterXSSWithResult;
exports.FilterXSS = FilterXSS;

(function () {
  for (var i in DEFAULT) {
    if (Object.prototype.hasOwnProperty.call(DEFAULT, i)) {
      exports[i] = DEFAULT[i];
    }
  }
  for (var j in parser) {
    if (Object.prototype.hasOwnProperty.call(parser, j)) {
      exports[j] = parser[j];
    }
  }
})();

// using `xss` on the browser, output `filterXSS` to the globals
if (typeof window !== "undefined") {
  window.filterXSS = module.exports;
}

// using `xss` on the WebWorker, output `filterXSS` to the globals
function isWorkerEnv() {
  return (
    typeof self !== "undefined" &&
    typeof DedicatedWorkerGlobalScope !== "undefined" &&
    self instanceof DedicatedWorkerGlobalScope
  );
}
if (isWorkerEnv()) {
  self.filterXSS = module.exports;
}
