const fs = require('fs');
const browserify = require('browserify');
const exec = require('child_process').exec;
const jsDir = 'public/js';

console.log('echo running browserify job, and compiling JSX...');
if (!fs.existsSync(jsDir)){
  fs.mkdirSync(jsDir);
}
exec('browserify -t [ babelify --presets [ react ] ] client/src/js/pulsar.js -o public/js/bundle.js', function (error, stdout, stderr) {
  if (error !== null) {
    console.log('browserify error: ' + error);
  } else {
    console.log('done!');
  }
});
