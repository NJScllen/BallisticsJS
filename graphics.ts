interface ChartElement extends Snap.Element {
    scale: number;
}

interface Size {
    width: number;
    height: number;
}

interface Axis {
    axisX: Snap.Element;
    axisY: Snap.Element;
    arrowX?: Snap.Element;
    arrowY?: Snap.Element;
}

interface AxisLabels {
    x: string;
    y: string;
}

interface Point {
    x: number;
    y: number;
}

interface ImportantPoints {
    start: Point;
    highest: Point;
    end: Point;
}

type Dependency = (arg: number) => number

(function () {
    var graphics : any = {};

    /**
     * Draws chart from two coordinate functions.
     * @function drawChart
     * @param {Dependency}      dep function, providing y coordinate from x
     * @param {ImportantPoints} impoints starting, highest and ending point
     * @param {Snap.Paper}      canvas canvas to draw on
     * @param {graphUtils.Size} paperSize size of the canvas
     * @param {?number}         fields fields around the canvas
     *
     * @returns {Snap.Element} drawn path
     */
    graphics.drawChart = function (dep: Dependency, impoints: ImportantPoints,
        paper: Snap.Paper, paperSize: Size, fields: number = 10): ChartElement {

        let pathAttrs: object = {
            "stroke-width": 1,
            "stroke": "#5389e0"
        };
        let scale: number = (Math.max(impoints.highest.y, impoints.end.x) + (fields * 2))
            /
            (paperSize.width - (fields * 2));
        let points: Point[] = [];
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
                if (a.x > b.x) return 1;
                if (a.x < b.x) return -1;
                return 0;
            });
        }

        let pathString = `M ${fields} ${fields} R `;
        points.forEach((p) => {
            pathString = pathString.concat(`${(p.x * scale) + fields} ${paperSize.height - (p.y * scale) - fields} `);
        });
    
        let path: any = paper.path(pathString).attr(pathAttrs);
        path.scale = scale;
        return path as ChartElement;
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
    graphics.drawAxis = function (canvas: Snap.Paper, size: Size, scale: number,
        labels: AxisLabels = {x: "", y: ""}, fields: number = 10): Axis {

        let axisparams: object = {
            "stroke-width": "2",
            "stroke": "#000",
            "stroke-opacity": "0.7"
        }
        
        let x = canvas.line(fields - 2, size.height - fields, size.width - fields, size.height - fields).attr(axisparams);
        let y = canvas.line(fields, fields - 2, fields, fields).attr(axisparams);
        let xa = canvas.polyline([size.width - fields - 3, size.height - fields - 2,
        size.width - fields, size.height - fields,
        size.width - fields - 3, size.height - fields + 2]).attr(axisparams);
        let ya = canvas.polyline([fields - 2, fields + 3, fields, fields, fields + 2, fields + 3]).attr(axisparams);

        return { axisX: x, axisY: y, arrowX: xa, arrowY: ya };
    };

    /**
     * Draws markers showing coordinates of the specific point
     * @function drawScale
     * @param {Snap.Paper}  canvas canvas to draw on
     * @param {Point}       point point which needs to be marked
     * @param {number}      fields fields around the canvas
     *
     * @returns {Axis} axis object, containing lines to both axis
     */
    graphics.drawScale = function (canvas: Snap.Paper, point: Point, fields: number = 10): Axis {
        //TODO

        throw new Error("Not implemented");
    };

    (window as any).graphics = graphics;
})();