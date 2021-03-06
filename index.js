const echarts = require("echarts");
const { createCanvas } = require('canvas')
const fs = require('fs');
const path = require('path');

/**
 * @param config = {
        width: 500 // Image width, type is number.
        height: 500 // Image height, type is number.
        option: {}, // Echarts configuration, type is Object.
        //If the path  is not set, return the Buffer of image.
        path:  '', // Path is filepath of the image which will be created.
    }

 *
 */
module.exports = function (config) {

  var chart, option = {
    title: {
      text: 'test'
    },
    tooltip: {},
    legend: {
      data: ['test']
    },
    xAxis: {
      data: ["a", "b", "c", "d", "f", "g"]
    },
    yAxis: {},
    series: [{
      name: 'test',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };

  let defaultConfig = {
    width: 500,
    height: 500,
    option,
    enableAutoDispose: true,
    devicePixelRatio: 2
  }

  config = Object.assign({}, defaultConfig, config)

  let Canvas = createCanvas(config.width, config.height);
  if (config.canvas) {
    Canvas = config.canvas;
  }

  const ctx = Canvas.getContext('2d')
  if (config.font) {
    ctx.font = config.font;
  }

  echarts.setCanvasCreator(() => Canvas)

  config.option.animation = false;
  chart = echarts.init(Canvas, null, {devicePixelRatio: config.devicePixelRatio});
  chart.setOption(config.option);
  
  if (config.path) {
    try {
      fs.writeFileSync(config.path, chart.getDom().toBuffer());
      if (config.enableAutoDispose) {
        chart.dispose();
      }
      console.log("Create Img:" + config.path)
    } catch (err) {
      console.error("Error: Write File failed" + err.message)
    }

  } else {
    var buffer = chart.getDom().toBuffer();
    try {
      if (config.enableAutoDispose) {
        chart.dispose();
      }
    } catch (e) { }
    return buffer;
  }
}