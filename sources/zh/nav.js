module.exports = [
  {title: '首页', url: '/index.html'},
  {title: '开始使用', list: [
    {title: '安装与使用', url: '/starter/quickstart.html'},
    {title: '自定义过滤规则', url: '/options.html'},
    {title: '命令行工具', url: '/starter/cli.html'},
    /*{title: '常见问题', url: '/starter/faq.html'}*/
  ]},
  {title: '应用示例', list: [
    {title: '允许标签以data-开头的属性', url: '/examples/allow_attr_prefix.html'},
    {title: '允许名称以x-开头的标签', url: '/examples/allow_tag_prefix.html'},
    {title: '分析HTML代码中的图片列表', url: '/examples/html_parser.html'},
    {title: '去除HTML标签（只保留文本内容）', url: '/examples/no_tag.html'}
  ]},
  {title: '在线测试', url: '/try.html'},
  {title: '资源', list: [
    {title: '社区', url: '/resources/community.html'},
    {title: '参考', url: '/resources/reference.html'},
    {title: '博客文章', url: '/resources/blogs.html'},
    {title: '谁在使用XSS模块', url: '/resources/applications.html'}
  ]},
  {title: 'English', change_lang: 'en'}
];
