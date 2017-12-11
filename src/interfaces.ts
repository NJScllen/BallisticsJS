/**
* Represents all data, which is required to build a chart.
*/
interface ChartParams {
    chartType: ChartType;
    velocity: number;
    angle: number;
    mass: number;
    coefficent: number; //TODO: replace with radius
    startY: number;
}

/**
* Represents item in table id, binding gui with chart.
*/
interface IdItem {
    gui: ChartGui;
    chart?: Chart;
}

/**
* Table, containing chart-gui items.
*/
interface IdTable {
    [id: number]: IdItem;
}