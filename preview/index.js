var path = require('path');
var fs = require('fs');
var express = require('express');
var marked = require('marked');
var expressLiquid = require('express-liquid');
var serveStatic = require('serve-static');

var app = express();
app.use('/assets', serveStatic(path.resolve(__dirname, '../assets')));


var context = expressLiquid.newContext();
var options = {
  context: context,
  customTags: {},
  traceError: true
};
app.set('view engine', 'liquid');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('liquid', expressLiquid(options));
app.use(expressLiquid.middleware);


function loadPage (filename) {
  var data = fs.readFileSync(path.resolve(__dirname, '../sources', filename)).toString();
  var lines = data.split(/\n/);
  var title = lines[0].replace(/^#+/, '').trim();
  var content = marked(lines.slice(2).join('\n'));
  return {
    title: title,
    content: content
  };
}

function registerPage (path, filename) {
  if (path.slice(-1) !== '/') path = path + '.html';
  filename = filename + '.md';

  var page = loadPage(filename);
  console.log('register: %s (%s) \t %s', path, filename, page.title);

  app.get(path, function (req, res, next) {
    res.render('page', loadPage(filename));
  });
}

require('./pages')(registerPage);
app.get('/', function (req, res, next) {

});


var port = process.env.PORT || 3100;
app.listen(port);
console.log('Please open http://localhost:%s', port);
