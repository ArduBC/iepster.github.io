// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = undefined;
  var animation = 900;

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

          // Draw svg
          _var.wrap = _var.container.d3.selectAll(`svg.chart-${_var._id}`).data(["chart-svg"]);
          _var.wrap.exit().remove();
          _var.wrap = _var.wrap.enter().append("svg").attr('class', `map-heat-bars chart-${_var._id}`).merge(_var.wrap); // svg

          // Update outer dimensions
          _var.wrap
            .attr("width", _var.width + _var.margin.left + _var.margin.right)
            .attr("height", _var.height + _var.margin.top + _var.margin.bottom)
            .style("background-color", _var.data.attrs != null && _var.data.attrs.backgroundColor != null && _var.data.attrs.backgroundColor !== '' ? _var.data.attrs.backgroundColor : 'transparent')
            .classed('grab', true);

          // Draw g
          _var.g = _var.wrap.selectAll("g.chart-wrap").data(["chart-wrap"]); // svg:g
          _var.g.exit().remove();
          _var.g = _var.g.enter().append('g').attr('class', "chart-wrap").merge(_var.g);

          // Update dimensions
          _var.g.attr("transform", "translate("+_var.zoomTransform.x+","+_var.zoomTransform.y+") scale("+_var.zoomTransform.k+")")

          // Draw background grid
          if(!(_var.data != null && _var.data.attrs != null && _var.data.attrs.grid != null && _var.data.attrs.grid === false)) {
            shared.visualComponents.backgroundGrid()
              .id(_var._id)
              .height(_var.height + _var.margin.top + _var.margin.bottom)
              .width(_var.width + _var.margin.left + _var.margin.right)
              .left(0)
              .top(0)
              .wrap(_var.container.d3)
              .run();
          }

          // Draw shadow
          shared.visualComponents.shadow()
            ._var(_var)
            .wrap(_var.wrap)
            .id(_var.shadowId)
            .run();

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var', 'animation'].forEach(function (key) {

    // Attach variables to validation function
    validate[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return validate;
    };

    // Attach variables to main function
    return main[key] = function (_) {
      if (!arguments.length) { eval(`return ${key}`); }
      eval(`${key} = _`);
      return main;
    };
  });

  // Executa a funcao chamando o parametro de step
  main.run = _ => main('run');

  return main;
};
