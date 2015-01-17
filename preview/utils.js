var path = require('path');
var fs = require('fs');
var marked = require('marked');
var expressLiquid = require('express-liquid');


exports.lang = ['en', 'zh'];

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
  var data = fs.readFileSync(path.resolve(__dirname, '../sources', filename)).toString();
  return data;
};

var context = expressLiquid.newContext();
var options = {
  context: context,
  customTags: {},
  traceError: true
};
var renderLiquid = expressLiquid(options);

function requireFile (filename) {
  filename = path.resolve(filename);
  var exports = require(filename);
  delete require.cache[filename];
  return exports;
}

function contextLocalConfig (context) {
  var navList = {};
  var configList = {};
  exports.lang.forEach(function (lang) {
    navList[lang] = requireFile(path.resolve(__dirname, '../sources/' + lang + '/nav.js'));
    configList[lang] = requireFile(path.resolve(__dirname, '../sources/' + lang + '/config.js'));
  });
  context.setLocals('nav_list', navList);
  context.setLocals('config_list', configList);
}

exports.newContext = function (context) {
  context = context || expressLiquid.newContext();
  contextLocalConfig(context);
  return context;
};

context.setFilter('remove_url_lang', function (url) {
  return '/' + url.split('/').slice(2).join('/');
});

exports.context = context;
exports.renderLiquid = renderLiquid;

exports.parseLangFromUrl = function (url) {
  return url.split('/')[1];
};

exports.merge = function (a, b) {
  var c = {};
  for (var i in a) {
    c[i] = a[i];
  }
  for (var i in b) {
    c[i] = b[i];
  }
  return c;
};
