/**
 * 性能测试 validator模块
 */

var sanitize = require('validator').sanitize;
var fs = require('fs');


var html = fs.readFileSync(__dirname + '/file.html', 'utf8');


var timeStart = Date.now();
for (var i = 0; i < 100; i++) {
  var ret = sanitize(html).xss();
}
var timeEnd = Date.now();


//console.log(ret);
fs.writeFileSync(__dirname + '/result_validator.html', ret);

var spent = timeEnd - timeStart;
var speed = (((html.length * i) / spent * 1000) / 1024 / 1024).toFixed(2);
console.log('spent ' + spent + 'ms, ' + speed + 'MB/s');