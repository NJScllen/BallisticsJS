/**
 * Facade, controling gui's, chart's and they graphic representation.
 */
class Manager {
    public validated: boolean = true;
    private table: IdTable = {};
    private list: JQuery<HTMLElement>;

    get items(): IdTable { return this.table };

    /**
     * @param list Html list containing chartGUI's to manage.
     */
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

    add(): void;
    add(id: number | string): void;
    add(id?: number | string): void {
        if (!id)
            id = this.generateId();
        let g = new ChartGui(id);
        g.append(this.list);
        this.table[id] = { gui: g };
    }

    remove(id: number | string): void {
        let item: IdItem = this.table[id];
        if (!item)
            return;
        if (item.chart)
            item.chart.erase();
        item.gui.gui.remove();
        delete this.table[id];
    }

    createOrModifyChart(id: number | string): void {
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

    createOrModifyAll(): void {
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
