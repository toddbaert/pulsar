(function() {
    var ReactDOM = require('react-dom');
    var React = require('react');
    var service = require('./service.client.js');

    var Dashboard = React.createClass({
      render: function(){
        return (<div>
          <MemoryGraph/>
          <CpuGraph/>
          </div>);
      }
    });

    var CpuGraph = React.createClass({
        getInitialState: function() {
            return {
              data: 0
            };
        },
        componentDidMount: function() {
            var interval = null;
            clearInterval(interval);
            service.subscribe(function(){
              clearInterval(interval);
              var delta = service.basic.cpu - this.state.data;
              var inc = 0;
              interval = setInterval(function(){
                this.setState({data: parseFloat(this.state.data + delta / (Math.abs(delta) || 1))});
              }.bind(this), 1000 / (Math.abs(delta) || 1));
            }.bind(this));
        },
        render: function() {
            return (
              <div>
                <div style={{display: "inline-block"}} >
                  <svg width="400" height="60" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <rect width="400" height="60" style={{fill: "transparent", stroke: "grey"}}/>
                        <line x1="0" y1="30" x2="400" y2="30" strokeWidth=".5" stroke="grey"/>
                        <line x1="67" y1="0" x2="67" y2="60" strokeWidth=".5" stroke="grey"/>
                        <line x1="133" y1="0" x2="133" y2="60" strokeWidth=".5" stroke="grey"/>
                        <line x1="200" y1="0" x2="200" y2="60" strokeWidth=".5" stroke="grey"/>
                        <line x1="267" y1="0" x2="267" y2="60" strokeWidth=".5" stroke="grey"/>
                        <line x1="333" y1="0" x2="333" y2="60" strokeWidth=".5" stroke="grey"/>
                        <line x1="400" y1="0" x2="400" y2="60" strokeWidth=".5" stroke="grey"/>
                    </g>
                </svg>
                </div>
                <div style={{display: "inline-block"}}>
                  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <rect height={this.state.data} width={20} x="40" y={100 - this.state.data} ></rect>
                    </g>
                  </svg>
                </div>
              </div>
            )
        }
    });

    var MemoryGraph = React.createClass({
        getInitialState: function() {
            return {
              data: 0
            };
        },
        componentDidMount: function() {
            var interval = null;
            clearInterval(interval);
            service.subscribe(function(){
              clearInterval(interval);
              var delta = service.basic.memory - this.state.data;
              var inc = 0;
              interval = setInterval(function(){
                this.setState({data: parseFloat(this.state.data + delta / (Math.abs(delta) || 1))});
              }.bind(this), 1000 / (Math.abs(delta) || 1));
            }.bind(this));
        },
        render: function() {
            var coords = getCoords(this.state.data, 45);
            return (
              <div>
              <div style={{display: "inline-block"}} >
                  <svg width="400" height="60" xmlns="http://www.w3.org/2000/svg">
                      <g>
                          <rect width="400" height="60" style={{fill: "transparent", stroke: "grey"}}/>
                          <line x1="0" y1="30" x2="400" y2="30" strokeWidth=".5" stroke="grey"/>
                          <line x1="67" y1="0" x2="67" y2="60" strokeWidth=".5" stroke="grey"/>
                          <line x1="133" y1="0" x2="133" y2="60" strokeWidth=".5" stroke="grey"/>
                          <line x1="200" y1="0" x2="200" y2="60" strokeWidth=".5" stroke="grey"/>
                          <line x1="267" y1="0" x2="267" y2="60" strokeWidth=".5" stroke="grey"/>
                          <line x1="333" y1="0" x2="333" y2="60" strokeWidth=".5" stroke="grey"/>
                          <line x1="400" y1="0" x2="400" y2="60" strokeWidth=".5" stroke="grey"/>
                      </g>
                    </svg>
                </div>
                <div style={{display: "inline-block"}}>
                  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d={"M 45 0 " + "A 45 45, 0, " + Math.abs(Math.floor((this.state.data - 1) / 50)) + ", 0, " + coords.x + " " + coords.y + " " + "L 45 45 Z"} fill={"black"}></path>
                      <circle cx="45" cy="45" r="25" fill="white"></circle>
                    </g>
                  </svg>
                </div>
              </div>
            );
        }
    });

    function getCoords(percent, center){
      var coords = {};
      var rads = percent / 50 * Math.PI;
      coords.x = center - Math.sin(rads) * center;
      coords.y = center - Math.cos(rads) * center;
      return coords;
    }

    ReactDOM.render( <CpuGraph/>, document.getElementById('cpu-graph'));
    ReactDOM.render( <MemoryGraph/>, document.getElementById('memory-graph'));
})();
