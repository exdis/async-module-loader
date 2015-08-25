# ``async-module`` loader for webpack

Based on https://github.com/webpack/bundle-loader with improvements of error handling

``npm install async-module-loader``

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

``async-module`` uses ``lazy`` always mode from ``bundle-loader``, this means that chunk loading starts only after returned function is called.

``` javascript
// async-module returns function which accepts 2 callback: for success and for fail
// Exports of the requested module are passed into success callback as a first argument
require('async-module!./file.js')(function onLoad(mod) {
  mod.doSomething();
}, function onError() {
  // error happened
});
```

### More on errors
By default `webpack` does not provides access to `installedChunks` object which stores loading callback for the chunks. If this object is not handled property, this may cause memory leaks and won't allow to _try_ to load module again since it will stuck in _pending_ state (see webpack/webpack#1380 for details). To fix this issue, you need to include `AsyncModulePlugin` which will export `installedChunks` to the `async-module-loader`. This is how you can do it:

```js
// webpack.config.js

var AsyncModulePlugin = require('async-module-loader/plugin');

module.exports = {
  // ...

  plugins: [
    // ... other plugins

    new AsyncModulePlugin()
  ]
  // ...
}
```

### Query parameters

* `name`: You may set name for bundle. See [documentation](https://github.com/webpack/loader-utils#interpolatename).
* `autoName`: Generates `name` based on requested module name. Particularly useful for dev environments to visualize in human readable way which chunks are loaded.


``` javascript
require('async-module?name=my-chunk!./file.js')(..., ...);
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
