const browserify = require('browserify');
const fs = require('fs');

const file = fs.createWriteStream('./dist/metisa.js');
const ghPageFile = fs.createWriteStream('./gh-page/demo-movie-app/js/metisa.js');
file.on('data', function(d) { file.write(d); });

const pipe = browserify(['./src/browser.js'], { debug: process.NODE_ENV !== 'production' })
.bundle();

pipe.pipe(file);
pipe.pipe(ghPageFile);
