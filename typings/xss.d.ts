/**
 * xss
 *
 * @author 老雷<leizongmin@gmail.com>
 */

declare namespace XSS {

  export interface IFilterXSSOptions {
    whiteList?: IWhiteList;
    onTag?: OnTagHandler;
    onTagAttr?: OnTagAttrHandler;
    onIgnoreTag?: OnTagHandler;
    onIgnoreTagAttr?: OnTagAttrHandler;
    safeAttrValue?: SafeAttrValueHandler;
    escapeHtml?: EscapeHandler;
    stripIgnoreTagBody?: boolean | string[];
    allowCommentTag?: boolean;
    stripBlankChar?: boolean;
    css?: {} | boolean;
  }

  export interface IWhiteList {
    a?: string[];
    abbr?: string[];
    address?: string[];
    area?: string[];
    article?: string[];
    aside?: string[];
    audio?: string[];
    b?: string[];
    bdi?: string[];
    bdo?: string[];
    big?: string[];
    blockquote?: string[];
    br?: string[];
    caption?: string[];
    center?: string[];
    cite?: string[];
    code?: string[];
    col?: string[];
    colgroup?: string[];
    dd?: string[];
    del?: string[];
    details?: string[];
    div?: string[];
    dl?: string[];
    dt?: string[];
    em?: string[];
    font?: string[];
    footer?: string[];
    h1?: string[];
    h2?: string[];
    h3?: string[];
    h4?: string[];
    h5?: string[];
    h6?: string[];
    header?: string[];
    hr?: string[];
    i?: string[];
    img?: string[];
    ins?: string[];
    li?: string[];
    mark?: string[];
    nav?: string[];
    ol?: string[];
    p?: string[];
    pre?: string[];
    s?: string[];
    section?: string[];
    small?: string[];
    span?: string[];
    sub?: string[];
    sup?: string[];
    strong?: string[];
    table?: string[];
    tbody?: string[];
    td?: string[];
    tfoot?: string[];
    th?: string[];
    thead?: string[];
    tr?: string[];
    tt?: string[];
    u?: string[];
    ul?: string[];
    video?: string[];
  }

  export type OnTagHandler = (tag: string, html: string, options: {}) => string | void;

  export type OnTagAttrHandler = (tag: string, name: string, value: string) => string | void;

  export type SafeAttrValueHandler = (tag: string, name: string, value: string, cssFilter: ICSSFilter) => string;

  export type EscapeHandler = (str: string) => string;

  export interface ICSSFilter {
    process(value: string): string;
  }
  
}

declare module 'xss' {

  function StripTagBody(tags: string[], next: () => void): {
    onIgnoreTag(tag: string, html: string, options: {
      position: number;
      isClosing: boolean;
    }): string;
    remove(html: string): string;
  };

  class FilterXSS {
    constructor(options?: XSS.IFilterXSSOptions);
    process(html: string): string;
  }

  interface filterXSS {
    (html: string, options?: XSS.IFilterXSSOptions): string;

    FilterXSS: typeof FilterXSS;
    parseTag(html: string, onTag: (sourcePosition: number, position: number, tag: string, html: string, isClosing: boolean) => string, escapeHtml: XSS.EscapeHandler): string;
    parseAttr(html: string, onAttr: (name: string, value: string) => string): string;
    whiteList: XSS.IWhiteList;
    getDefaultWhiteList(): XSS.IWhiteList;
    onTag: XSS.OnTagHandler;
    onIgnoreTag: XSS.OnTagHandler;
    onTagAttr: XSS.OnTagAttrHandler;
    onIgnoreTagAttr: XSS.OnTagAttrHandler;
    safeAttrValue: XSS.SafeAttrValueHandler;
    escapeHtml: XSS.EscapeHandler;
    escapeQuote: XSS.EscapeHandler;
    unescapeQuote: XSS.EscapeHandler;
    escapeHtmlEntities: XSS.EscapeHandler;
    escapeDangerHtml5Entities: XSS.EscapeHandler;
    clearNonPrintableCharacter: XSS.EscapeHandler;
    friendlyAttrValue: XSS.EscapeHandler;
    escapeAttrValue: XSS.EscapeHandler;
    onIgnoreTagStripAll(): string;
    StripTagBody: typeof StripTagBody;
    stripCommentTag: XSS.EscapeHandler;
    stripBlankChar: XSS.EscapeHandler;
    cssFilter: XSS.ICSSFilter;
    getDefaultCSSWhiteList(): XSS.ICSSFilter;
  }

  var xss: filterXSS;
  export = xss;

}
