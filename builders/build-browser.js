const browserify = require('browserify');
const fs = require('fs');

const file = fs.createWriteStream('./dist/browser.js');
const ghPageFile = fs.createWriteStream('./gh-page/dist/browser.js');
file.on('data', function(d) { file.write(d); });

const pipe = browserify(['./src/browser.js'], { debug: process.NODE_ENV !== 'production' })
.bundle();

pipe.pipe(file);
pipe.pipe(ghPageFile);
