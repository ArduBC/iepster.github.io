// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function() {
  "use strict";

  // Get attributes values
  let _id       = null;
  let _var      = null;
  let animation = 900;
  let container = null;
  var colors = { main: shared.helpers.colors.main, aux: shared.helpers.colors.aux };
  let data      = [];
  let margin    = { top: 10, right: 10, bottom: 10, left: 10 };

  // Validate attributes
  let validate = function(step) {
    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  let main = function(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Initialize variables
          if (!_var) { _var = {}; }
          _var._id = _id;
          _var.animation = animation;
          _var.colors = colors;
          _var.margin = margin;

          // Id for shadows
          _var.shadowId = `vis-shadow-${Math.floor(Math.random() * ((1000000000 - 5) + 1)) + 5}`

          // Set zoom transform
          if(_var.zoomTransform == null) { _var.zoomTransform = { k: 1, x: _var.margin.left, y: _var.margin.top }; }

           // Get container
          _var.container = {
            selector: container,
            d3: d3.select(container),
            el: ((typeof container === 'string' || container instanceof String) ? container : d3.select(container).node()),
            outerWrapper: d3.select(container).closest('.gViz-outer-wrapper'),
            outerWrapperClientRect: d3.select(container).closest('.gViz-outer-wrapper').node().getBoundingClientRect(),
            dimensions: {}
          };

          // Map data and get labels
          _var.data = _var._data = data;

          // Define T axis
          _var.tAxis = {
            title: _var.data.t != null && _var.data.t.title != null ? _var.data.t.title : "Progress in time",
            type: _var.data.t != null && _var.data.t.type != null ? _var.data.t.type : "time",
            format: _var.data.t != null && _var.data.t.format != null ? _var.data.t.format : "%Y-%d-%m",
            height: 16,
            bounds: [],
            labels: []
          };

          break;
      }
    }

    return _var;
  };

  // Expose global variables
  ['_id','_var','animation','container','colors','data','margin'].forEach(function(key) {

    // Attach variables to validation function
    validate[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function(_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Execute the specific called function
  main.run = _ => main('run');

  return main;
};
