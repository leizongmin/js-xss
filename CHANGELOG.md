# CHANGELOG

## v1.0.13 (2022-06-07)

- [revert: fix: comment has encoded](https://github.com/leizongmin/js-xss/pull/257)

## v1.0.12 (2022-06-04)

- [feat: add eslint:recommended check](https://github.com/leizongmin/js-xss/pull/252) by @lumburr
- [fix: comment has encoded](https://github.com/leizongmin/js-xss/pull/257) by @lumburr
- [fix: whitelist match failure due to case ignoring](https://github.com/leizongmin/js-xss/pull/256) by @lumburr
- [fix: class is wrong separated by attributes in method onTagAttr](https://github.com/leizongmin/js-xss/pull/253) by @lumburr

## v1.0.11 (2022-03-06)

- [feat: add support for allowList as an alias for whiteList](https://github.com/leizongmin/js-xss/pull/249) by @schu34

## v1.0.10 (2021-10-08)

- [Fix: #239 stripCommentTag DoS attack](https://github.com/leizongmin/js-xss/pull/239)

## v1.0.9 (2021-05-06)

- [Fix whitespace bypass #218](https://github.com/leizongmin/js-xss/pull/218/files) by @TomAnthony
- [Add `<summary>` to default whitelist #216](https://github.com/leizongmin/js-xss/pull/216) by @spacegaier
- [Add `<figure>` and `<figcaption>` to default whitelist](https://github.com/leizongmin/js-xss/pull/220) by @daraz999
- Add `<audio crossorigin muted>`, `<video crossorigin muted playsinline poster>` to default whitelist
- Add `<strike>` to default whitelist
- Fix: typings IWhiteList allow any tag name
- Fix: typings `onTag` options

## v1.0.8 (2020-07-27)

- [Allow default imports in TS #200](https://github.com/leizongmin/js-xss/pull/200) by @danvk
- [Update handling of quoteStart to prevent sanitization bypass #201](https://github.com/leizongmin/js-xss/pull/201) by @TomAnthony

## v1.0.7 (2020-06-08)

- [added support for src embedded image, ftp and relative urls](https://github.com/leizongmin/js-xss/pull/189) by @sijanec
