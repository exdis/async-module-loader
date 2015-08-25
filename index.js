/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Arthur Stolyar <https://github.com/NekR>

  Based on Tobias Koppers @sokra bundle-loader
  https://github.com/webpack/bundle-loader
*/
var loaderUtils = require('loader-utils');
var path = require('path');

function asyncModule() {
  module.exports = function(callback, errback) {
    require.ensure([], function(error) {
      if (error) {
        errback();
      } else {
        callback(require(__module__))
      }
    });
  };
};

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  var chunkName = '';

  if (query.name) {
    var options = {
      context: query.context || this.options.context,
      regExp: query.regExp
    };

    chunkName = loaderUtils.interpolateName(this, query.name, options);
    chunkName = ', ' + JSON.stringify(chunkName);
  }

  // var context = loaderContext.context || (loaderContext.options && loaderContext.options.context);
  var requset = loaderUtils.stringifyRequest(this, '!!' + remainingRequest);

  if (query.autoName) {
    var namePart = requset.lastIndexOf('!');
    namePart = requset.slice(namePart + 1, requset.length - 1);
    namePart = namePart.replace(/\.[^\.]+?$/, '')
      .replace(/\./g, '').replace(/\//g, '.');

    if (namePart[0] === '.') {
      namePart = namePart.slice(1);
    }

    chunkName = ', ' + JSON.stringify(namePart);
  }

  var result = [
    'require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, 'patch.js')) + ')',
    'module.exports = function(callback, errback) {',
    '  require.ensure([], function(error) {',
    '    if (error) {',
    '      errback();',
    '    } else {',
    '      callback(require(' + requset + '))',
    '    }',
    '  }' + chunkName + ');',
    '};',
  ];

  return result.join('\n');
}