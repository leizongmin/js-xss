命令行工具
=====

### 安装

执行以下命令安装全局的 `xss` 命令：

```bash
$ npm install xss -g
```

### 处理文件

可通过内置的 `xss` 命令来对输入的文件进行XSS处理。使用方法：

```bash
xss -i <源文件> -o <目标文件>
```

例：

```bash
$ xss -i origin.html -o target.html
```

### 在线测试

执行以下命令，可在命令行中输入HTML代码，并看到过滤后的代码：

```bash
$ xss -t
```

详细命令行参数说明，请输入 `$ xss -h` 来查看。
