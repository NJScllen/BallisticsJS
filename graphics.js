(function () {
    var graphics = {};
    /**
     * Draws markers showing coordinates of the specific point
     * @function drawScale
     * @param {Snap.Paper}  canvas canvas to draw on
     * @param {Size}        paperSize size of the canvas
     * @param {Point}       point point which needs to be marked
     * @param {number}      scale scale of the chart
     * @param {number}      fields fields around the canvas
     *
     * @returns {Axis} axis object, containing lines to both axis
     */
    graphics.drawScale = function (paper, paperSize, point, scale, fields = 20) {
        let lineparams = {
            "stroke": "#afafaf",
            "stroke-dasharray": "5,5"
        };
        let textparams = {
            "font-family": "Segoe UI",
            "fill": "#afafaf"
        };
        const INDENT = 5;
        const TEXT_INDENT = 3;
        let x = paper.line(fields, paperSize.height - (point.y * scale + fields), point.x * scale + fields, paperSize.height - (point.y * scale + fields)).attr(lineparams);
        let y = paper.line(fields + point.x * scale, paperSize.height - fields, fields + point.x * scale, paperSize.height - (point.y * scale + fields)).attr(lineparams);
        let yt = paper.text(fields - INDENT * 3, paperSize.height - (scale * point.y + fields - TEXT_INDENT), point.y.toString()).attr(textparams);
        let xt = paper.text(fields + point.x * scale - TEXT_INDENT, paperSize.height - (fields - INDENT * 3), point.x.toString()).attr(textparams);
        return { lineX: x, lineY: y, textX: xt, textY: yt };
    };
    /**
     * Draws chart from two coordinate functions.
     * @function drawChart
     * @param {Dependency}      dep function, providing y coordinate from x
     * @param {ImportantPoints} impoints starting, highest and ending point
     * @param {Snap.Paper}      canvas canvas to draw on
     * @param {graphUtils.Size} paperSize size of the canvas
     * @param {?number}         fields fields around the canvas
     * @param {?number}			scale scale in pixels to use in chart
     *
     * @returns {Snap.Element} drawn path
     */
    graphics.drawChart = function (dep, impoints, paper, paperSize, fields = 20, scale) {
        let pathAttrs = {
            "stroke-width": 3,
            "stroke": "#5389e0",
            "fill": "#FFF"
        };
        scale = scale | Math.round((Math.min(paperSize.width, paperSize.height) - (fields * 2))
            /
                (Math.max(impoints.highest.y, impoints.end.x) + (fields * 2)));
        let points = [];
        let c = (impoints.end.x - impoints.start.x) / 10; //Chart will be constructed via 13 points
        points.push(impoints.start);
        for (var x = impoints.start.x + c; x <= impoints.end.x - c; x += c) {
            var y = dep(x);
            points.push({ x: x, y: y });
        }
        points.push(impoints.end);
        if (!points.some((p) => p.x === impoints.highest.x && p.y === impoints.highest.y)) {
            points.push(impoints.highest);
            points = points.sort((a, b) => {
                if (a.x > b.x)
                    return 1;
                if (a.x < b.x)
                    return -1;
                return 0;
            });
        }
        let pathString = `M ${impoints.start.x * scale + fields} ${paperSize.height - (impoints.start.y * scale + fields)} R `;
        points.forEach((p) => {
            pathString = pathString.concat(`${(p.x * scale) + fields} ${paperSize.height - (p.y * scale) - fields} `);
        });
        let path = paper.path(pathString).attr(pathAttrs);
        path.scale = scale;
        return path;
    };
    /**
     * Draws two axis on provided canvas.
     * @function drawAxis
     * @param {Snap.Paper}  canvas  canvas to draw on
     * @param {Size}        size    size of the canvas
     * @param {number}      scale   scale of a single segment
     * @param {AxisLabels}  labels  labels to write under the axis
     * @param {number}      fields  fields around the canvas
     *
     * @returns {Axis}  axis object, containing both axis
     */
    graphics.drawAxis = function (canvas, size, scale, labels = { x: "", y: "" }, fields = 20) {
        const INDENT = 5;
        const TEXT_INDENT = 4;
        const ARROW_HEIGHT = 6;
        const ARROW_WIDTH = 4;
        let axisparams = {
            "stroke-width": "3",
            "stroke": "#000",
        };
        let labelsparams = {
            "font-family": "Segoe UI"
        };
        let scaleparams = {
            "stroke-width": "2",
            "stroke": "#afafaf"
        };
        let x = canvas.line(fields - INDENT, size.height - fields, size.width - fields, size.height - fields).attr(axisparams);
        let y = canvas.line(fields, size.height - fields + INDENT, fields, fields).attr(axisparams);
        let xa = canvas.polyline([size.width - fields - ARROW_HEIGHT, size.height - fields - ARROW_WIDTH,
            size.width - fields, size.height - fields,
            size.width - fields - ARROW_HEIGHT, size.height - fields + ARROW_WIDTH]).attr(axisparams);
        let ya = canvas.polyline([fields - ARROW_WIDTH, fields + ARROW_HEIGHT,
            fields, fields, fields + ARROW_WIDTH,
            fields + ARROW_HEIGHT]).attr(axisparams);
        let xt = canvas.text(size.width - fields - TEXT_INDENT, size.height - fields + INDENT * 3, labels.x).attr(labelsparams);
        let yt = canvas.text(fields - INDENT * 3, fields + TEXT_INDENT, labels.y).attr(labelsparams);
        let xl = canvas.line(fields + scale, size.height - (fields - INDENT), fields + scale, size.height - (fields + INDENT)).attr(scaleparams);
        let yl = canvas.line(fields - INDENT, size.height - (fields + scale), fields + INDENT, size.height - (fields + scale)).attr(scaleparams);
        return { axisX: x, axisY: y, arrowX: xa, arrowY: ya, textX: xt, textY: yt, scaleLabelX: xl, scaleLabelY: yl };
    };
    window.graphics = graphics;
})();
