var path = require('path');
var fs = require('fs');
var marked = require('marked');
var expressLiquid = require('express-liquid');


exports.loadPage = function (filename) {
  var data = fs.readFileSync(path.resolve(__dirname, '../sources', filename)).toString();
  var lines = data.split(/\n/);
  var title = lines[0].replace(/^#+/, '').trim();
  var content = marked(lines.slice(2).join('\n'));
  return {
    title: title,
    content: content
  };
};

exports.loadHtml = function (filename) {
  var data = fs.readFileSync(path.resolve(__dirname, '../sources/html', filename)).toString();
  return data;
};

var context = expressLiquid.newContext();
var options = {
  context: context,
  customTags: {},
  traceError: true
};
var renderLiquid = expressLiquid(options);

context.setLocals('nav_list', require('../sources/nav'));

exports.context = context;
exports.renderLiquid = renderLiquid;
