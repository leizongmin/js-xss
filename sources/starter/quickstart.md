Quick Start
=====

## Filter out tags not in the whitelist

By using `stripIgnoreTag` parameter:

+ `true` filter out tags not in the whitelist
+ `false`: by default: escape the tag using configured `escape` function

Example:

If `stripIgnoreTag = true` is set, the following code:

```HTML
code:<script>alert(/xss/);</script>
```

would output filtered:

```HTML
code:alert(/xss/);
```

## Filter out tags and tag bodies not in the whitelist

By using `stripIgnoreTagBody` parameter:

+ `false|null|undefined` by default: do nothing
+ `'*'|true`: filter out all tags not in the whitelist
+ `['tag1', 'tag2']`: filter out only specified tags not in the whitelist

Example:

If `stripIgnoreTagBody = ['script']` is set, the following code:

```HTML
code:<script>alert(/xss/);</script>
```

would output filtered:

```HTML
code:
```

## Filter out HTML comments

By using `allowCommentTag` parameter:

+ `true`: do nothing
+ `false` by default: filter out HTML comments

Example:

If `allowCommentTag = false` is set, the following code:

```HTML
code:<!-- something --> END
```

would output filtered:

```HTML
code: END
```
