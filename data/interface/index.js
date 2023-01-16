var config = {
  "addon": {
    "microphone": "about://settings/content/microphone",
    "homepage": function () {
      return chrome.runtime.getManifest().homepage_url;
    }
  },
  "resize": {
    "timeout": null,
    "method": function () {
      if (config.port.name === "win") {
        if (config.resize.timeout) window.clearTimeout(config.resize.timeout);
        config.resize.timeout = window.setTimeout(async function () {
          const current = await chrome.windows.getCurrent();
          /*  */
          config.storage.write("interface.size", {
            "top": current.top,
            "left": current.left,
            "width": current.width,
            "height": current.height
          });
        }, 1000);
      }
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
          let tmp = {};
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
  "port": {
    "name": '',
    "connect": function () {
      config.port.name = "webapp";
      const context = document.documentElement.getAttribute("context");
      /*  */
      if (chrome.runtime) {
        if (chrome.runtime.connect) {
          if (context !== config.port.name) {
            if (document.location.search === "?tab") config.port.name = "tab";
            if (document.location.search === "?win") config.port.name = "win";
            if (document.location.search === "?popup") config.port.name = "popup";
            /*  */
            if (config.port.name === "popup") {
              document.documentElement.style.width = "780px";
              document.documentElement.style.height = "600px";
              OPTIONS.scales.yAxes[0].scaleLabel.display = false;
              OPTIONS.scales.yAxes[1].scaleLabel.display = false;
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
  "load": function () {
    config.app.elements.canvas = document.querySelector("canvas");
    config.app.elements.loader = document.querySelector(".loader");
    config.app.elements.reload = document.getElementById("reload");
    config.app.elements.support = document.getElementById("support");
    config.app.elements.interval = document.getElementById("interval");
    config.app.elements.donation = document.getElementById("donation");
    config.app.elements.calibration = document.getElementById("calibration");
    config.app.elements.range = document.getElementById("sensitivity-factor");
    config.app.elements.context = config.app.elements.canvas.getContext("2d");
    config.app.elements.audioworklet = document.getElementById("audioworklet");
    config.app.elements.progress = config.app.elements.loader.querySelector('p');
    config.app.elements.scriptprocessor = document.getElementById("scriptprocessor");
    /*  */
    config.app.elements.reload.addEventListener("click", function () {
      document.location.reload();
    });
    /*  */
    config.app.elements.calibration.addEventListener("change", function (e) {
      const target = parseInt(e.target.value);
      const value = target > 120 || target < 0 ? 30 : target;
      /*  */
      config.app.calibration.value = value;
    });
    /*  */
    config.app.elements.audioworklet.addEventListener("change", function (e) {
      config.app.engine.audioworklet = e.target.checked;
      config.app.engine.scriptprocessor = !e.target.checked;
      //
      window.setTimeout(function () {reload.click()}, 300);
    });
    /*  */
    config.app.elements.scriptprocessor.addEventListener("change", function (e) {
      config.app.engine.audioworklet = !e.target.checked;
      config.app.engine.scriptprocessor = e.target.checked;
      //
      window.setTimeout(function () {reload.click()}, 300);
    });
    /*  */
    config.app.elements.support.addEventListener("click", function () {
      if (config.port.name !== "webapp") {
        const url = config.addon.homepage();
        chrome.tabs.create({"url": url, "active": true});
      }
    }, false);
    /*  */
    config.app.elements.donation.addEventListener("click", function () {
      if (config.port.name !== "webapp") {
        const url = config.addon.homepage() + "?reason=support";
        chrome.tabs.create({"url": url, "active": true});
      }
    }, false);
    /*  */
    config.app.elements.interval.addEventListener("change", function (e) {
      const target = parseInt(e.target.value);
      const value = target > 10000 || target < 1 ? 250 : target;
      config.app.interval.value = value;
      config.app.soundmeter.render();
    });
    /*  */
    config.app.elements.range.addEventListener("input", function (e) {
      config.app.sensitivity.factor = Number(e.target.value);
      e.target.nextElementSibling.value = (100 / config.app.sensitivity.factor).toFixed(1) + '%';
      /*  */
      if (config.app.soundmeter.api.audioworklet.instance) {
        config.app.soundmeter.api.audioworklet.instance.port.postMessage({"factor": config.app.sensitivity.factor});
      }
    });
    /*  */
    config.storage.load(config.app.start);
    window.removeEventListener("load", config.load, false);
  },
  "app": {
    "elements": {},
    "analyser": null,
    "microphone": null,
    "workletnode": null,
    "audiocontext": null,
    "variable": {
      "data": DATA, 
      "options": OPTIONS
    },
    "sensitivity": {
      set factor (val) {config.storage.write("sensitivity-factor", val)},
      get factor () {return config.storage.read("sensitivity-factor") !== undefined ? config.storage.read("sensitivity-factor") : 1}
    },
    "calibration": {
      set value (val) {config.storage.write("calibration", val)},
      get value () {return config.storage.read("calibration") !== undefined ? config.storage.read("calibration") : 30}
    },
    "interval": {
      "instance": null,
      set value (val) {config.storage.write("interval", val)},
      get value () {return config.storage.read("interval") !== undefined ? config.storage.read("interval") : 250}
    },
    "engine": {
      set audioworklet (val) {config.storage.write("audioworklet", val)},
      set scriptprocessor (val) {config.storage.write("scriptprocessor", val)},
      get audioworklet () {return config.storage.read("audioworklet") !== undefined ? config.storage.read("audioworklet") : true},
      get scriptprocessor () {return config.storage.read("scriptprocessor") !== undefined ? config.storage.read("scriptprocessor") : false}
    },
    "start": function () {
      if (config.app.analyser) delete config.app.analyser;
      if (config.app.microphone) delete config.app.microphone;
      if (config.app.audiocontext) delete config.app.audiocontext;
      if (config.app.interval.instance) window.clearInterval(config.app.interval.instance);
      if (config.port.name === "popup") config.app.variable.options.layout.padding.bottom = 58;
      if (config.app.soundmeter.api.audioworklet.instance) delete config.app.soundmeter.api.audioworklet.instance;
      if (config.app.soundmeter.api.scriptprocessor.instance) delete config.app.soundmeter.api.scriptprocessor.instance;
      /*  */
      config.app.elements.interval.value = config.app.interval.value;
      config.app.elements.calibration.value = config.app.calibration.value;
      config.app.elements.audioworklet.checked = config.app.engine.audioworklet;
      config.app.elements.scriptprocessor.checked = config.app.engine.scriptprocessor;
      /*  */
      config.app.soundmeter.start();
    },
    "soundmeter": {
      "buffer": [],
      "sound": {
        "db": 0,
        "min": 25,
        "max": 60,
        "diff": 0,
        "level": 0,
        "noise": 0,
        "start": 0,
        "average": 0,
        "duration": 0,
        "normalized": 0,
        "minSoundLevel": 25,
        "minSoundLevel_normalized": 25
      },
      "register": function (e, f, c) {
        config.app.audiocontext = new AudioContext();
        config.app.analyser = config.app.audiocontext.createAnalyser();
        config.app.microphone = config.app.audiocontext.createMediaStreamSource(e);
        /*  */
        config.app.analyser.fftSize = f;
        config.app.analyser.smoothingTimeConstant = c;
        config.app.microphone.connect(config.app.analyser);
      },
      "render": function () {
        if (config.app.interval.instance) window.clearInterval(config.app.interval.instance);
        config.app.interval.instance = window.setInterval(function () {
          if (config.app.engine.audioworklet) {
            if (config.app.soundmeter.api.audioworklet.instance) {
              config.app.soundmeter.api.audioworklet.instance.port.postMessage({"ping": true});
            }
          } else {
            config.app.soundmeter.update();
          }
        }, config.app.interval.value);
      },
      "error": async function (e) {
        const error = e && e.message && e.message.indexOf("denied") !== -1;
        const permission = await navigator.permissions.query({"name": "microphone"});
        /*  */
        if (config.port.name !== "webapp") {
          if (error) {
            config.app.elements.progress.textContent = "Microphone permission is denied by the system (OS)! Please adjust the permission and try again.";
          }
          /*  */
          if (permission.state === "denied") {
            config.app.elements.progress.textContent = "Microphone permission is denied! Please adjust the permission and try again.";
            window.alert("Microphone permission is denied!\nPlease adjust the permission and try again.");
            chrome.tabs.create({"url": config.addon.microphone, "active": true});
          }
        }
      },
      "metrics": function (target, started) {
        config.app.soundmeter.sound.average = Math.max(target, 0.80 * config.app.soundmeter.sound.average * (config.app.sensitivity.factor / 10));
        config.app.soundmeter.sound.average = config.app.soundmeter.sound.average !== Infinity ? config.app.soundmeter.sound.average : 1;
        config.app.soundmeter.sound.average = config.app.soundmeter.sound.average !== 0 ? config.app.soundmeter.sound.average : 1;
        /*  */
        let result = {};
        result.a = +20 * Math.log10(config.app.soundmeter.sound.average);
        result.b = -15 * Math.log10(config.app.sensitivity.factor);
        result.c =  config.app.calibration.value;
        /*  */
        config.app.soundmeter.sound.db = result.a + result.b + result.c;
        /*  */
        if (started) {
          config.app.soundmeter.buffer.push(config.app.soundmeter.sound.db);
          config.app.soundmeter.buffer.shift();
          /*  */
          config.app.soundmeter.sound.average = config.app.soundmeter.buffer.average();
          config.app.soundmeter.sound.diff = config.app.soundmeter.sound.db - config.app.soundmeter.sound.average;
          config.app.soundmeter.sound.normalized = config.app.soundmeter.sound.db / config.app.soundmeter.buffer.max();
          config.app.soundmeter.sound.noise = config.app.soundmeter.sound.db - (config.app.soundmeter.sound.diff < 0 ? 0 : config.app.soundmeter.sound.diff);
          config.app.soundmeter.sound.minSoundLevel_normalized = config.app.soundmeter.sound.minSoundLevel - ((config.app.soundmeter.sound.noise / 180) * config.app.soundmeter.sound.minSoundLevel);
        }
      },
      "start": function  () {
        config.app.soundmeter.buffer = [];
        config.app.soundmeter.sound.average = 0;
        config.app.soundmeter.sound.start = Date.now();
        config.app.elements.loader.style.display = "block";
        config.app.soundmeter.sound.db = config.app.calibration.value;
        config.app.elements.range.value = config.app.sensitivity.factor;
        config.app.soundmeter.sound.noise = config.app.calibration.value - 2;
        config.app.elements.range.nextElementSibling.value = (100 / config.app.sensitivity.factor).toFixed(1) + '%';
        /*  */
        for (let i = 0; i < 30; i++) config.app.variable.data.labels.push((i + 1) + '');
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[0].data.push(config.app.calibration.value);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[1].data.push(config.app.calibration.value);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[2].data.push(0);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[3].data.push(35);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[4].data.push(36);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[5].data.push(65);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[6].data.push(66);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[7].data.push(100);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[8].data.push(101);
        for (let i = 0; i < 30; i++) config.app.variable.data.datasets[9].data.push(120);
        /*  */
        window.soundchart = new Chart(config.app.elements.context, config.app.variable);
        config.app.soundmeter.update();
        /*  */
        if (navigator.mediaDevices) {
          const process = config.app.engine.audioworklet ? config.app.soundmeter.api.audioworklet.engine : config.app.soundmeter.api.scriptprocessor.engine;
          navigator.mediaDevices.getUserMedia({"audio": true}).then(process).catch(config.app.soundmeter.error);
        } else {
          config.app.elements.progress.textContent = "Error! navigator.mediaDevices is not supported!";
        }
      },
      "update": function () {
        const date = new Date(null);
        const db = document.getElementById("db");
        const min = document.getElementById("min");
        const max = document.getElementById("max");
        const level = document.getElementById("level");
        const noise = document.getElementById("noise");
        const average = document.getElementById("average");
        const duration = document.getElementById("duration");
        const normalized = document.getElementById("normalized");
        /*  */
        date.setSeconds((Date.now() - config.app.soundmeter.sound.start) / 1000);
        config.app.soundmeter.sound.duration = date.toISOString().slice(11, 19);
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
        level.textContent = db.textContent + "dB";
        /*  */
        window.soundchart.data.datasets[0].data.push(config.app.soundmeter.sound.db);
        window.soundchart.data.datasets[0].data.shift();
        window.soundchart.data.datasets[1].data.push(config.app.soundmeter.sound.noise + 2);
        window.soundchart.data.datasets[1].data.shift();
        /*  */
        window.soundchart.update();
      },
      "api": {
        "audioworklet": {
          "started": true,
          "instance": null,
          "ping": function (e) {
            if (e.data) {
              let rms = e.data.volume;
              config.app.elements.loader.style.display = "none";
              config.app.soundmeter.metrics(rms, config.app.soundmeter.api.audioworklet.started);
              config.app.soundmeter.update();
            }
          },
          "engine": async function (e) {
            if (e) {
              config.app.soundmeter.register(e, 1024, 0.8);
              config.app.soundmeter.sound.start = Date.now();
              config.app.soundmeter.api.audioworklet.started = true;
              config.app.soundmeter.buffer = new Array(30).fill(config.app.calibration.value);
              /*  */
              try {
                await config.app.audiocontext.audioWorklet.addModule(chrome.runtime.getURL("/data/interface/resource/worklet.js"));
                config.app.soundmeter.api.audioworklet.instance = new AudioWorkletNode(config.app.audiocontext, "soundmeter");
                config.app.analyser.connect(config.app.soundmeter.api.audioworklet.instance);
                config.app.soundmeter.api.audioworklet.instance.connect(config.app.audiocontext.destination);
                config.app.soundmeter.api.audioworklet.instance.port.onmessage = config.app.soundmeter.api.audioworklet.ping;
                config.app.soundmeter.render();
              } catch (e) {
                
              }
            } else {
              config.app.elements.progress.textContent = "An unexpected error occurred!";
            }
          }
        },
        "scriptprocessor": {
          "count": 0,
          "instance": null,
          "started": false,
          "ping": function () {
            let dataarray = new Uint8Array(config.app.analyser.frequencyBinCount);
            config.app.analyser.getByteFrequencyData(dataarray);
            /*  */
            let avg = dataarray.reduce((p, c) => p + c, 0) / dataarray.length;
            avg = avg < 1e6 ? avg : 1e6;
            avg = avg > 1 ? avg : 1;
            /*  */
            config.app.soundmeter.metrics(avg, config.app.soundmeter.api.scriptprocessor.started);
            config.app.soundmeter.api.scriptprocessor.initialize();
          },
          "initialize": function () {
            if (config.app.soundmeter.api.scriptprocessor.started === false) {
              config.app.soundmeter.buffer[config.app.soundmeter.api.scriptprocessor.count++] = config.app.soundmeter.sound.db;
              /*  */
              if (config.app.soundmeter.api.scriptprocessor.count > 125) {
                config.app.soundmeter.api.scriptprocessor.started = true;
                config.app.soundmeter.api.scriptprocessor.count = 0;
                config.app.elements.loader.style.display = "none";
                config.app.soundmeter.render(); 
              } else {
                config.app.elements.progress.textContent = "Buffer (" + config.app.soundmeter.api.scriptprocessor.count +  "/125) loaded, please wait...";
              }
            }
          },
          "engine": function (e) {
            if (e) {
              config.app.soundmeter.register(e, 1024, 0.3);
              config.app.soundmeter.sound.start = Date.now();
              config.app.soundmeter.api.scriptprocessor.count = 0;
              config.app.soundmeter.buffer = new Array(125).fill(0);
              config.app.soundmeter.api.scriptprocessor.started = false;
              /*  */
              config.app.soundmeter.api.scriptprocessor.instance = config.app.audiocontext.createScriptProcessor(2048, 1, 1);
              config.app.analyser.connect(config.app.soundmeter.api.scriptprocessor.instance);
              config.app.soundmeter.api.scriptprocessor.instance.connect(config.app.audiocontext.destination);
              config.app.soundmeter.api.scriptprocessor.instance.onaudioprocess = config.app.soundmeter.api.scriptprocessor.ping;
            } else {
              config.app.elements.progress.textContent = "An unexpected error occurred!";
            }
          }
        }
      }
    }
  }
};

config.port.connect();

window.addEventListener("load", config.load, false);
window.addEventListener("resize", config.resize.method, false);