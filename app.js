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
        //if (!scale)
        this.axis = graphics.drawAxis(paper, paperSize, Chart.scale, { x: 'x', y: 'y' });
        //this.lines = graphics.drawScale(paper, paperSize, impoints.highest, Chart.scale, fields);
    }
}
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
        /*let dep = mat.getYox(this.type, this.parameters);
        let imp = mat.getImp(this.type, dep, this.parameters);*/
        let dep = mat.getDependancy(this.parameters);
        let imp = dep.imppoints;
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
        if (this._chart.axis)
            Object.getOwnPropertyNames(this._chart.axis).forEach((k, i) => {
                this._chart.axis[k].remove();
            });
        /*Object.getOwnPropertyNames(this._chart.lines).forEach((k, i) => {
            this._chart.lines[k].remove();
        })*/
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
var consts;
(function (consts) {
    consts.COLOR_SHOW_CLASS = ".color-show";
    consts.LIST_ID = "#chart-list";
    consts.DRAW_BTN_ID = "#btn-draw";
    consts.ADD_BTN_ID = "#btn-add";
    consts.EXPORT_BTN_ID = "#btn-export";
    consts.DELETE_BTN_CLASS = ".btn-delete";
})(consts || (consts = {}));
$(document).ready(function () {
    let list = $(consts.LIST_ID);
    let svg = $('#canvas');
    ChartGui.template = list.html();
    list.html("");
    let manager = new Manager(list);
    manager.add(0);
    Chart.paper = Snap("#canvas");
    let resizePaper = () => Chart.size = { width: svg.width(), height: svg.height() };
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
    $(window).resize((e) => {
        Chart.scale = 0;
        resizePaper();
        manager.refreshCharts();
    });
});
