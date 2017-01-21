mkdir public\js
browserify -t [ babelify --presets [ react ] ] client/src/js/pulsar.js -o public/js/bundle.js
