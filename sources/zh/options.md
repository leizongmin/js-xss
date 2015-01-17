自定义配置
=====

### 白名单

通过 `whiteList` 来指定，格式为：`{'标签名': ['属性1', '属性2']}`。不在白名单上
的标签将被过滤，不在白名单上的属性也会被过滤。以下是示例：

```JavaScript
// 只允许a标签，该标签只允许href, title, target这三个属性
var options = {
  whiteList: {
    a: ['href', 'title', 'target']
  }
};
// 使用以上配置后，下面的HTML
// <a href="#" onclick="hello()"><i>大家好</i></a>
// 将被过滤为
// <a href="#">大家好</a>
```

默认白名单参考 `xss.whiteList`。

### 自定义匹配到标签时的处理方法

通过 `onTag` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onTag (tag, html, options) {
  // tag是当前的标签名称，比如<a>标签，则tag的值是'a'
  // html是该标签的HTML，比如<a>标签，则html的值是'<a>'
  // options是一些附加的信息，具体如下：
  //   isWhite    boolean类型，表示该标签是否在白名单上
  //   isClosing  boolean类型，表示该标签是否为闭合标签，比如</a>时为true
  //   position        integer类型，表示当前标签在输出的结果中的起始位置
  //   sourcePosition  integer类型，表示当前标签在原HTML中的起始位置
  // 如果返回一个字符串，则当前标签将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法：
  //   在白名单上：  通过onTagAttr来过滤属性，详见下文
  //   不在白名单上：通过onIgnoreTag指定，详见下文
}
```

### 自定义匹配到标签的属性时的处理方法

通过 `onTagAttr` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onTagAttr (tag, name, value, isWhiteAttr) {
  // tag是当前的标签名称，比如<a>标签，则tag的值是'a'
  // name是当前属性的名称，比如href="#"，则name的值是'href'
  // value是当前属性的值，比如href="#"，则value的值是'#'
  // isWhiteAttr是否为白名单上的属性
  // 如果返回一个字符串，则当前属性值将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法
  //   在白名单上：  调用safeAttrValue来过滤属性值，并输出该属性，详见下文
  //   不在白名单上：通过onIgnoreTagAttr指定，详见下文
}
```

### 自定义匹配到不在白名单上的标签时的处理方法

通过 `onIgnoreTag` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onIgnoreTag (tag, html, options) {
  // 参数说明与onTag相同
  // 如果返回一个字符串，则当前标签将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法（通过escape指定，详见下文）
}
```

### 自定义匹配到不在白名单上的属性时的处理方法

通过 `onIgnoreTagAttr` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function onIgnoreTagAttr (tag, name, value, isWhiteAttr) {
  // 参数说明与onTagAttr相同
  // 如果返回一个字符串，则当前属性值将被替换为该字符串
  // 如果不返回任何值，则使用默认的处理方法（删除该属）
}
```

### 自定义HTML转义函数

通过 `escapeHtml` 来指定相应的处理函数。以下是默认代码 **（不建议修改）** ：

```JavaScript
function escapeHtml (html) {
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

### 自定义标签属性值的转义函数

通过 `safeAttrValue` 来指定相应的处理函数。以下是详细说明：

```JavaScript
function safeAttrValue (tag, name, value) {
  // 参数说明与onTagAttr相同（没有options参数）
  // 返回一个字符串表示该属性值
}
```
