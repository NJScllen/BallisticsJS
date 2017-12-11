//doc generation command: typedoc --mode file --out ./docs ./

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

    }
    rebind();
    
    $(consts.ADD_BTN_ID).click((e) => {
        manager.add();
        rebind();
    });

    let axis: graphics.Axis;
    const LABELS: graphics.AxisLabels = { x: 'x', y: 'y' };
    $(window).resize((e) => {
        Chart.scale = 0;
        resizePaper();
        manager.refreshCharts();

        if (!!axis)
            Object.getOwnPropertyNames(axis).forEach((k) => axis[k].remove());
        axis = graphics.drawAxis(Chart.paper, Chart.size, Chart.scale, LABELS);
    })
});