module.exports = (function() {
  return {
    environment: typeof window === 'object' ? 'browser' : 'node',
    compose: function(original) {
      return function() {
        const compositions = Array.prototype.slice.call(arguments);
        var composed = original;
        for (var i = 0; i < compositions.length; i++) {
          composed = compositions[i](composed);
        }
        return composed;
      }
    }
  };
})();
