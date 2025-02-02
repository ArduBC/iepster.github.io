// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;
  var action = 'create';
  var metric = 'value';
  let showTotals = undefined;

  // Validate attributes
  var validate = function validate(step) {

    switch (step) {
      case 'run':
        if (!showTotals) console.log('err - showTotals')
        return true;
      default:
        return false;
    }
  };

  // Main function
  var main = function main(step) {

    // Validate attributes if necessary
    if (validate(step)) {

      switch (step) {

        // Build entire visualizations
        case 'run':

          switch (action) {

            case 'update-domain':

              // Initialize variables
              var min = 0;
              var max = 0;
              var diff = 0;
              var dates = {};

              // Iterate over data
              _var.data.forEach(function (d) {

                // Parse dates and values
                d.values.forEach(function (v) {

                  // Dates
                  v.date = shared.helpers.date.format.en.parse(v._date);
                  dates[v._date] = v.date;

                  // Values
                  if (+v.value > max) { max = +v.value; }
                  if (+v.value < min) { min = +v.value; }

                });




                // Sort values
                d.values = d.values.sort(function (a, b) { return d3.ascending(a.date, b.date); });

                // Get medians
                d.median = d3.median(d.values, function (v) { return +v.value; });
                if (showTotals) { 
                  //include totals in max calculation
                if (d.total > max) { max = d.total }
                }
                


              });

              // Update x domain
              _var.x.domain(d3.extent(Object.keys(dates).map(function (k) { return dates[k]; })));

              // Get difference
              if (isNaN(min) && isNaN(max) || min === 0 && max === 0) { min = 0; max = 0.1; }
              diff = Math.abs(max - min) * .1;

              // Update y domain
              _var.y.domain([(min == 0 ? min : min - diff), max + diff]);

              break;
          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation', 'action', 'value', 'showTotals'].forEach(function (key) {

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
  main.run = function (_) { return main('run'); };

  return main;
};
