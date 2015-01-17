jsxss.com
======

## 目录文件结构

+ __assets__ 静态资源文件目录，存放网站样式、图片、js库等
+ __preview__ 自动生成网站程序目录
+ __sources__ 网站内容源文件，里面的 __en__ 和 __zh__ 分别表示英文版和中文版的内容
+ __en__ 生成的英文版网站目录
+ __zh__ 生成的中文版网站目录
+ __index.html__ 网站首页，会自动根据浏览器的语言环境跳转到相应语言的目录，默认为 __en__
+ __package.json__ 程序依赖模块信息文件


## 开发环境

首次使用时需要执行以下命令安装相应的依赖模块：

```bash
$ npm install
```

在根目录下执行以下命令启动实时预览服务端：

```bash
$ node preview
```

打开 http://localhost:3100 即可预览网站，修改了 __assets__ 和 __sources__ 目录的内容后直接刷新网页即可看到修改过的效果。


## 内容及模板说明

### 模板

页面基本模板文件存储在 __previews/views__ 目录下，其中：

+ __html.liquid__ HTML页面模板文件
+ __page.liquid__ Markdown页面模板文件

模板引擎为 [TinyLiquid](https://github.com/leizongmin/tinyliquid)

### 内容

内容文件存储在 __sources/{lang}__ 目录下（__{lang}__表示对于的语言，比如__en__和__zh__），其中：

+ __config.js__ 网站配置信息，比如 `config.headline` 在模板中可以通过 `{{config.headline}}` 访问
+ __nav.js__ 网站导航栏
+ __index.html__ 网站首页
+ __try.html__ 在线测试页面
+ __*.md__ 对应的页面Markdown源文件


## 发布网站

在确认完成网站修改后，在根目录下执行以下命令自动生成网站的静态HTML文件：

```bash
$ node preview/build
```


## 参与开发

+ 执行 `$ node preview` 启动实时预览环境
+ 修改网站内容，直至完成
+ 执行 `$ node preview/build` 生产整站HTML
+ 提交 Pull Request

