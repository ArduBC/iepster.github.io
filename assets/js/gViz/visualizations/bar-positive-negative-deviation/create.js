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
          _var.wrap = _var.container.d3.selectAll(`svg.chart-${_var._id}`).data(["chart-svg"], d => d);
          _var.wrap.exit().remove();
          _var.wrap = _var.wrap.enter().append("svg").attr('class', `grouped-bar-chart chart-${_var._id}`).merge(_var.wrap); // svg

          // Update outer dimensions
          _var.wrap
            .style('overflow','visible')
            .attr("width", _var.width + _var.margin.left + _var.margin.right)
            .attr("height", _var.height + _var.margin.top + _var.margin.bottom);

          // Draw g
          _var.g = _var.wrap.selectAll("g.chart-wrap").data(["chart-wrap"]); // svg:g
          _var.g.exit().remove();
          _var.g = _var.g.enter().append('g').attr('class', "chart-wrap").merge(_var.g);

          // Update inner dimensions
          _var.g.attr("transform", `translate(${_var.margin.left},${_var.margin.top})`).attr('clip-path', 'url(#clip-path-'+_var._id+')');

          // Draw g
          _var.gClip = _var.wrap.selectAll("g.chart-wrap-clip").data(["chart-wrap-clip"]); // svg:g
          _var.gClip.exit().remove();
          _var.gClip = _var.gClip.enter().insert('g',':first-child').attr('class', "chart-wrap-clip").merge(_var.gClip);

          // Update inner dimensions
          _var.gClip.attr("transform", `translate(${_var.margin.left},${_var.margin.top})`);

          // Draw defs
          _var.defs = _var.wrap.selectAll("defs.svg-defs").data(["svg-defs"]);
          _var.defs.exit().remove();
          _var.defs = _var.defs.enter().insert('defs',':first-child').attr("class", "svg-defs").merge(_var.defs);

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
