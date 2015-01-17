使用命令行工具来对文件进行XSS处理
======

可通过内置的 `xss` 命令来对输入的文件进行XSS处理。使用方法：

```bash
xss -i <源文件> -o <目标文件>
```

例：

```bash
$ xss -i origin.html -o target.html
```

详细命令行参数说明，请输入 `$ xss -h` 来查看。