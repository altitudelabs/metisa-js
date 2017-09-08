const MetisaCore = require('./core');

class MetisaDom extends MetisaCore {
  constructor(opts) {
    super(opts);
    console.log('initialsed Metisa Dom with', this);
  }
}

module.exports = MetisaDom;
