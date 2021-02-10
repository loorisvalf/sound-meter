Array.prototype.average = function () {
  var i = 0, l = this.length, s = 0;
  for (i = 0; i < l; i++) s += this[i];
  return s / l;
};

var config = {
  "addon": {
    "homepage": function () {
      return chrome.runtime.getManifest().homepage_url;
    }
  },
  "resize": {
    "timeout": null,
    "method": function () {
      if (config.resize.timeout) window.clearTimeout(config.resize.timeout);
      config.resize.timeout = window.setTimeout(function () {
        config.storage.write("size", {
          "width": window.innerWidth || window.outerWidth,
          "height": window.innerHeight || window.outerHeight
        });
      }, 1000);
    }
  },
  "port": {
    "name": '',
    "connect": function () {
      config.port.name = "webapp";
      var context = document.documentElement.getAttribute("context");
      /*  */
      if (chrome.runtime) {
        if (chrome.runtime.connect) {
          if (context !== config.port.name) {
            if (document.location.search === "?tab") config.port.name = "tab";
            if (document.location.search === "?win") config.port.name = "win";
            if (document.location.search === "?popup") config.port.name = "popup";
            /*  */
            if (config.port.name === "popup") {
              document.body.style.width = "735px";
              document.body.style.height = "590px";
            }
            /*  */
            chrome.runtime.connect({"name": config.port.name});
          }
        }
      }
      /*  */
      document.documentElement.setAttribute("context", config.port.name);
    }
  },
  "storage": {
    "local": {},
    "read": function (id) {
      return config.storage.local[id];
    },
    "load": function (callback) {
      chrome.storage.local.get(null, function (e) {
        config.storage.local = e;
        callback();
      });
    },
    "write": function (id, data) {
      if (id) {
        if (data !== '' && data !== null && data !== undefined) {
          var tmp = {};
          tmp[id] = data;
          config.storage.local[id] = data;
          chrome.storage.local.set(tmp, function () {});
        } else {
          delete config.storage.local[id];
          chrome.storage.local.remove(id, function () {});
        }
      }
    }
  },
  "load": function () {
    var reload = document.getElementById("reload");
    var support = document.getElementById("support");
    var donation = document.getElementById("donation");
    var interval = document.getElementById("interval");
    var calibration = document.getElementById("calibration");
    /*  */
    support.addEventListener("click", function (e) {
      var url = config.addon.homepage();
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    donation.addEventListener("click", function (e) {
      var url = config.addon.homepage() + "?reason=support";
      chrome.tabs.create({"url": url, "active": true});
    }, false);
    /*  */
    interval.addEventListener("change", function (e) {
      var target = parseInt(e.target.value);
      var value = target > 1000 || target < 100 ? 250 : target;
      config.app.interval.write = value;
      /*  */
      if (config.app.soundmeter.instance) {
        config.app.soundmeter.instance.checkLevels();
      }
    });
    /*  */
    calibration.addEventListener("change", function (e) {
      var target = parseInt(e.target.value);
      var value = target > 50 || target < 0 ? 30 : target;
      config.app.calibration.write = value;
    });
    /*  */
    config.storage.load(config.app.init);
    window.removeEventListener("load", config.load, false);
    reload.addEventListener("click", function () {document.location.reload()});
  },
  "app": {
    "loader": null,
    "analyser": null,
    "microphone": null,
    "audiocontext": null,
    "scriptprocessor": null,
    "variable": {
      "data": DATA, 
      "options": OPTIONS
    },
    "calibration": {
      set write (val) {config.storage.write("calibration", val)},
      get read () {return config.storage.read("calibration") !== undefined ? config.storage.read("calibration") : 30},
    },
    "interval": {
      "instance": null,
      set write (val) {config.storage.write("interval", val)},
      get read () {return config.storage.read("interval") !== undefined ? config.storage.read("interval") : 250},
    },
    "init": function () {
      if (config.app.analyser) delete config.app.analyser;
      if (config.app.microphone) delete config.app.microphone;
      if (config.app.audiocontext) delete config.app.audiocontext;
      if (config.app.scriptprocessor) delete config.app.scriptprocessor;
      if (config.app.interval.instance) window.clearInterval(config.app.interval.instance);
      if (config.port.name === "popup") config.app.variable.options.layout.padding.bottom = 58;
      /*  */
      config.app.loader = document.querySelector(".loader");
      calibration.value = config.app.calibration.read;
      interval.value = config.app.interval.read;
      config.app.loader.style.display = "block";
      config.app.soundmeter.start();
      /*  */
      var canvas = document.querySelector("canvas");
      window.soundchart = new Chart(canvas.getContext("2d"), config.app.variable);
    },
    "soundmeter": {
      "instance": null,
      "sound": {
        "db": 0,
        "min": 25,
        "max": 60,
        "level": 0,
        "noise": 0,
        "start": 0,
        "average": 0,
        "duration": 0,
        "normalized": 0,
        "minSoundLevel": 25,
        "minSoundLevel_normalized": 25
      },
      "start": function  () {
        config.app.soundmeter.instance = this;
        /*  */
        config.app.soundmeter.instance.init = function () {
          var count = 0;
          var started = false;
          var buffer = new Array(125);
          var progress = config.app.loader.querySelector('p');
          /*  */
          for (var i = 0; i < 30; i++) config.app.variable.data.labels.push((i + 1) + '');
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[0].data.push(config.app.calibration.read + 10);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[1].data.push(config.app.calibration.read + 12);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[2].data.push(0);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[3].data.push(35);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[4].data.push(36);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[5].data.push(65);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[6].data.push(66);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[7].data.push(100);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[8].data.push(101);
          for (var i = 0; i < 30; i++) config.app.variable.data.datasets[9].data.push(120);
          /*  */
          if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({"audio": true}).then(function (e) {
              if (e) {
                config.app.audiocontext = new AudioContext();
                config.app.analyser = config.app.audiocontext.createAnalyser();
                config.app.microphone = config.app.audiocontext.createMediaStreamSource(e);
                config.app.scriptprocessor = config.app.audiocontext.createScriptProcessor(2048, 1, 1);
                /*  */
                config.app.analyser.fftSize = 1024;
                config.app.analyser.smoothingTimeConstant = 0.3;
                config.app.microphone.connect(config.app.analyser);
                config.app.analyser.connect(config.app.scriptprocessor);
                config.app.scriptprocessor.connect(config.app.audiocontext.destination);
                /*  */
                config.app.scriptprocessor.onaudioprocess = function () {
                  var LEVEL = 0;
                  var timedata = new Uint8Array(config.app.analyser.frequencyBinCount);
                  config.app.analyser.getByteFrequencyData(timedata);
                  for (var i = 0; i < timedata.length; i++) LEVEL += timedata[i];
                  /*  */
                  config.app.soundmeter.sound.average = LEVEL / timedata.length;
                  config.app.soundmeter.sound.db = 20 * Math.log10(config.app.soundmeter.sound.average) + config.app.calibration.read;
                  /*  */
                  if (started) {
                    buffer = buffer.slice(1);
                    buffer.push(config.app.soundmeter.sound.db);
                    config.app.soundmeter.sound.normalized = config.app.soundmeter.sound.db - buffer.average() < 0 ? 0 : (config.app.soundmeter.sound.db - buffer.average());
                    config.app.soundmeter.sound.noise = config.app.soundmeter.sound.db - config.app.soundmeter.sound.normalized;
                    config.app.soundmeter.sound.minSoundLevel_normalized = config.app.soundmeter.sound.minSoundLevel - ((config.app.soundmeter.sound.noise / 180) * config.app.soundmeter.sound.minSoundLevel);
                  } else buffer[count++] = config.app.soundmeter.sound.db;
                  /*  */
                  if (count > 125 && started === false) {
                    count = 0;
                    started = true;
                    config.app.soundmeter.instance.checkLevels();
                    config.app.loader.style.display = "none";
                  } else {
                    progress.textContent = "Buffer (" + count +  "/125) loaded, please wait...";
                  }
                };
              } else {
                progress.textContent = "An unexpected error occurred!";
              }
            }).catch(function () {
              progress.textContent = "Error! microphone access is denied!";
            });
          } else {
            progress.textContent = "Error! navigator.mediaDevices is not supported!";
          }
        };
        /*  */
        config.app.soundmeter.instance.checkLevels = function () {
          config.app.soundmeter.sound.start = Date.now();
          if (config.app.interval.instance) window.clearInterval(config.app.interval.instance);
          config.app.interval.instance = window.setInterval(function () {
            window.soundchart.data.datasets[0].data.push(config.app.soundmeter.sound.db);
            window.soundchart.data.datasets[0].data.shift();
            window.soundchart.data.datasets[1].data.push(config.app.soundmeter.sound.noise + 2);
            window.soundchart.data.datasets[1].data.shift();
            window.soundchart.update();
            /*  */
            var _date = new Date(null);
            var db = document.getElementById("db");
            var min = document.getElementById("min");
            var max = document.getElementById("max");
            var level = document.getElementById("level");
            var noise = document.getElementById("noise");
            var average = document.getElementById("average");
            var duration = document.getElementById("duration");
            var normalized = document.getElementById("normalized");
            /*  */
            _date.setSeconds((Date.now() - config.app.soundmeter.sound.start) / 1000);
            config.app.soundmeter.sound.duration = _date.toISOString().substr(11, 8);
            config.app.soundmeter.sound.max = config.app.soundmeter.sound.db > config.app.soundmeter.sound.max ? config.app.soundmeter.sound.db : config.app.soundmeter.sound.max;
            config.app.soundmeter.sound.min = config.app.soundmeter.sound.db < config.app.soundmeter.sound.minSoundLevel ? config.app.soundmeter.sound.db : config.app.soundmeter.sound.minSoundLevel;
            /*  */
            duration.textContent = config.app.soundmeter.sound.duration;
            db.textContent = config.app.soundmeter.sound.db ? config.app.soundmeter.sound.db.toFixed(2) : 0.00;
            min.textContent = config.app.soundmeter.sound.min ? config.app.soundmeter.sound.min.toFixed(2) : 0.00;
            max.textContent = config.app.soundmeter.sound.max ? config.app.soundmeter.sound.max.toFixed(2) : 0.00;
            noise.textContent = config.app.soundmeter.sound.noise ? config.app.soundmeter.sound.noise.toFixed(2) : 0.00;
            average.textContent = config.app.soundmeter.sound.average ? config.app.soundmeter.sound.average.toFixed(2) : 0.00;
            normalized.textContent = config.app.soundmeter.sound.normalized ? config.app.soundmeter.sound.normalized.toFixed(2) : 0.00;
            /*  */
            level.textContent = db.textContent + "dB";
          }, config.app.interval.read);
        };
        /*  */
        config.app.soundmeter.instance.init();
      }
    }
  }
};

config.port.connect();
window.addEventListener("load", config.load, false);
window.addEventListener("resize", config.resize.method, false);