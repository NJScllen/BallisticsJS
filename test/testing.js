let d = (x) => x*x;
let p = {
    start: { x: 0, y: 1},
    highest: { x: 10, y: 100 },
    end: {x: 10, y: 100}
};
let paper = Snap("#canv");
let size = { width: 800, height: 600};

let chart = graphics.drawChart(d, p, paper, size);
graphics.drawAxis(paper, size, chart.scale);