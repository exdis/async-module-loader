patch();

function patch() {
  var ensure = __webpack_require__.e;
  var head = document.querySelector('head');
  var chunks = __webpack_require__.s;
  var failures;

  __webpack_require__.e = function(chunkId, callback) {
    var loaded = false;

    var handler = function(error) {
      callback(error);
    };

    if (!chunks && failures && failures[chunkId]) {
      handler(true);
      return;
    }

    ensure(chunkId, function() {
      if (loaded) return;
      loaded = true;

      handler();
    });

    // This is |true| if chunk is already loaded and does not need onError call.
    // This happens because in such case ensure() is performed in sync way
    if (loaded) {
      return;
    }

    onError(function() {
      if (loaded) return;
      loaded = true;

      if (chunks) {
        chunks[chunkId] = void 0;
      } else {
        failures || (failures = {});
        failures[chunkId] = true;
      }

      handler(true);
    });
  };

  function onError(callback) {
    var script = head.lastChild;

    if (script.tagName !== 'SCRIPT') {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Script is not a script', script);
      }

      return;
    }

    script.onload = script.onerror = function() {
      script.onload = script.onerror = null;
      callback();
    };
  };
};