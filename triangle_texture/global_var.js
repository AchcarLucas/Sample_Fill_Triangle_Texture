var canvas 				= null;
var content 			= null;
var fps_controller 		= null;
var fps_range			= null;
var fps_count			= 0;
var fps_state			= 0;

var canvasData			= null;

var texture				= null;
var texture_data		= null;
	
var Mouse = {
	x : 0,
	y : 0,
	dragOffset : {
		x : 0,
		y : 0
	},
	drag : false
}