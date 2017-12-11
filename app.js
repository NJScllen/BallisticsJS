$(document).ready(function () {
    let list = $(consts.LIST_ID);
    let svg = $('#canvas');
    ChartGui.template = list.html();
    list.html("");
    let manager = new Manager(list);
    manager.add(0);
    Chart.paper = Snap("#canvas");
    let resizePaper = () => {
        Chart.size = { width: svg.width(), height: svg.height() };
    };
    resizePaper();
    $(consts.DRAW_BTN_ID).click((e) => {
        manager.createOrModifyAll();
    });
    let rebind = () => {
        $(consts.DELETE_BTN_CLASS).click((e) => {
            let id = e.target.id.slice(e.target.id.lastIndexOf('-') + 1);
            manager.remove(id);
        });
    };
    rebind();
    $(consts.ADD_BTN_ID).click((e) => {
        manager.add();
        rebind();
    });
    let axis;
    const LABELS = { x: 'x', y: 'y' };
    $(window).resize((e) => {
        Chart.scale = 0;
        resizePaper();
        manager.refreshCharts();
        if (!!axis)
            Object.getOwnPropertyNames(axis).forEach((k) => axis[k].remove());
        axis = graphics.drawAxis(Chart.paper, Chart.size, Chart.scale, LABELS);
    });
});
class Chart {
    constructor(params) {
        this.autoInvalidate = false;
        this.parameters = params;
        this.draw();
    }
    get chart() { return this._chart; }
    ;
    get color() { return this._color; }
    ;
    get coefficent() { return this._coefficent; }
    ;
    set coefficent(value) {
        this._coefficent = value;
        if (value > 1)
            this._coefficent = 1;
        if (value < 0)
            this._coefficent = 0;
        this.invalidate();
    }
    get velocity() { return this._velocity; }
    ;
    set velocity(value) {
        if (value <= 0)
            throw new Error("Invalid property value");
        this._velocity = value;
        this.invalidate();
    }
    get angle() { return this._angle; }
    ;
    set angle(value) {
        if (value <= 0 || value >= 90)
            throw new Error("Invalid property value");
        this._angle = value;
        this.invalidate();
    }
    get startY() { return this._startY; }
    ;
    set startY(value) {
        this._startY = value;
        if (value < 0)
            this._startY = 0;
        this.invalidate();
    }
    get mass() { return this._mass; }
    ;
    set mass(value) {
        if (value <= 0)
            throw new Error("Invalid property value");
        this._mass = value;
        this.invalidate();
    }
    set parameters(value) {
        this.type = value.chartType;
        this.angle = value.angle;
        this.coefficent = value.coefficent;
        this.velocity = value.velocity;
        this.mass = value.mass;
        this.startY = value.startY;
    }
    get parameters() {
        return {
            angle: this._angle,
            chartType: this.type,
            coefficent: this._coefficent,
            mass: this._mass,
            startY: this._startY,
            velocity: this._velocity
        };
    }
    get bounds() {
        return { x: this._points.end.x, y: this._points.highest.y };
    }
    static getRandomColor() {
        const LETTERS = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++)
            color += LETTERS[Math.floor(Math.random() * 16)];
        return color;
    }
    ;
    invalidate() {
        if (this.autoInvalidate)
            this.draw();
    }
    draw() {
        if (!!this._chart)
            this.erase();
        let dep = mat.getYox(this.type, this.parameters);
        let imp = mat.getImp(this.type, dep, this.parameters);
        this._points = imp;
        if (!this._color)
            this._color = Chart.getRandomColor();
        if (!Chart.scale) {
            this._chart = new GraphChart(dep, imp, Chart.paper, Chart.size);
            Chart.scale = this._chart.path.scale;
        }
        else
            this._chart = new GraphChart(dep, imp, Chart.paper, Chart.size, 20, Chart.scale);
        this._chart.path.attr({ "stroke": this._color });
    }
    erase() {
        Object.getOwnPropertyNames(this._chart.lines).forEach((k, i) => {
            this._chart.lines[k].remove();
        });
        this.chart.path.remove();
    }
}
Chart.scale = 0;
Chart.gravAcc = 9.8;
class ChartGui {
    set color(value) {
        this.gui.find(consts.COLOR_SHOW_CLASS).css("background-color", value);
    }
    get color() {
        return this.gui.find(consts.COLOR_SHOW_CLASS).css("background-color");
    }
    constructor(id) {
        this.id = id;
        let gui = $(ChartGui.template);
        gui.first().attr("id", `desc-${id}`);
        gui.find(".md-radio").each((i, el) => {
            el.firstElementChild.id = `rb-${id}-${i}`;
            el.firstElementChild.name = `gr-${id}`;
            el.lastElementChild.htmlFor = `rb-${id}-${i}`;
        });
        gui.find(".input-box").each((i, el) => {
            el.firstElementChild.htmlFor = `tb-${id}-${i}`;
            el.lastElementChild.id = `tb-${id}-${i}`;
            el.lastElementChild.name = `tb-${id}`;
        });
        gui.find(consts.DELETE_BTN_CLASS).attr("id", `btn-delete-${id}`);
        this.gui = gui;
    }
    append(list) {
        list.append(this.gui);
    }
    getParams() {
        let chartTypeId = this.gui.find('.md-radio').find(':checked').attr('id');
        let t = +chartTypeId.slice(chartTypeId.lastIndexOf('-') + 1);
        let v = +this.gui.find(`#tb-${this.id}-${InputOrder.velocity}`).val();
        let a = +this.gui.find(`#tb-${this.id}-${InputOrder.angle}`).val();
        let m = +this.gui.find(`#tb-${this.id}-${InputOrder.mass}`).val();
        let c = +this.gui.find(`#tb-${this.id}-${InputOrder.coefficent}`).val();
        let s = +this.gui.find(`#tb-${this.id}-${InputOrder.startY}`).val();
        return { angle: a, chartType: t, coefficent: c, mass: m, startY: s, velocity: v };
    }
}
var consts;
(function (consts) {
    consts.COLOR_SHOW_CLASS = ".color-show";
    consts.LIST_ID = "#chart-list";
    consts.DRAW_BTN_ID = "#btn-draw";
    consts.ADD_BTN_ID = "#btn-add";
    consts.EXPORT_BTN_ID = "#btn-export";
    consts.DELETE_BTN_CLASS = ".btn-delete";
})(consts || (consts = {}));
var ChartType;
(function (ChartType) {
    ChartType[ChartType["noResistance"] = 0] = "noResistance";
    ChartType[ChartType["proportional"] = 1] = "proportional";
    ChartType[ChartType["squareProportional"] = 2] = "squareProportional";
})(ChartType || (ChartType = {}));
var InputOrder;
(function (InputOrder) {
    InputOrder[InputOrder["velocity"] = 0] = "velocity";
    InputOrder[InputOrder["angle"] = 1] = "angle";
    InputOrder[InputOrder["mass"] = 2] = "mass";
    InputOrder[InputOrder["coefficent"] = 3] = "coefficent";
    InputOrder[InputOrder["startY"] = 4] = "startY";
})(InputOrder || (InputOrder = {}));
class GraphChart {
    constructor(dep, impoints, paper, paperSize, fields = 20, scale) {
        let t = graphics.drawChart(dep, impoints, paper, paperSize, fields, scale);
        Chart.scale = t.scale;
        this.path = t;
        this.lines = graphics.drawScale(paper, paperSize, impoints.highest, Chart.scale, fields);
    }
}
var graphics;
(function (graphics) {
    function drawScale(paper, paperSize, point, scale, fields = 20) {
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
        let yt = paper.text(fields - INDENT * (point.y.toString().length + 3), paperSize.height - (scale * point.y + fields - TEXT_INDENT), point.y.toFixed(2)).attr(textparams);
        let xt = paper.text(fields + point.x * scale - TEXT_INDENT * 2, paperSize.height - (fields - INDENT * 3), point.x.toFixed(2)).attr(textparams);
        return { lineX: x, lineY: y, textX: xt, textY: yt };
    }
    graphics.drawScale = drawScale;
    ;
    function drawChart(dep, impoints, paper, paperSize, fields = 20, scale) {
        let pathAttrs = {
            "stroke-width": 3,
            "stroke": "blue",
            "fill": "#FFF",
            "fill-opacity": 0
        };
        scale = scale | Math.round((Math.min(paperSize.width, paperSize.height) - (fields * 3))
            /
                (Math.max(impoints.highest.y, impoints.end.x)));
        let points = [];
        let c = (impoints.end.x - impoints.start.x) / 10;
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
    }
    graphics.drawChart = drawChart;
    ;
    function drawAxis(canvas, size, scale, labels = { x: "", y: "" }, fields = 20) {
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
    }
    graphics.drawAxis = drawAxis;
    ;
})(graphics || (graphics = {}));
;
class Manager {
    constructor(list) {
        this.validated = true;
        this.table = {};
        this.list = list;
    }
    get items() { return this.table; }
    ;
    generateId() {
        for (var i = 0; i < 20; i++) {
            if (!this.table[i])
                return i;
        }
        throw new Error("All id occupied");
    }
    add(id) {
        if (!id)
            id = this.generateId();
        let g = new ChartGui(id);
        g.append(this.list);
        this.table[id] = { gui: g };
    }
    remove(id) {
        let item = this.table[id];
        if (!item)
            return;
        if (item.chart)
            item.chart.erase();
        item.gui.gui.remove();
        delete this.table[id];
    }
    createOrModifyChart(id) {
        if (!this.table[id])
            return;
        if (!this.table[id].chart)
            this.table[id].chart = new Chart(this.table[id].gui.getParams());
        else {
            let ch = this.table[id].chart;
            ch.parameters = this.table[id].gui.getParams();
            ch.draw();
        }
        this.table[id].gui.color = this.table[id].chart.color;
    }
    createOrModifyAll() {
        for (var id in Object.keys(this.table))
            this.createOrModifyChart(id);
    }
    refreshCharts() {
        for (var id in Object.keys(this.table)) {
            if (this.table[id].chart) {
                let ch = this.table[id].chart;
                ch.draw();
            }
            ;
        }
        ;
    }
}
