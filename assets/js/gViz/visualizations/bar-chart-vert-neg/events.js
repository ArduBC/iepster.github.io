// Imports
var d3 = require("d3");
var shared = require("../../shared/_init.js");

// Initialize the visualization class
module.exports = function () {
  "use strict";

  // Get attributes values
  var _var       = null;
  var action     = 'mouseover';
  var components = null;
  var node       = null;
  var type       = 'bar';

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

        // Run code
        case 'run':

          // Set strokes and bars
          var strokes = _var.g.select('.chart-elements').selectAll('.stroke')
          var bars    = _var.g.select('.chart-elements').selectAll('.bar')
          var symbols = _var.g.select('.chart-elements').selectAll('.symbol')

          switch (action) {

            case 'mouseover':

              // Fade strokes
              strokes.transition().style('opacity', function(g) { return g.x === node.x ? 1 : 0.2; })

              // Fade bars
              bars.transition()
                .style('opacity', function(g) { return g.x === node.x ? 1 : 0.2; })
                .style("filter", function(g) { return g === node ? "url(#"+_var.shadowId+")" : ""; })

              // Fade symbols
              symbols.transition()
                .style('opacity', function(g) { return g.x === node.x ? 1 : 0.2; })
                .style("filter", function(g) { return d3.select(this).classed('symbol-b') && g === node ? "url(#"+_var.shadowId+")" : ""; })

              // Get x and y values
              var x = _var.x(node.x) + _var.barWidth/2;
              var y = _var.getY(node.y);

              // Get left and top positions
              var left = _var.wrap.node().getBoundingClientRect().left +_var.margin.left + x;
              var top  = _var.wrap.node().getBoundingClientRect().top + _var.margin.top + y;

              // Set node color
              var nodeColor = node.stroke == null ? "#333" : node.stroke;

              // Initialize tooltip object
              var tooltipObj = { color: nodeColor  };

              // Set node attributes to tooltip obj
              Object.keys(node).forEach(function(k) { tooltipObj[k] = node[k]; });

              // Set x and y values with format
              tooltipObj.x = _var.xFormat(node.x);
              tooltipObj.y = _var.yFormat(node.y);
              tooltipObj.color = nodeColor;

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .body(_var.data.tooltip != null && _var.data.tooltip.body != null ? _var.data.tooltip.body : "")
                .borderColor(nodeColor)
                .left(left)
                .hasImg(_var.data.tooltip != null && _var.data.tooltip.hasImg === true)
                .muted(_var.data.tooltip != null && _var.data.tooltip.muted != null && _var.data.tooltip.muted === true)
                .obj(tooltipObj)
                .top(top)
                .title(_var.data.tooltip != null && _var.data.tooltip.title != null ? _var.data.tooltip.title : "")
                .run();

              break;

            case 'mouseout':

              // Reset opacity and filter
              strokes.transition().style('opacity', 1)
              bars.transition().style('opacity', 1).style("filter", "")
              symbols.transition().style('opacity', 1).style("filter", "")

              // Set bars component
              shared.visualComponents.tooltip()
                ._var(_var)
                .action("hide")
                .run();

              break;
          }

          break;
      }
    }

    return _var;
  };

  // Exposicao de variaveis globais
  ['_var','action','components','node','type'].forEach(function (key) {

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
