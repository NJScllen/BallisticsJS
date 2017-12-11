/**
 * Represents chart with all it's data.
 */
class Chart {
    /**
    * scale, used to draw all charts
    */
    public static scale: number = 0;    //TODO: remake scaling
    /**
    * Gravitational acceleration
    * @todo make customizable
    */
    public static gravAcc: number = 9.8;
    public static paper: Snap.Paper;
    public static size: graphics.Size;

    public type: ChartType;
    /**
    * If this field is true - chart will automatically refresh when gets new value.
    */
    public autoInvalidate: boolean = false;
    private _chart: GraphChart;
    private _coefficent: number;
    private _velocity: number;
    private _angle: number;
    private _startY?: number;
    private _mass: number;
    private _color: string;
    private _points: graphics.ImportantPoints;

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

    get bounds(): graphics.Point {
        return { x: this._points.end.x, y: this._points.highest.y };
    }

    /**
     * Function, generating random color.
     * @returns {string} Color like "#AD9C12".
     */
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

    draw(): void {
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
        } else
            this._chart = new GraphChart(dep, imp, Chart.paper, Chart.size, 20, Chart.scale);
        this._chart.path.attr({ "stroke": this._color });
    }

    erase(): void {
        Object.getOwnPropertyNames(this._chart.lines).forEach((k, i) => {
            this._chart.lines[k].remove();
        })
        this.chart.path.remove();
    }
}