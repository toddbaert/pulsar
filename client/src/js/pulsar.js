(function() {
    var ReactDOM = require('react-dom');
    var React = require('react');
    var service = require('./service.client.js');

    var CpuGraph = React.createClass({
        getInitialState: function() {
            return {
              data: 0
            };
        },
        componentDidMount: function() {
            var interval = null;
            clearInterval(interval);
            // subscribe to the service for cpu data
            service.subscribe(function(){
              clearInterval(interval);
              var delta = service.basic.cpu - this.state.data;
              var inc = 0;
              // interval for animating changes between updates from service
              interval = setInterval(function(){
                // make the frequency of updates proportional to the change in the data
                this.setState({data: parseFloat(this.state.data + delta / (Math.abs(delta) || 1))});
              }.bind(this), 1000 / (Math.abs(delta) || 1));
            }.bind(this));
        },
        render: function() {
          return (
                <div style={{left: "420px", position: "absolute"}} >
                  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <rect height={this.state.data} width={20} x="40" y={100 - this.state.data} ></rect>
                    </g>
                  </svg>
                </div>
            );
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
            // subscribe to the service for memory data
            service.subscribe(function(){
              clearInterval(interval);
              var delta = service.basic.memory - this.state.data;
              var inc = 0;
              // interval for animating changes between updates from service
              interval = setInterval(function(){
                // make the frequency of updates proportional to the change in the data
                this.setState({data: parseFloat(this.state.data + delta / (Math.abs(delta) || 1))});
              }.bind(this), 1000 / (Math.abs(delta) || 1));
            }.bind(this));
        },
        render: function() {
            var coords = getCoords(this.state.data, 45);
            return (
                <div style={{left: "420px", position: "absolute"}} >
                  <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <path d={"M 45 0 " + "A 45 45, 0, " + Math.abs(Math.floor((this.state.data - 1) / 50)) + ", 0, " + coords.x + " " + coords.y + " " + "L 45 45 Z"} fill={"black"}></path>
                      <circle cx="45" cy="45" r="25" fill="white"></circle>
                    </g>
                  </svg>
                </div>
            );
        }
    });

    var Chart = React.createClass({
      getInitialState: function() {
          return {
            history: []
          };
      },
      componentDidMount: function() {
        service.subscribe(function(){
          this.setState(function(state, props){
            // resource in quesation for this chart is passed via props
            state.history.push({time: +new Date(), value: service.basic[props.resource]});
          });
          }.bind(this));
      },
      render: function() {
        var line = [];
        var prevX = null;
        var prevY = null;
        this.state.history.forEach(function(entry){
          currentX = 400 - (+new Date() - entry.time) / 300000 * 400;
          currentY = 100 - entry.value;
          line.push(<LineComponent prevX={prevX || currentX} prevY={prevY || currentY} currentX={currentX} currentY={currentY}/>);
          prevX = currentX;
          prevY = currentY;
        }.bind(this));

        return (
          <div>
            <svg width="400" height="100" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <rect width="400" height="100" style={{fill: "transparent", stroke: "grey"}}/>
                  <line x1="0" y1="50" x2="400" y2="50" strokeWidth=".5" stroke="grey"/>
                  <line x1="67" y1="0" x2="67" y2="100" strokeWidth=".5" stroke="grey"/>
                  <line x1="133" y1="0" x2="133" y2="100" strokeWidth=".5" stroke="grey"/>
                  <line x1="200" y1="0" x2="200" y2="100" strokeWidth=".5" stroke="grey"/>
                  <line x1="267" y1="0" x2="267" y2="100" strokeWidth=".5" stroke="grey"/>
                  <line x1="333" y1="0" x2="333" y2="100" strokeWidth=".5" stroke="grey"/>
                  <line x1="400" y1="0" x2="400" y2="100" strokeWidth=".5" stroke="grey"/>
                </g>
                <g>
                  {line}
                </g>
              </svg>
          </div>
        );
      }
    });

    var LineComponent = React.createClass({
      render: function() {
        return (<line x1={this.props.prevX} y1={this.props.prevY} x2={this.props.currentX} y2={this.props.currentY} strokeWidth=".5" stroke="red"/>);
      }
    });

    function getCoords(percent, center){
      var coords = {};
      var rads = percent / 50 * Math.PI;
      coords.x = center - Math.sin(rads) * center;
      coords.y = center - Math.cos(rads) * center;
      return coords;
    }

    ReactDOM.render( <Chart resource="cpu"/>, document.getElementById('cpu-chart'));
    ReactDOM.render( <CpuGraph/>, document.getElementById('cpu-graph'));
    ReactDOM.render( <Chart resource="memory"/>, document.getElementById('memory-chart'));
    ReactDOM.render( <MemoryGraph/>, document.getElementById('memory-graph'));

})();
