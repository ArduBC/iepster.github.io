// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var data = [];

  // Validate attributes
  var validate = function (step) {

    switch (step) {
      case 'run': return true;
      default: return false;
    }
  };

  // Main function
  var main = function (step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          // Initialize scale
          _var.y = d3.scaleLinear().range([_var.height, 0]);

          // Define aux variables
          var min = null,
              max = null,
              diff = null;

          // Get bounds
          data.forEach(function(d) {
            if((min == null &&  d.y  != null && !isNaN(+d.y) ) || (d.y  != null && !isNaN(+d.y)  && min > +d.y )) { min = +d.y; }
            if((max == null &&  d.y  != null && !isNaN(+d.y) ) || (d.y  != null && !isNaN(+d.y)  && max < +d.y )) { max = +d.y; }
          });

          // Get axis target
          if(_var.data.y != null && _var.data.y.target != null && !isNaN(+_var.data.y.target)) {
            _var.yTarget = +_var.data.y.target;
            if(min == null || min > +_var.data.y.target) { min = +_var.data.y.target; }
            if(max == null || max < +_var.data.y.target) { max = +_var.data.y.target; }
          }

          // Check for default values
          if(isNaN(min)) { min = 0; }
          if(isNaN(max)) { max = 1; }

          // Get diff
          var diff = Math.abs(max - min) === 0 ? Math.abs(max * 0.1) : Math.abs(max - min) * 0.05;

          // Set x domain
          _var.yBounds = [min, max]; //(min == 0 ? min : min - diff), max + diff];
          _var.y.domain(_var.yBounds).nice();

          // Set format
          _var.yFormat = shared.helpers.number.parseFormat(_var.data == null ? null : _var.data.y);

          // Get x axis ticks
          var bins = d3.max([3, parseInt(_var.height / 100, 10)]);

          // Define y axis
          _var.yAxis = d3.axisLeft(_var.y).ticks(bins).tickPadding(10).tickFormat(_var.yFormat);

          // Display y axis
          if(_var.data.y != null && _var.data.y.isVisible !== false) {
            _var.width += _var.margin.left;
            _var.margin.left = 5 + d3.max(_var.yAxis.scale().ticks().map(function(d) { return shared.helpers.text.getSize(_var.yFormat(d)); }));
            _var.width -= _var.margin.left;
          }

          // Adjust width and margin based on screenMode
          if(_var.screenMode === 'portrait' || _var.screenMode === 'portrait-primary' || _var.screenMode === 'portrait-secondary') {
            _var.width += _var.margin.left;
            _var.margin.left = 5;
            _var.width -= _var.margin.left;
          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','data'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) {
        eval('return ' + key);
      }
      eval(key + ' = _');
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = function (_) {
    return main('run');
  };

  return main;
};
