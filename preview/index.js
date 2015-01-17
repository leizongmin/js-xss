var path = require('path');
var fs = require('fs');
var express = require('express');
var expressLiquid = require('express-liquid');
var serveStatic = require('serve-static');
var utils = require('./utils');

var app = express();
app.use('/assets', serveStatic(path.resolve(__dirname, '../assets')));


app.set('view engine', 'liquid');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('liquid', utils.renderLiquid);
app.use(expressLiquid.middleware);


function _registerMarkdown (path, filename) {
  if (path.slice(-1) !== '/') path = path + '.html';
  filename = filename + '.md';

  var page = utils.loadPage(filename);
  console.log('register: %s (%s) \t %s', path, filename, page.title);

  app.get(path, function (req, res, next) {
    res.render('page', utils.merge(utils.loadPage(filename), {
      lang: utils.parseLangFromUrl(req.url)
    }));
  });
}

function registerMarkdown (path, filename) {
  utils.lang.forEach(function (lang) {
    _registerMarkdown('/' + lang + path, lang + '/' + filename);
  });
}

function _registerHtml (path, filename, title) {
  if (path.slice(-1) !== '/') path = path + '.html';
  filename = filename + '.html';

  app.get(path, function (req, res, next) {
    res.render('html', {
      title: title,
      html: utils.loadHtml(filename),
      lang: utils.parseLangFromUrl(req.url)
    });
  });
}

function registerHtml (path, filename, title) {
  utils.lang.forEach(function (lang) {
    _registerHtml('/' + lang + path, lang + '/' + filename, title);
  });
}

require('./pages')(registerMarkdown, registerHtml);


app.get('/', function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '../index.html'));
});
var port = process.env.PORT || 3100;
app.listen(port);
console.log('Please open http://localhost:%s', port);
