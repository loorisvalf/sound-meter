const OPTIONS = {
  "responsive": true,
  "animation": false,
  "title": {"display": false},
  "maintainAspectRatio": false,
  "legend": {
    "labels": {
      "fontSize": 11,
      "boxWidth": 22,
      "fontColor": "#555",
      "filter": function (item, chart) {
        return item.text.includes("Level");
      }
    }
  },
  "layout": {
    "padding": {
      "top": 0,
      "left": 10,
      "right": 10,
      "bottom": 0
    }
  },
  "scales": {
    "xAxes": [
      {"barPercentage": 1.00, "categoryPercentage": 1.00, "gridLines": {"display": true}, "ticks": {"fontSize": 11, "fontColor": "#555"}, "scaleLabel": {"display": true, "fontSize": 11, "fontColor": "#555", "labelString": "Time Frame"}}
    ],
    "yAxes": [
      {"id": "y-axis-v-1", "position": "left", "stacked": true, "gridLines": {"display": true},  "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "scaleLabel": {"display": true, "fontSize": 11, "fontColor": "#555", "labelString": "Sound Level (dB)"}},
      {"id": "y-axis-v-2", "position": "right", "stacked": true, "gridLines": {"display": true}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "scaleLabel": {"display": true, "fontSize": 11, "fontColor": "#555", "labelString": "Noise Level (dB)"}},
      /*  */
      {"id": "y-axis-h-1", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false},
      {"id": "y-axis-h-2", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false},
      {"id": "y-axis-h-3", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false},
      {"id": "y-axis-h-4", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false},
      {"id": "y-axis-h-5", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false},
      {"id": "y-axis-h-6", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false},
      {"id": "y-axis-h-7", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false},
      {"id": "y-axis-h-8", "position": "left", "stacked": true, "gridLines": {"display": false}, "ticks": {"min": 0, "max": 120, "fontSize": 11, "fontColor": "#555"}, "display": false}
    ]
  }
};
