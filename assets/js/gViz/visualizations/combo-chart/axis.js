// Imports
let d3 = require("d3");
var shared = require("../../shared/_init.js");

// Module declaration
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var action = 'create';

  // Validate attributes
  var validate = function validate(step) {

    switch (step) {
      case 'run':
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

            case 'create':

              // Create and update X axis
              _var.x_axis = _var.g.selectAll(".x.axis").data(['x']);
              _var.x_axis.exit().remove();
              _var.x_axis = _var.x_axis.enter().append('g').attr("class", "x axis").merge(_var.x_axis);
              _var.x_axis.call(_var.xAxis.tickSize(-_var.height)).attr("transform", 'translate(0,' + _var.height + ')')
              _var.x_axis.selectAll(".tick line").attr('y1', 3)
              _var.x_axis.selectAll(".tick text").text(function(d) { return _var.nodes[d].name; })

              // Create and update Y axis
              _var.y_left_axis = _var.gYClip.selectAll(".y.axis.l-axis").data(_var.data.yLeft != null && _var.data.yLeft.isVisible !== false ? ['y'] : []);
              _var.y_left_axis.exit().remove();
              _var.y_left_axis = _var.y_left_axis.enter().append('g').attr("class", "y axis l-axis").merge(_var.y_left_axis);
              _var.y_left_axis.call(_var.yLeftAxis.tickSize(-_var.width))
              _var.y_left_axis.selectAll(".tick line").attr('x1', -3)

              // Remove overlapping tick text
              _var.y_left_axis.selectAll(".tick text").filter(function(d) { return d === _var.yTarget; }).remove();

              // Create and update Y axis
              _var.y_right_axis = _var.gYClip.selectAll(".y.axis.r-axis").data(_var.data.yRight != null && _var.data.yRight.isVisible !== false ? ['y'] : []);
              _var.y_right_axis.exit().remove();
              _var.y_right_axis = _var.y_right_axis.enter().append('g').attr("class", "y axis r-axis").merge(_var.y_right_axis);
              _var.y_right_axis.call(_var.yRightAxis.tickSize(-_var.width)).attr("transform", 'translate(' + (_var.width - 3) + ',0)')
              _var.y_right_axis.selectAll(".domain").remove();

              // Remove overlapping tick text
              _var.y_right_axis.selectAll(".tick text").filter(function(d) { return d === _var.yTarget; }).remove();

              break;

          }
          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'action'].forEach(function (key) {

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

function __range__(left, right, inclusive) {
  var range = [];
  var ascending = left < right;
  var end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (var i = left; ascending ? i < end : i > end; ascending ? i++ : i--) { range.push(i); }
  return range;
}
