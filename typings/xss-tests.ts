/**
 * xss typings test
 *
 * @author 老雷<leizongmin@gmail.com>
 */

import xss = require('xss');

const x = new xss.FilterXSS();

x.process('html');

const a = xss.StripTagBody([], () => {});
console.log(a.onIgnoreTag, a.remove);

console.log(xss('hello'));
console.log(xss('hello', {
  onTag(tag: string, html: string, options: {}): string {
    return html;
  },
  css: false,
}));


interface ICustomWhiteList extends XSS.IWhiteList {
  view?: string[];
}

const whiteList: ICustomWhiteList = xss.getDefaultWhiteList();
console.log(whiteList.abbr);
whiteList.view = [ 'class', 'style', 'id' ];
console.log(whiteList);

