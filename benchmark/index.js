/**
 * 性能测试
 */

var xss = require('../');
var fs = require('fs');


// 读取样例
var html = fs.readFileSync(__dirname + '/file.html', 'utf8');
var COUNT = 200;
var ret = '';


var timeStart = Date.now();
for (var i = 0; i < COUNT; i++) {
  ret = xss(html);
}
var timeEnd = Date.now();
var spent = timeEnd - timeStart;
var speed = (((html.length * i) / spent * 1000) / 1024 / 1024).toFixed(2);
console.log('xss(): spent ' + spent + 'ms, ' + speed + 'MB/s');


var x = new xss.FilterXSS();
var timeStart = Date.now();
for (var i = 0; i < COUNT; i++) {
  ret = x.process(html);
}
var timeEnd = Date.now();
var spent = timeEnd - timeStart;
var speed = (((html.length * i) / spent * 1000) / 1024 / 1024).toFixed(2);
console.log('xss.process(): spent ' + spent + 'ms, ' + speed + 'MB/s');


var x = new xss.FilterXSS();
var process = x.process.bind(x);
var timeStart = Date.now();
for (var i = 0; i < COUNT; i++) {
  ret = process(html);
}
var timeEnd = Date.now();
var spent = timeEnd - timeStart;
var speed = (((html.length * i) / spent * 1000) / 1024 / 1024).toFixed(2);
console.log('xss.process() #2: spent ' + spent + 'ms, ' + speed + 'MB/s');


// 保存结果
//console.log(ret);
fs.writeFileSync(__dirname + '/result.html', ret);
