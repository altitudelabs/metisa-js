const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');

jsdoc2md.render({ files: 'src/**/*.js' }).then((output) => {
  fs.writeFile('./doc/API.md', output);
});
