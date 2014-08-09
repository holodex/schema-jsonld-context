var Path = require('path');
var Url = require('url');

module.exports = function normalizeId (id) {
  var url = Url.parse(id);
  var pathname = url.pathname;
  var extname = Path.extname(pathname);
  return Path.basename(pathname, extname);
}
