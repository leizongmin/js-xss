var path = require('path');
var fs = require('fs');
var express = require('express');
var expressLiquid = require('express-liquid');
var serveStatic = require('serve-static');
var utils = require('./utils');

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


function registerMarkdown (path, filename) {
  if (path.slice(-1) !== '/') path = path + '.html';
  filename = filename + '.md';

  var page = utils.loadPage(filename);
  console.log('register: %s (%s) \t %s', path, filename, page.title);

  app.get(path, function (req, res, next) {
    res.render('page', utils.loadPage(filename));
  });
}

function registerHtml (path, filename, title) {
  if (path.slice(-1) !== '/') path = path + '.html';
  filename = filename + '.html';

  app.get(path, function (req, res, next) {
    res.render('html', {
      title: title,
      html: utils.loadHtml(filename)
    });
  });
}

require('./pages')(registerMarkdown, registerHtml);


var port = process.env.PORT || 3100;
app.listen(port);
console.log('Please open http://localhost:%s', port);
