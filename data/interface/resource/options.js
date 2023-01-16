const OPTIONS = {
  "animation": false,
  "responsive": true,
  "maintainAspectRatio": false,
  "title": {
    "display": false
  },
  "layout": {
    "padding": {
      "top": 0,
      "left": 10,
      "right": 10,
      "bottom": 0
    }
  },
  "legend": {
    "labels": {
      "fontSize": 11,
      "boxWidth": 22,
      "fontColor": "#333",
      "filter": function (item, chart) {
        return item.text.includes("Level");
      }
    }
  },
  "scales": {
    "xAxes": [
      {
        "barPercentage": 1.00,
        "categoryPercentage": 1.00,
        "gridLines": {
          "display": true
        },
        "ticks": {
          "fontSize": 11,
          "fontColor": "#333"
        },
        "scaleLabel": {
          "fontSize": 11,
          "display": true,
          "fontColor": "#333",
          "labelString": "Time Frame"
        }
      }
    ],
    "yAxes": [
      {
        "stacked": true,
        "id": "y-axis-v-1",
        "position": "left",
        "gridLines": {
          "display": true
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        },
        "scaleLabel": {
          "fontSize": 11,
          "display": true,
          "fontColor": "#333",
          "labelString": "Sound Level (dB)"
        }
      },
      {
        "stacked": true,
        "id": "y-axis-v-2",
        "position": "right",
        "gridLines": {
          "display": true
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        },
        "scaleLabel": {
          "fontSize": 11,
          "display": true,
          "fontColor": "#333",
          "labelString": "Noise Level (dB)"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-1",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-2",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-3",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-4",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-5",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-6",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-7",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      },
      {
        "stacked": true,
        "display": false,
        "id": "y-axis-h-8",
        "position": "left",
        "gridLines": {
          "display": false
        },
        "ticks": {
          "min": 0,
          "max": 120,
          "fontSize": 11,
          "fontColor": "#333"
        }
      }
    ]
  }
};