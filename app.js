"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Draws chart from two coordinate functions.
 * @function drawChart
 * @param {TimeFunction} funcX function, providing x coordinate
 * @param {TimeFunction} funcY function, providing y coordinate
 * @param {number} landing the last x-coordinate of chart
 * @param {Snap.Paper} canvas canvas to draw on
 * @param {graphUtils.Size} size size of the canvas
 * @param {?number} fields fields around the canvas
 * @returns {Snap.Element} drawn path
 */
function drawChart(funcX, funcY, landing, canvas, size, fields = 10) {
    let pathAttrs = {
        "stroke-width": 1,
        "stroke": "#5389e0"
    };
    let points = [];
    let c = (size.width - (fields * 2)) / 10; //Calculing count of points (chart width / 10)
    for (var i = 0; i < size.width; i += c) {
        var x = funcX(i);
        var y = funcY(i);
        if (x === null /*|| y === null*/)
            break;
        points.push(`${x + fields} ${size.height - (y + fields)}`);
    }
    let lastPoint = points[points.length - 1]; //Checking if the last point is the end of the chart
    if (lastPoint.slice(lastPoint.lastIndexOf(" ")) !== "0")
        points.push(`${landing} 0`);
    let path = `M ${fields} ${fields} R `.concat(points.join(" ")); //composing a path
    return canvas.path(path).attr(pathAttrs);
}
