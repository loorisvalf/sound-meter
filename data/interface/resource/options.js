const OPTIONS = {
  "animation": false,
  "responsive": true,
  "maintainAspectRatio": false,
  "plugins": {
    "title": {
      "display": false
    },
    "legend": {
      "position": "top",
      "labels": {
        "font": {
          "size": 11
        },
        "boxWidth": 22,
        "color": "#333333",
        "filter": function (item, chart) {
          return item.text.includes("Level");
        }
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
    "x": {
      "barPercentage": 1.0,
      "categoryPercentage": 1.0,
      "grid": {
        "display": true,
        "drawOnChartArea": true,
        "color": "rgb(0 0 0 / 10%)"
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      },
      "title": {
        "display": true,
        "text": "Time Frame",
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-v-1": {
      "type": "linear",
      "stacked": true,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": true,
        "drawOnChartArea": true,
        "color": "rgb(0 0 0 / 10%)"
      },
      "afterFit": function (scale) {
        scale.width = 58;
      },
      "title": {
        "display": true,
        "text": "Sound Level (dB)",
        "font": {
          "size": 11
        },
        "color": "#333333"
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-v-2": {
      "type": "linear",
      "stacked": true,
      "position": "right",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "afterFit": function (scale) {
        scale.width = 58;
      },
      "title": {
        "display": true,
        "text": "Noise Level (dB)",
        "font": {
          "size": 11
        },
        "color": "#333333"
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-1": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-2": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-3": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-4": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-5": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-6": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-7": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-8": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-9": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    },
    "y-axis-h-10": {
      "type": "linear",
      "stacked": true,
      "display": false,
      "position": "left",
      "min": 0,
      "max": 120,
      "grid": {
        "display": false
      },
      "ticks": {
        "font": {
          "size": 11
        },
        "color": "#333333"
      }
    }
  }
};
