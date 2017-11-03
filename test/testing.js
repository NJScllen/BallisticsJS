$(document).ready(function(e) {
  let d = (x) => x^2;
  let p = {
      start: { x: 0, y: 0},
      highest: { x: 9, y: 11},
      end: {x: 10, y: 8}
  };
  let canvas = $("#canvas");
  let paper = Snap("#canvas");
  
  let size = { width: canvas.width(), height: canvas.height()};
  
  let chart = graphics.drawChart(d, p, paper, size);
  graphics.drawAxis(paper, size, chart.scale, { x: "x", y: "y" });
  graphics.drawScale(paper, size, p.highest, chart.scale);
});