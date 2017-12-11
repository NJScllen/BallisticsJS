/**
 * Represents drawn chart.
 */
class GraphChart {
    public readonly path: graphics.ChartElement;
    public readonly axis?: graphics.Axis;
    public readonly lines: graphics.PointLines;

    constructor(dep: graphics.Dependency, impoints: graphics.ImportantPoints,
        paper: Snap.Paper, paperSize: graphics.Size, fields: number = 20, scale?: number) {
        let t = graphics.drawChart(dep, impoints, paper, paperSize, fields, scale);
        Chart.scale = t.scale;
        this.path = t;
        this.lines = graphics.drawScale(paper, paperSize, impoints.highest, Chart.scale, fields);
    }
}