var path = require('path');
var fs = require('fs');
var marked = require('marked');
var expressLiquid = require('express-liquid');
var mkdirp = require('mkdirp');


var context = expressLiquid.newContext();
var options = {
  context: context,
  customTags: {},
  traceError: true
};
var VIEWS_DIR = path.resolve(__dirname, 'views');
var renderLiquid = expressLiquid(options);


function render (tpl, data, callback) {
  var context = expressLiquid.newContext();
  data = data || {};
  Object.keys(data).forEach(function (k) {
    context.setLocals(k, data[k]);
  });
  renderLiquid(tpl, {
    context: context,
    settings: {
      views: VIEWS_DIR
    }
  }, callback);
}

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

function registerMarkdown (path, filename) {
  if (path.slice(-1) !== '/') path = path + '.html';
  filename = filename + '.md';

  var page = loadPage(filename);
  console.log('register: %s (%s) \t %s', path, filename, page.title);

  render('page', loadPage(filename), function (err, html) {
    if (err) throw err;
    saveFile(path, html);
  });
}

function registerHtml (path, filename, title) {
  if (path.slice(-1) !== '/') path = path + '.html';

  render(filename, {title: title}, function (err, html) {
    if (err) throw err;
    saveFile(path, html);
  });
}

function saveFile (p, html) {
  if (p === '/') p = '/index.html';
  var filename = path.resolve(__dirname, '..', p.slice(1));
  mkdirp.sync(path.dirname(filename));
  fs.writeFileSync(filename, html);
}

require('./pages')(registerMarkdown, registerHtml);

