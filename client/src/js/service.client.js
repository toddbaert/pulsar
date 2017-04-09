var service = {
    socket: null,
    basic: {cpu: 0, memory: 0},
    messageCallbacks: [],
    test: function() {
        console.log('client services are running!');
    },
    getHost: function() {
        return window.location.host;
    },
    subscribe: function(doneCallback) {
        if (!this.socket) {
            console.log('creating new socket');
            this.socket = new WebSocket('ws://' + this.getHost() + '/monitor/basic');
            console.log('done creating new socket, setting onmessage ');
            this.socket.onmessage = function(event) {
                this.basic = JSON.parse(event.data);
                this.messageCallbacks.forEach(function(callback){
                  callback.call();
                });
            }.bind(this);
            this.socket.onopen = function() {
                console.log('socket opened, sending message');
                this.socket.send(JSON.stringify({
                    action: 'init'
                }));
                console.log('done sending');
                this.messageCallbacks.push(doneCallback);
            }.bind(this);
        }
        else {
          this.messageCallbacks.push(doneCallback);
        }
    }
};

module.exports = service;
