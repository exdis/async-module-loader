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

You may set name for bundle (`name` query parameter). See [documentation](https://github.com/webpack/loader-utils#interpolatename).

``` javascript
require('async-module?name=my-chunk!./file.js')(..., ...);
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
