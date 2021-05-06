/// <reference path="./xss.d.ts" />

/**
 * xss typings test
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

import * as xss from "xss";

const x = new xss.FilterXSS();

x.process("html");

const a = xss.StripTagBody([], () => {});
console.log(a.onIgnoreTag, a.remove);

console.log(xss.filterXSS("hello"));
console.log(
  xss.filterXSS("hello", {
    onTag(tag: string, html: string, options: {}): string {
      return html;
    },
    css: false,
  })
);

xss.filterXSS("hello");
xss.filterXSS("hello", {
  escapeHtml(str) {
    return str.trim();
  },
  stripBlankChar: true,
  onTag(tag, html, options) {
    return html;
  },
  onIgnoreTag(tag, html) {},
});

interface ICustomWhiteList extends XSS.IWhiteList {
  view?: string[];
}

const whiteList: ICustomWhiteList = xss.getDefaultWhiteList();
console.log(whiteList.abbr);
whiteList.view = ["class", "style", "id"];
console.log(whiteList);

filterXSS("hello");

const options: XSS.IFilterXSSOptions = {};
