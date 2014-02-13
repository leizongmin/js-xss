/**
 * 命令行测试工具
 *
 * @author 老雷<leizongmin@gmail.com>
 */

var xss = require('./');
var readline = require('readline');


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


console.log('Enter a blank line to do xss(), enter "@quit" to exit.\n');


rl.setPrompt('[1] ');
rl.prompt();

var html = [];
rl.on('line', function (line) {
  if (line === '@quit') return process.exit();
  if (line === '') {
    console.log('');
    console.log(xss(html.join('\r\n')));
    console.log('');
    html = [];
  } else {
    html.push(line);
  }
  rl.setPrompt('[' + (html.length + 1) + '] ');
  rl.prompt();
});
