var express = require('express');
var pulsarServices = require('../services/monitor.service');
var router = express.Router();

router.use(function(req, res, next) {
    next();
});

router.get('/', function(req, res) {
    monitor.read().then(function(data) {
        res.send(data);
    });
});

router.get('/about', function(req, res) {
    res.send('about pulsar');
});

//TODO: we may want to get rid of the express-ws package and just create our own middleware for web sockets...
router.ws('/basic', function(ws, req) {
    var service = null;
    var interval = null;
    // incoming message
    ws.on('message', function(data) {
        data = JSON.parse(data);
        // init message
        if (data.action == 'init') {
            console.log('opened socket');

	    service = pulsarServices.getService();
  
            interval = setInterval(function() {
	      console.log('service.getRes: ');
	      console.log(service.getResources);
	      respond(service.getResources());
            }, 1000);
        }

        function respond(response){
          try {
              ws.send(JSON.stringify(response));
          } catch (e) {
              console.log('exception sending info for basic request' + e.toString());
              ws.close();
              clearInterval(interval);
              console.log('closed socket');
          }
        }
    });
});

module.exports = router;
