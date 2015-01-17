var path = require('path');
var fs = require('fs');
var expressLiquid = require('express-liquid');
var mkdirp = require('mkdirp');
var utils = require('./utils');



var VIEWS_DIR = path.resolve(__dirname, 'views');


function render (tpl, data, callback) {
  var context = utils.newContext();
  data = data || {};
  Object.keys(data).forEach(function (k) {
    context.setLocals(k, data[k]);
  });
  utils.renderLiquid(tpl, {
    context: context,
    settings: {
      views: VIEWS_DIR
    }
  }, callback);
}


function _registerMarkdown (path, filename) {
  if (path.slice(-1) !== '/') path = path + '.html';
  filename = filename + '.md';

  var page = utils.loadPage(filename);
  console.log('register: %s (%s) \t %s', path, filename, page.title);

  render('page', utils.merge(utils.loadPage(filename), {
    lang: utils.parseLangFromUrl(path),
    url: path
  }), function (err, html) {
    if (err) throw err;
    saveFile(path, html);
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

  render('html', {
    title: title,
    html: utils.loadHtml(filename),
    lang: utils.parseLangFromUrl(path),
    url: path
  }, function (err, html) {
    if (err) throw err;
    saveFile(path, html);
  });
}

function registerHtml (path, filename, title) {
  utils.lang.forEach(function (lang) {
    _registerHtml('/' + lang + path, lang + '/' + filename, title);
  });
}

function saveFile (p, html) {
  if (p === '/') p = '/index.html';
  var filename = path.resolve(__dirname, '..', p.slice(1));
  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, html);
}

require('./pages')(registerMarkdown, registerHtml);

