class soundmeter extends AudioWorkletProcessor {
  constructor() {
    super();
    //
    this.volume = 0;
    this.port.target = this;
    this.port.onmessage = function (e) {
      if (e.data.ping) {
        this.postMessage({
          "volume": this.target.volume * 1000
        });
      }
    };
  }
  //
  process(inputs, outputs, parameters) {
    var values = [];
    var channels = inputs.length ? inputs[0] : [];
    //
    if (channels.length) {
      for (var channel of channels) {
        var num = channel.length;        
        var sum = channel.reduce((p, c) => p + (c * c), 0);
        values.push(Math.sqrt(sum / num));
      }
      //
      this.volume = values.length ? values.reduce((p, c) => p + c, 0) / values.length : 0;
      this.volume = this.volume > 0.001 ? this.volume : 0.001;
      this.volume = this.volume < 1000 ? this.volume : 1000;
    }
    //
    return true;
  }
};

registerProcessor("soundmeter", soundmeter);