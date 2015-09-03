patch();

function patch() {
  var ensure = __webpack_require__.e;
  var head = document.querySelector('head');

  __webpack_require__.e = function(chunkId, callback) {
    var loaded = false;

    var handler = function(error) {
      if (loaded) return;
      loaded = true;

      callback(error);
    };

    ensure(chunkId, function() {
      handler();
    });

    onError(function() {
      if (loaded) return;
      loaded = true;

      if (__webpack_require__.s) {
        __webpack_require__.s[chunkId] = void 0;
      }

      handler(true);
    });
  };

  function onError(callback) {
    var script = head.lastChild;

    if (script.tagName !== 'SCRIPT') {
      // throw new Error('Script is not a script');
      console.warn('Script is not a script', script);
      return;
    }

    script.onload = script.onerror = function() {
      script.onload = script.onerror = null;
      callback();
    };
  };
};