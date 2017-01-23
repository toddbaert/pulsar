#Not using this anymore.

echo running browserify job, and compiling JSX...
mkdir -p public/js
browserify -t [ babelify --presets [ react ] ] client/src/js/pulsar.js -o public/js/bundle.js
echo done!
