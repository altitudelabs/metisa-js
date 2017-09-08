const browserify = require('browserify');
const fs = require('fs');

const file = fs.createWriteStream('./dist/browser.js');
file.on('data', function(d) { file.write(d); });

browserify(['./src/browser.js'])
.bundle()
.pipe(file);
