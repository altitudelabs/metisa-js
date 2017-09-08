module.exports = (function() {
  return {
    environment: typeof window === 'object' ? 'browser' : 'node',
  };
})();
