///<reference path="graphics.ts"/>

enum ChartType { noResistance, proportional, squareProportional }

class GraphChart {
    public readonly path: Snap.Element;
    public readonly axis: Axis;
    public readonly lines: PointLines;

    constructor(dep: Dependency, impoints: ImportantPoints,
        paper: Snap.Paper, paperSize: Size, fields: number = 20, scale?: number) {

    }
}

class Chart {
    public static scale: number = 0;

    public type: ChartType;
    private coefficent: number;
    private velocity: number;
    private angle: number;
    private startY: number;
    private color: string;

    
}

$(document).ready(function () {


});