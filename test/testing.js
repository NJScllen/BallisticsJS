let d = (x) => x - 3;
let p = {
    start: { x: 3, y: 0},
    highest: { x: 10, y: 7},
    end: {x: 10, y: 7}
};
let canvas = document.getElementById("canvas");
let paper = Snap("#canvas");
let size = { width: 800, height: 600};

let chart = graphics.drawChart(d, p, paper, size);
graphics.drawAxis(paper, size, chart.scale, { x: "x", y: "y" });
graphics.drawScale(paper, size, p.highest, chart.scale);