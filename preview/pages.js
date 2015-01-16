module.exports = function (registerMarkdown, registerHtml) {

  registerMarkdown('/starter/install', 'starter/install');
  registerMarkdown('/starter/quickstart', 'starter/quickstart');
  registerMarkdown('/starter/cli', 'starter/cli');
  registerMarkdown('/starter/faq', 'starter/faq');
  registerMarkdown('/starter/customize', 'starter/customize');

  registerMarkdown('/options', 'options');

  registerMarkdown('/examples/allow_attr_prefix', 'examples/allow_attr_prefix');
  registerMarkdown('/examples/allow_tag_prefix', 'examples/allow_tag_prefix');
  registerMarkdown('/examples/html_parser', 'examples/html_parser');
  registerMarkdown('/examples/no_tag', 'examples/no_tag');

  registerMarkdown('/resources/community', 'resources/community');
  registerMarkdown('/resources/reference', 'resources/reference');
  registerMarkdown('/resources/blogs', 'resources/blogs');
  registerMarkdown('/resources/applications', 'resources/applications');

  registerHtml('/', 'index', 'Welcome');
  registerHtml('/try', 'try', 'Try Online');

};
