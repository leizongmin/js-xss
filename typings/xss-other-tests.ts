/**
 * xss typings test
 *
 * @author Zongmin Lei<leizongmin@gmail.com>
 */

interface ICustomWhiteList extends XSS.IWhiteList {
  view?: string[];
}

const options: XSS.IFilterXSSOptions = {};
