"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var svg = require("svg.js");
var graphUtils = require("./graphUtils");
/**
 * Draws graph from two coordinate functions
 * @function draw
 * @param {TimeFunction} funcX function, providing x coordinate
 * @param {TimeFunction} funcY function, providing y coordinate
 * @param {svgjs.Doc} canvas canvas to draw on
 * @param {number} fields fields around the canvas
 */
function draw(funcX, funcY, canvas, fields) {
    if (fields === void 0) { fields = 10; }
    var w = canvas.width() - fields;
    var h = canvas.height();
    var pathArr = [];
    graphUtils.drawAxis(canvas, fields);
    pathArr.push(['M', fields, fields]);
    for (var i = 0; i < w; i++) {
        var x = funcX(i);
        var y = h - funcY(i);
        var cpx = (pathArr[pathArr.length - 1][pathArr.length - 2] - fields + x) / 2;
        var cpy = (pathArr[pathArr.length - 1][pathArr.length - 1] + fields + y) / 2;
        pathArr.push(['Q', cpx + fields, cpy - fields, x + fields, y - fields]);
        if (x > 0 && y === 0) {
            break;
        }
    }
    var path = new svg.PathArray(pathArr);
    canvas.path(path).attr({ fill: "#4286f4" });
    return canvas;
}
//# sourceMappingURL=app.js.map