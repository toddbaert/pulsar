const fsp = require('fs-promise');
const os = require('os');
if (os.platform().substring(0, 3) == 'win') {
  edge = require('edge');
}

var firstIteration = true;
var prevIdle, prevNonIdle;
var cpu = null;
var instance = null;

// Posix service implementation
function PosixService(updateInterval) {
    var updateInterval = updateInterval || 1000;

    return {
        resources: {
            cpu: 0,
            memory: 0
        },
        init: function () {
            setInterval(() => {
                fsp.readFile('/proc/stat')
                    .then((data) => {
                        data = data.toString();
                        this.resources.cpu = Math.floor(parseCpu(data.split('\n')[0]));
                    });
                fsp.readFile('/proc/meminfo')
                    .then((data) => {
                        data = data.toString();
                        var total = parseInt(data.split(/\n/)[0].split(/\s+/)[1]);
                        var available = parseInt(data.split(/\n/)[2].split(/\s+/)[1]);
                        this.resources.memory = Math.floor((1 - available / total) * 100);
                    });
            }, updateInterval);
        },
        getResources: function () {
            return this.resources;
        }
    };
}

// Windows service implementation
function WindowsService(updateInterval) {
    var updateInterval = updateInterval || 1000;

    return {
        resources: {
            cpu: 0,
            memory: 0
        },
        init: function () {
            setInterval(function () {
                var updateResources = edge.func(() => {/*
                    using System.Diagnostics;
                    using System.Threading;
                    using System.Threading.Tasks;

                    public class Startup
                    {
                        public async Task<object> Invoke(object input)
                        {
                            // setup counters
                            var cpuCounter = new PerformanceCounter();
                            cpuCounter.CategoryName = "Processor";
                            cpuCounter.CounterName = "% Processor Time";
                            cpuCounter.InstanceName = "_Total";
                            var ramCounter = new PerformanceCounter("Memory", "Available MBytes");

                            // first sample
                            cpuCounter.NextValue();

                            // sleep to smooth spikes
                            Thread.Sleep((int)input);

                            // get final cpu sample, add memory usage, and return JSON
                            return "{\"cpu\":" + cpuCounter.NextValue() + "," + "\"memory\":" + ((32000 - ramCounter.NextValue()) / 32000) * 100 + "}";
                        }
                    }
                */});

                updateResources(updateInterval, (error, result) => {
                    if (error) throw error;
                    this.resources = JSON.parse(result);
                });
            }.bind(this), 100);
        },
        getResources: function () {
            return this.resources;
        }
    };
}

function parseCpu(data) {
    var a = data.split(/\s+/);
    if (a == null || a.length != 11) {
        return;
    }
    a = a.map((el) => {
        return parseInt(el);
    });

    //user, nice, system, idle, iowait, irq, softir, steal, guest, guest_nice
    var idle = a[4] + a[5];
    var nonIdle = a[1] + a[2] + a[3] + a[6] + a[7] + a[8];
    if (!firstIteration) {
        var prevTotal = prevIdle + prevNonIdle;
        var total = idle + nonIdle;
        var totalDelta = total - prevTotal;
        var idleDelta = idle - prevIdle;
        cpu = (totalDelta - idleDelta) / totalDelta * 100;
    } else {
        firstIteration = false;
    }
    prevIdle = idle;
    prevNonIdle = nonIdle;
    return Math.floor(cpu);
}

module.exports = {
    getService: () => {
        if (instance == null) {
            if (os.platform().substring(0, 3) == 'win') {
                instance = new WindowsService();
            } else {
                instance = new PosixService();
            }
            instance.init();
        }
        return instance;
    }
};
