/**
 * 性能测试
 */

var xss = require('../');
var fs = require('fs');


var html = fs.readFileSync(__dirname + '/file.html', 'utf8');


var timeStart = Date.now();
for (var i = 0; i < 1000; i++) {
  var ret = xss(html);
}
var timeEnd = Date.now();


//console.log(ret);
fs.writeFileSync(__dirname + '/result.html', ret);

var spent = timeEnd - timeStart;
var speed = (((html.length * i) / spent * 1000) / 1024 / 1024).toFixed(2);
console.log('spent ' + spent + 'ms, ' + speed + 'MB/s');