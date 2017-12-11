/**
 * Class, representing GUI, related to concrete chart.
 */
class ChartGui {
    public static template: string;

    /**
    * Gui in the presentation of JQuery set.
    */
    public gui: JQuery<HTMLElement>;
    public id: number | string;

    set color(value: string) {
        this.gui.find(consts.COLOR_SHOW_CLASS).css("background-color", value);
    }
    get color() {
        return this.gui.find(consts.COLOR_SHOW_CLASS).css("background-color");
    }

    constructor(id: number | string) {
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

    append(list: JQuery<HTMLElement>): void {
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