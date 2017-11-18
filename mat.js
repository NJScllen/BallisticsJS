var mat = {};
var impoints = {
  start : {},
  highest : {},
  end : {}
};

let grav = 9.8;
let eul = Math.E;

function getYox (casen, ChartParams){

	var vo = ChartParams.velocity;
	var alpha = ChartParams.angle / 57.2958; 
	var m = ChartParams.mass; 
	var k = ChartParams.coefficent; 
	
	switch(casen) {
	case 0:
	
		function yox( x ) {
			return (Math.tan(alpha) * x) - ( ( 0,5 * grav * x * x ) / ( vo * vo * Math.cos(alpha) * Math.cos(alpha) ) );
		}
		
		return (yox);
		
		break;
		
    case 1:
    
        function yokm( x ) {
			var tvar = Math.log( (x * k)/(- vo * Math.cos(alpha) * m) + 1 ) * ((-m)/k);
			return (m/k) * ( ( vo * Math.sin(alpha) + ((m * grav)/k) ) * ( 1 - Math.pow(eul, ((-k)/m)*tvar )) - grav * tvar );
		}
		
		return (yokm);
		
        break;
        
    case 2:
        
        function yor(x) {
        	return (x);
        }
        
        return (yor);
        
        break;
          
        
          default:
          function yoo(x) {
        	return (x);
        }
        
        return (yoo);
	}

}

function getImp (casen, yox, ChartParams) {

	var vo = ChartParams.velocity;
	var alpha = ChartParams.angle / 57.2958; 
	var m = ChartParams.mass; 
	var k = ChartParams.coefficent; 
	var tmaxSec = ( (-m) * Math.log(1) ) / k;
	
	switch(casen) {
	case 0:
	
		impoints.start.x = 0;
		impoints.end.x = (vo * vo * Math.sin(2*alpha)) / grav;
		impoints.highest.x = impoints.end.x / 2;
	
		impoints.start.y = 0;
		impoints.highest.y = (vo * vo * Math.sin(alpha) * Math.sin(alpha)) / (2 * grav);
		impoints.end.y =  0;
		
		return(impoints);
		
		break;
	
	case 1:
		
		impoints.start.x = 0;
      	impoints.end.x = (vo * Math.cos(alpha) * m ) / k;
		impoints.highest.x = impoints.end.x / 2;
		
		impoints.start.y = 0;
		impoints.highest.y = yox(impoints.highest.x);
		impoints.end.y =  yox(impoints.end.x);
		
		return(impoints);
		
		break;
		
	case 2:
		
		impoints.start.x = 0;
		impoints.highest.x = 1;
		impoints.end.x = 2;
		
		impoints.start.y = 0;
		impoints.highest.y = yox(impoints.highest.x);
		impoints.end.y =  yox(impoints.end.x);
		
		return(impoints);
		
		break;
		
	default: 
	
		impoints.start.x = 0;
		impoints.highest.x = 1;
		impoints.end.x = 2;
		
		impoints.start.y = 0;
		impoints.highest.y = yox(impoints.highest.x);
		impoints.end.y =  yox(impoints.end.x);
		
		return(impoints);
		
	}
	
}

mat.getYox = getYox;
mat.getImp = getImp;

