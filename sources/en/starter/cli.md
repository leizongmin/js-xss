Command Line Tool
======

### Installing

Run the following command to install `xss` command:

```bash
$ npm install xss -g
```

### Process File

You can use the xss command line tool to process a file. Usage:

```bash
xss -i <input_file> -o <output_file>
```

Example:

```bash
$ xss -i origin.html -o target.html
```

You can also specify a config file `-c config.json` like this:

```json
{
  "whiteList": {
    "p": ["id", "style"]
  },
  "css": {
    "whiteList": {
      "p": {
        "top": true,
        "left": true,
        "width": true,
        "height": true
      }
    }
  },
  "stripIgnoreTag": true,
  "stripIgnoreTagBody": true
}
```

### Active Test

Run the following command, them you can type HTML
code in the command-line, and check the filtered output:

```bash
$ xss -t
```

For more details, please run `$ xss -h` to see it.
