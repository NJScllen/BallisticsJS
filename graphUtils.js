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
function drawAxis(canvas, size, fields = 10) {
    let axisparams = {
        "stroke-width": "2",
        "stroke": "#000",
        "stroke-opacity": "0.7"
    };
    let x = canvas.line(fields - 2, size.height - fields, size.width - fields, size.height - fields).attr(axisparams);
    let y = canvas.line(fields, fields - 2, fields, fields).attr(axisparams);
    let xa = canvas.polyline([size.width - fields - 3, size.height - fields - 2,
        size.width - fields, size.height - fields,
        size.width - fields - 3, size.height - fields + 2]).attr(axisparams);
    let ya = canvas.polyline([fields - 2, fields + 3, fields, fields, fields + 2, fields + 3]).attr(axisparams);
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
function drawScale(canvas, point, fields = 10) {
    //TODO
    throw new Error("Not implemented");
}
exports.drawScale = drawScale;
