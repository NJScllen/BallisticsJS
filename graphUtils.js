"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Draws two axis on provided canvas.
 * @function drawAxis
 * @param {Snap.Paper} canvas canvas to draw on
 * @param {Size} size size of the canvas
 * @param {number} fields fields around the canvas
 * @returns {Axis} axis object, containing both axis
 */
function drawAxis(canvas, size, fields) {
    if (fields === void 0) { fields = 10; }
    var axisparams = {
        "stroke-width": "2",
        "stroke": "#000"
    };
    var x = canvas.line(fields - 2, size.height - fields, size.width - fields, size.height - fields).attr(axisparams);
    var y = canvas.line(fields, fields - 2, fields, fields).attr(axisparams);
    var xa = canvas.polyline([size.width - fields - 3, size.height - fields - 2,
        size.width - fields, size.height - fields,
        size.width - fields - 3, size.height - fields + 2]).attr(axisparams);
    var ya = canvas.polyline([fields - 2, fields + 3, fields, fields, fields + 2, fields + 3]).attr(axisparams);
    return { axisX: x, axisY: y, arrowX: xa, arrowY: ya };
}
exports.drawAxis = drawAxis;
/**
 * Draws markers showing coordinates of the specific point
 * @function drawScale
 * @param {Snap.Paper} canvas canvas to draw on
 * @param {Point} point point which needs to be marked
 * @param {number} fields fields around the canvas
 * @returns {Axis} axis object, containing lines to both axis
 */
function drawScale(canvas, point, fields) {
    //TODO
    if (fields === void 0) { fields = 10; }
    throw new Error("Not implemented");
}
exports.drawScale = drawScale;
