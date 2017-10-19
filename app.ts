///<reference path="node_modules/svg.js/svg.js.d.ts"/>

/**
 *callback representing physical dependency
 *@callback TimeFunction
 *@param {number} time
 *@returns {number} coordinate
*/
type TimeFunction = (time: number) => number;

/**
 * @function
 * Draws graph from two coordinate functions
 * @param {TimeFunction} funcX
 * @param {TimeFunction} funcY
 */
function draw(funcX: TimeFunction, funcY: TimeFunction): void {
    //TODO
    
}