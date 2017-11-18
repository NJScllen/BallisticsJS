declare namespace mat {
    function getYox(type: ChartType, params: ChartParams): graphics.Dependency;
    function getImp(type: ChartType, dep: graphics.Dependency, params: ChartParams): graphics.ImportantPoints;
}