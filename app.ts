interface ChartParams {
    chartType: ChartType;
    velocity: number;
    angle: number;
    mass: number;
    coefficent: number;
    startY: number;
}

interface IdItem {
    gui: ChartGui;
    chart?: Chart;
}

interface IdTable {
    [id: number]: IdItem;
}

enum ChartType { noResistance, proportional, squareProportional }

enum InputOrder { velocity, angle, mass, coefficent, startY}

class GraphChart {
    public readonly path: graphics.ChartElement;
    public readonly axis?: graphics.Axis;
    public readonly lines: graphics.PointLines;

    constructor(dep: graphics.Dependency, impoints: graphics.ImportantPoints,
    paper: Snap.Paper, paperSize: graphics.Size, fields: number = 20, scale?: number) {
        let t = graphics.drawChart(dep, impoints, paper, paperSize, fields, scale);
        Chart.scale = t.scale;
        this.path = t;
        if (scale)
            this.axis = graphics.drawAxis(paper, paperSize, Chart.scale);
        this.lines = graphics.drawScale(paper, paperSize, impoints.highest, Chart.scale, fields);
    }
}

class Chart {
    public static scale: number = 0;
    public static gravAcc: number = 9.8;
    public static paper: Snap.Paper;
    public static size: graphics.Size;

    public type: ChartType;
    public autoInvalidate: boolean = false;
    private _chart: GraphChart;
    private _coefficent: number;
    private _velocity: number;
    private _angle: number;
    private _startY?: number;
    private _mass: number;
    private _color: string;

    get chart(): GraphChart { return this._chart };
    get color(): string { return this._color };

    get coefficent(): number { return this._coefficent };
    set coefficent(value: number) {
        this._coefficent = value;
        if (value > 1) this._coefficent = 1;
        if (value < 0) this._coefficent = 0;
        this.invalidate();
    }

    get velocity(): number { return this._velocity };
    set velocity(value: number) {
        if (value <= 0) throw new Error("Invalid property value");
        this._velocity = value;
        this.invalidate();
    }

    get angle(): number { return this._angle };
    set angle(value: number) {
        if (value <= 0 || value >= 90) throw new Error("Invalid property value");
        this._angle = value;
        this.invalidate();
    }

    get startY(): number { return this._startY };
    set startY(value: number) {
        this._startY = value;
        if (value < 0) this._startY = 0; 
        this.invalidate();
    }

    get mass(): number { return this._mass };
    set mass(value: number) {
        if (value <= 0) throw new Error("Invalid property value");
        this._mass = value;
        this.invalidate();
    }

    set parameters(value: ChartParams) {
        this.type = value.chartType;
        this.angle = value.angle;
        this.coefficent = value.coefficent;
        this.velocity = value.velocity;
        this.mass = value.mass;
        this.startY = value.startY; 
    }
    get parameters(): ChartParams {
        return {
            angle: this._angle,
            chartType: this.type,
            coefficent: this._coefficent,
            mass: this._mass,
            startY: this._startY,
            velocity: this._velocity
        };
    }

    private static getRandomColor(): string {
        const LETTERS = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++)
            color += LETTERS[Math.floor(Math.random() * 16)];
        return color;
    };

    private invalidate(): void {
        if (this.autoInvalidate)         
            this.draw();        
    }

    constructor(params: ChartParams) {
        this.parameters = params;
        this.draw();
    }

    draw() : void {
        this.erase();
        let dep = mat.getYox(this.type, Chart.gravAcc, this._velocity, this._angle, this._coefficent, this._mass);
        let imp = mat.getImp(this.type, Chart.gravAcc, this._velocity, this._angle, this._coefficent, this._mass);
        //TODO: make color generating
        if (!this._color)
            this._color = Chart.getRandomColor();
        if (!Chart.scale) {
            this._chart = new GraphChart(dep, imp, Chart.paper, Chart.size);
            Chart.scale = this._chart.path.scale;
        } else
            this._chart = new GraphChart(dep, imp, Chart.paper, Chart.size, 20, Chart.scale);
        this._chart.path.attr({"stroke": this._color});
    }

    erase(): void {
        for (var k in Object.keys(this.chart.axis))
            this.chart.axis[k].remove();
        for (var k in Object.keys(this.chart.lines))
            this.chart.lines[k].remove();
        this.chart.path.remove();
    }
}

class ChartGui {
    public static template: string;

    public gui: JQuery<HTMLElement>;
    public id: number|string;

    set color(value: string) {
        this.gui.find(consts.COLOR_SHOW_CLASS).css("background-color", value);
    }
    get color() {
        return this.gui.find(consts.COLOR_SHOW_CLASS).css("background-color");
    }

    constructor(id: number|string) {
        this.id = id;
        let gui = $(ChartGui.template);
        gui.first().attr("id", `desc-${id}`);

        gui.find(".md-radio").each((i, el) => {
            el.firstElementChild.id = `rb-${id}-${i}`;
            (<HTMLInputElement>el.firstElementChild).name = `gr-${id}`;
            (<HTMLLabelElement>el.lastElementChild).htmlFor = `rb-${id}-${i}`;
        });

        gui.find(".input-box").each((i, el) => {
            (<HTMLLabelElement>el.firstElementChild).htmlFor = `tb-${id}-${i}`;
            el.lastElementChild.id = `tb-${id}-${i}`;
            (<HTMLInputElement>el.lastElementChild).name = `tb-${id}`;
        });

        gui.find(consts.DELETE_BTN_CLASS).attr("id", `btn-delete-${id}`);

        this.gui = gui;
    }

    append(list: JQuery<HTMLElement>) : void {
        list.append(this.gui);
    }

    getParams(): ChartParams {
        let chartTypeId: string = this.gui.find('.md-radio').find(':checked').attr('id');
        let t: ChartType = +chartTypeId.slice(chartTypeId.lastIndexOf('-') + 1);
        let v = +this.gui.find(`#tb-${this.id}-${InputOrder.velocity}`).val();
        let a = +this.gui.find(`#tb-${this.id}-${InputOrder.angle}`).val();
        let m = +this.gui.find(`#tb-${this.id}-${InputOrder.mass}`).val();
        let c = +this.gui.find(`#tb-${this.id}-${InputOrder.coefficent}`).val();
        let s = +this.gui.find(`#tb-${this.id}-${InputOrder.startY}`).val();

        return { angle: a, chartType: t, coefficent: c, mass: m, startY: s, velocity: v };
    }
}

class Manager {
    public validated: boolean = true;
    private table: IdTable = {};
    private list: JQuery<HTMLElement>;

    get items(): IdTable { return this.table };

    constructor(list: JQuery<HTMLElement>) {
        this.list = list;
    }

    private generateId(): number {
        for (var i = 0; i < 20; i++) {
            if (!this.table[i])
                return i;
        }
        throw new Error("All id occupied");
    }   

    add() : void;
    add(id: number | string) : void;
    add(id?: number | string): void {
        if (!id)
            id = this.generateId();
        let g = new ChartGui(id);
        g.append(this.list);
        this.table[id] = { gui: g };
    }

    remove(id: number|string): void {
        let item: IdItem = this.table[id];
        if (!item)
            return;
        if (item.chart)
            item.chart.erase();
        item.gui.gui.remove();
        delete this.table[id];
    }

    createOrModifyChart(id: number|string) : void {
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

    createOrModifyAll() : void {
        for (var id in Object.keys(this.table))
            this.createOrModifyChart(id);
    }

    refreshCharts(): void {
        for (var id in Object.keys(this.table)) {
            if (this.table[id].chart) {
                let ch = this.table[id].chart;
                ch.draw();
            };
        };    
    }
}

namespace consts {
    export const COLOR_SHOW_CLASS = ".color-show";
    export const LIST_ID = "#chart-list";
    export const DRAW_BTN_ID = "#btn-draw";
    export const ADD_BTN_ID = "#btn-add";
    export const EXPORT_BTN_ID = "#btn-export";
    export const DELETE_BTN_CLASS = ".btn-delete";
}

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

    }
    rebind();

    $(consts.ADD_BTN_ID).click((e) => {
        manager.add();
        rebind();
    });

    $(document).resize((e) => {
        Chart.scale = 0;
        resizePaper();
        manager.refreshCharts();
    })
});

