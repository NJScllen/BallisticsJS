var mat = {};
var impoints {};

let grav = 9,8;

var vo = <?>; //TODO add input
var aplha = <?>; //TODO add input
var m = <?>; //TODO add input
var k = <?>; //TODO and input
var eul = Math.E;

/* TODO remove
function xot( t ) {
	return t * vo * Math.cos(alpha);
}

function yot( t ) {
	return t * vo * Math.sin(alpha) - (grav * t * t) * 0,5;
}
*/

impoints.staPnt = 0; //TODO make customizable

function yox( x ) {
	return Math.tan(alpha) * x - ( 0,5 * grav * x * x ) / ( vo * vo * Math.cos(alpha) * Math.cos(alpha) );
}

function yokm( x ) {
	var tvar = Math.log( (x - (vo * Math.cos(alpha) * m) / k) / ((vo * Math.cos(alpha) * m) / k) ) * ((-m)/k);
	return (m/k) * ( ( vo * Math.sin(alpha) + ((m * grav)/k) ) * ( 1 - Math.pow(eul, ((-k)/m)*tvar ) - grav * tvar );
}

var tmaxSec = ( (-m) * Math.log(1) ) / k;

mat.sendFirst = function(paper, paperSize, fields, scale){
	impoints.midPnt = vo / grav;
	impoints.endPnt =  2 * midPnt;
	
	graphics.drawChart(yox, impoints, paper, paperSize, fields, scale);
}

mat.sendSecond = function(paper, paperSize, fields, scale){
	impoints.endPnt = vo * Math.cos(alpha) * m * (1 - Math.pow( eul, ((-k)*tmaxSec)/m )	);
	impoints.midPnt = impoints.endPnt / 2;
	
	graphics.drawChart(yokm, impoints, paper, paperSize, fields, scale);
}
