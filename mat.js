var mat;
(function (mat) {
    const grav = 9.8;
    function getDependancy(params) {
        switch (params.chartType) {
            case 0:
                {
                    let dep = (x) => {
                        let t = x / (params.velocity * Math.cos(params.angle));
                        return /*params.startY +*/ (params.velocity * Math.sin(params.angle) * t) - (grav * Math.pow(t, 2)) / 2;
                    };
                    let tfly = (2 * params.velocity * Math.sin(params.angle)) / (grav);
                    dep.imppoints = {
                        start: { x: 0, y: /*params.startY*/ 0 },
                        end: { x: dep(tfly), y: 0 },
                        highest: {
                            x: params.velocity * Math.cos(params.angle) * (tfly / 2),
                            y: (Math.pow(params.velocity, 2) * Math.pow(Math.sin(params.angle), 2)) / (2 * grav)
                        }
                    };
                    return dep;
                }
                ;
            default: throw new Error("not implemented");
        }
    }
    mat.getDependancy = getDependancy;
})(mat || (mat = {}));
