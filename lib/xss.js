/**
 * filter xss
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

var FilterCSS = require("cssfilter").FilterCSS;
var DEFAULT = require("./default");
var parser = require("./parser");
var parseTag = parser.parseTag;
var parseAttr = parser.parseAttr;
var _ = require("./util");

/**
 * returns `true` if the input value is `undefined` or `null`
 *
 * @param {Object} obj
 * @return {Boolean}
 */
function isNull(obj) {
  return obj === undefined || obj === null;
}

/**
 * get attributes for a tag
 *
 * @param {String} html
 * @return {Object}
 *   - {String} html
 *   - {Boolean} closing
 */
function getAttrs(html) {
  var i = _.spaceIndex(html);
  if (i === -1) {
    return {
      html: "",
      closing: html[html.length - 2] === "/",
    };
  }
  html = _.trim(html.slice(i + 1, -1));
  var isClosing = html[html.length - 1] === "/";
  if (isClosing) html = _.trim(html.slice(0, -1));
  return {
    html: html,
    closing: isClosing,
  };
}

/**
 * shallow copy
 *
 * @param {Object} obj
 * @return {Object}
 */
function shallowCopyObject(obj) {
  var ret = {};
  for (var i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      ret[i] = obj[i];
    }
  }
  return ret;
}

function keysToLowerCase(obj) {
  var ret = {};
  for (var i in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, i)) {
      if (Array.isArray(obj[i])) {
        ret[i.toLowerCase()] = obj[i].map(function (item) {
          return item.toLowerCase();
        });
      } else {
        ret[i.toLowerCase()] = obj[i];
      }
    }
  }
  return ret;
}

/**
 * Use a caller-supplied function only when it is an own property.
 * `undefined` and other non-functions fall back to the default.
 * Do not read the option with ||: a missing own property would still
 * resolve to a polluted Object.prototype.
 *
 * @param {Object} options
 * @param {String} key
 * @param {Function} fallback
 * @return {Function}
 */
function ownFunction(options, key, fallback) {
  if (Object.prototype.hasOwnProperty.call(options, key) && typeof options[key] === 'function') {
    return options[key];
  }
  return fallback;
}

/**
 * Read an own option when the caller actually provided a value.
 * null and undefined mean "not set". An own object, including {}, is explicit.
 * Do not read the option with ||: a missing own property would still
 * resolve to a polluted Object.prototype.
 *
 * @param {Object} options
 * @param {String} key
 * @return {*}
 */
function ownProvided(options, key) {
  if (!Object.prototype.hasOwnProperty.call(options, key)) {
    return;
  }
  if (options[key] === undefined || options[key] === null) {
    return;
  }
  return options[key];
}

/**
 * FilterXSS class
 *
 * @param {Object} options
 *        whiteList (or allowList), onTag, onTagAttr, onIgnoreTag,
 *        onIgnoreTagAttr, safeAttrValue, escapeHtml
 *        stripIgnoreTagBody, allowCommentTag, stripBlankChar
 *        css{whiteList, onAttr, onIgnoreAttr} `css=false` means don't use `cssfilter`
 */
function FilterXSS(options) {
  options = shallowCopyObject(options || {});

  if (Object.prototype.hasOwnProperty.call(options, 'stripIgnoreTag') && options.stripIgnoreTag) {
    if (Object.prototype.hasOwnProperty.call(options, 'onIgnoreTag') && options.onIgnoreTag) {
      console.error(
        'Notes: cannot use these two options "stripIgnoreTag" and "onIgnoreTag" at the same time'
      );
    }
    options.onIgnoreTag = DEFAULT.onIgnoreTagStripAll;
  }
  var wl = ownProvided(options, 'whiteList');
  if (wl === undefined) {
    wl = ownProvided(options, 'allowList');
  }
  if (wl === undefined) {
    options.whiteList = DEFAULT.whiteList;
  } else {
    options.whiteList = keysToLowerCase(wl);
  }

  this.attributeWrapSign = Object.prototype.hasOwnProperty.call(options, 'singleQuotedAttributeValue') && options.singleQuotedAttributeValue === true ? "'" : DEFAULT.attributeWrapSign;

  options.onTag = ownFunction(options, 'onTag', DEFAULT.onTag);
  options.onTagAttr = ownFunction(options, 'onTagAttr', DEFAULT.onTagAttr);
  options.onIgnoreTag = ownFunction(options, 'onIgnoreTag', DEFAULT.onIgnoreTag);
  options.onIgnoreTagAttr = ownFunction(options, 'onIgnoreTagAttr', DEFAULT.onIgnoreTagAttr);
  options.safeAttrValue = ownFunction(options, 'safeAttrValue', DEFAULT.safeAttrValue);
  options.escapeHtml = ownFunction(options, 'escapeHtml', DEFAULT.escapeHtml);
  this.options = options;

  if (Object.prototype.hasOwnProperty.call(options, 'css') && options.css === false) {
    this.cssFilter = false;
  } else {
    options.css = Object.prototype.hasOwnProperty.call(options, 'css') ? options.css : {};
    this.cssFilter = new FilterCSS(options.css);
  }
}

/**
 * start process and returns result
 *
 * @param {String} html
 * @return {String}
 */
FilterXSS.prototype.process = function (html) {
  // compatible with the input
  html = html || "";
  html = html.toString();
  if (!html) return "";

  var me = this;
  var options = me.options;
  var whiteList = options.whiteList;
  var onTag = options.onTag;
  var onIgnoreTag = options.onIgnoreTag;
  var onTagAttr = options.onTagAttr;
  var onIgnoreTagAttr = options.onIgnoreTagAttr;
  var safeAttrValue = options.safeAttrValue;
  var escapeHtml = options.escapeHtml;
  var attributeWrapSign = me.attributeWrapSign;
  var cssFilter = me.cssFilter;

  // remove invisible characters
  if (options.stripBlankChar) {
    html = DEFAULT.stripBlankChar(html);
  }

  // remove html comments
  if (!options.allowCommentTag) {
    html = DEFAULT.stripCommentTag(html);
  }

  // if enable stripIgnoreTagBody
  var stripIgnoreTagBody = false;
  if (options.stripIgnoreTagBody) {
    stripIgnoreTagBody = DEFAULT.StripTagBody(
      options.stripIgnoreTagBody,
      onIgnoreTag
    );
    onIgnoreTag = stripIgnoreTagBody.onIgnoreTag;
  }

  var retHtml = parseTag(
    html,
    function (sourcePosition, position, tag, html, isClosing) {
      var info = {
        sourcePosition: sourcePosition,
        position: position,
        isClosing: isClosing,
        isWhite: Object.prototype.hasOwnProperty.call(whiteList, tag),
      };

      // call `onTag()`
      var ret = onTag(tag, html, info);
      if (!isNull(ret)) return ret;

      if (info.isWhite) {
        if (info.isClosing) {
          return "</" + tag + ">";
        }

        var attrs = getAttrs(html);
        var whiteAttrList = whiteList[tag];
        var attrsHtml = parseAttr(attrs.html, function (name, value) {
          // call `onTagAttr()`
          var isWhiteAttr = _.indexOf(whiteAttrList, name) !== -1;
          var ret = onTagAttr(tag, name, value, isWhiteAttr);
          if (!isNull(ret)) return ret;

          if (isWhiteAttr) {
            // call `safeAttrValue()`
            value = safeAttrValue(tag, name, value, cssFilter);
            if (value) {
              return name + '=' + attributeWrapSign + value + attributeWrapSign;
            } else {
              return name;
            }
          } else {
            // call `onIgnoreTagAttr()`
            ret = onIgnoreTagAttr(tag, name, value, isWhiteAttr);
            if (!isNull(ret)) return ret;
            return;
          }
        });

        // build new tag html
        html = "<" + tag;
        if (attrsHtml) html += " " + attrsHtml;
        if (attrs.closing) html += " /";
        html += ">";
        return html;
      } else {
        // call `onIgnoreTag()`
        ret = onIgnoreTag(tag, html, info);
        if (!isNull(ret)) return ret;
        return escapeHtml(html);
      }
    },
    escapeHtml
  );

  // if enable stripIgnoreTagBody
  if (stripIgnoreTagBody) {
    retHtml = stripIgnoreTagBody.remove(retHtml);
  }

  return retHtml;
};

module.exports = FilterXSS;
