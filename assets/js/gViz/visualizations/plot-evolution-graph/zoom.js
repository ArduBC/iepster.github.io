// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var = null;
  var components = {};

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

          // Zoom functions
          _var.zoom_actions = function(){

            if (d3.event != null && d3.event.transform != null) {

              // Update X transform based on data bounds
              if((_var.width * d3.event.transform.k) + d3.event.transform.x < _var.width) {
                d3.event.transform.x = -(_var.width * d3.event.transform.k) + (_var.width);
              } else if(d3.event.transform.x > 0) {
                d3.event.transform.x = 0;
              }

              // Update Y transform based on data bounds
              if((_var.height * d3.event.transform.k) + d3.event.transform.y < _var.height + _var.margin.top) {
                d3.event.transform.y = -(_var.height * d3.event.transform.k) + (_var.height + _var.margin.top);
              } else if(d3.event.transform.y > _var.margin.top) {
                d3.event.transform.y = _var.margin.top;
              }

              // Update X Scale and axis based on its format
              _var._x = d3.event.transform.rescaleX(_var.x);
              _var.x_axis.call(_var.xAxis.scale(_var._x));

              // Update Y Scale and axis based on its format
              _var._y = d3.event.transform.rescaleY(_var.y);
              _var.y_axis.call(_var.yAxis.scale(_var._y));

              // Update elements
              _var.gE.selectAll(".chart-elements .element-group")
                .attr("transform", function (d) { return `translate(${_var._x(+d._values.x)},${_var._y(+d._values.y)})`; })

              // Update Track circles
              _var.gE.selectAll(".chart-track-elements .track-circle")
                .attr("transform", function(d) { return `translate(${_var._x(+d.x)},${_var._y(+d.y)})`; })

              // Update Track elements
              _var.gE.selectAll(".chart-track-elements .track-path")
                .attr("d", function(d) {

                  var path = 'M ' + _var.trackValues
                    .sort(function(a,b) { return d3.ascending(+a._tValue, +b._tValue); })
                    .map(function(d) { return `${_var._x(+d.x)} ${_var._y(+d.y)}`; })
                    .join(' ');

                  return _var.trackValues.length === 0 ? null : path;
                })

              // Set zoom transform
              _var.zoomTransform = d3.event.transform;

            }

          }

          // Add zoom capabilities
          _var.zoom_handler = d3.zoom()
            .scaleExtent([1,3])
            .on("zoom", _var.zoom_actions)
            .on("start", function() { _var.wrap.classed('grabbing', true) })
            .on("end",   function() { _var.wrap.classed('grabbing', false) });

          // Bind zoom to svg
          _var.wrap
            .call(_var.zoom_handler)
            .call(_var.zoom_handler.transform, d3.zoomIdentity.translate(_var.zoomTransform.x, _var.zoomTransform.y).scale(_var.zoomTransform.k))

          // Disable zoom for desktop mode
          if(_var.screenMode === 'desktop') { _var.wrap.on("wheel.zoom", null); }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','components'].forEach(function (key) {

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
