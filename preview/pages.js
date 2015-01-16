module.exports = function (register) {

  register('/starter/install', 'starter/install');
  register('/starter/quickstart', 'starter/quickstart');
  register('/starter/cli', 'starter/cli');
  register('/starter/faq', 'starter/faq');
  register('/starter/customize', 'starter/customize');

  register('/options', 'options');

  register('/examples/allow_attr_prefix', 'examples/allow_attr_prefix');
  register('/examples/allow_tag_prefix', 'examples/allow_tag_prefix');
  register('/examples/html_parser', 'examples/html_parser');
  register('/examples/no_tag', 'examples/no_tag');

};
