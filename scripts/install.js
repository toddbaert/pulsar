const fs = require('fs');
const browserify = require('browserify');
const exec = require('child_process').exec;
const path = require('path');

const publicDir = 'public';
const jsDir = 'js';
const rootDir = __dirname.split(path.sep).slice(0, __dirname.split(path.sep).length - 1).join(path.sep);

console.log('echo running browserify job, and compiling JSX...');
if (!fs.existsSync(rootDir + path.sep + publicDir)){
  fs.mkdirSync(rootDir + path.sep + publicDir);
  fs.mkdirSync(rootDir + path.sep + publicDir + path.sep + jsDir);
}
exec('browserify -t [ babelify --presets [ react ] ] client/src/js/pulsar.js -o public/js/bundle.js', function (error, stdout, stderr) {
  if (error !== null) {
    console.log('browserify error: ' + error);
  } else {
    console.log('done!');
  }
});
