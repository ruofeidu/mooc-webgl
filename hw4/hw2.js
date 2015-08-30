"use strict";

var canvas, canvas_top;
var gl;

var PI = 3.14159265359;
var debug = false; 
var paths = [];
var lastLine = []; 

var zz = 2; 

if (debug){
	paths.push( [ [0.3, 0.4] ] );
	//paths.push( [ [0.0, 0.0], [1.0, 1.0] ] );
	//paths.push( [ [0.5, 0.1], [0.50002, 0.8] ] );
	//paths.push( [ [0.8, 0.5], [0.1, 0.5002], [0.1002, 0.8] ] );
	paths.push( [ [0.5, 0.1], [0.5, 0.2], [0.5, 0.8] ] );
	//paths.push( [ [(Math.cos(zz)+1)/2, (Math.sin(zz)+1)/2], [(Math.cos(zz+PI)+1)/2, ( Math.sin(zz+PI) + 1) / 2 ] ] ) ;
	//paths.push( [ [0.1, 0.5], [0.8, 0.5] ] );
	//paths.push( [ [0.4, 0.4], [0.8, 0.3], [0.8, 0.6], [0.125, 0.33] ] );
}

var points = [], colors = [];

var RENDER_FILL = 0, RENDER_GASKET = 1, RENDER_WIREFRAME = 2; 
var SHAPE_TRIANGLE = 0, SHAPE_SQUARE = 1, SHAPE_PENTAGON = 2; 
var PIc2 = PI / 2; 
var PIx2 = PI * 2; 
var PI23 = PI / 2 * 3; 
var deg2rad = PI / 180; 

var isMouseDown = false, mousePos = {x:0, y:0, z:0, w:0};

var para = {
	renderMode : RENDER_FILL,
	shape : SHAPE_TRIANGLE,
	
	animation : 0,
	scale : 1.0,
	twistDegree : 60,
	tessellationDegree: 5,

	lineWidth : 1,
	lineDivier : 480,
};


window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
	var parent = document.getElementById("one");
	canvas.width = parent.offsetWidth; 
	canvas.height = canvas.width;
	canvas.addEventListener("mousemove", handleMouseMove);
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "Please use a WebGL-enabled explorer such as Chrome." ); }
	clickColor("#993333",-19,162);

    reload();
    render();
};

function handleMouseMove(event) {
	if (isMouseDown) {
		var dot, eventDoc, doc, body, pageX, pageY;
		event = event || window.event; // IE-ism
		eventDoc = (event.target && event.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		if (event.pageX == null && event.clientX != null) {
			event.pageX = event.clientX +
			  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
			  (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY +
			  (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
			  (doc && doc.clientTop  || body && body.clientTop  || 0 );
		}

		mousePos.x = (event.pageX - canvas.getBoundingClientRect().left) / canvas.width; 
		mousePos.y = (event.pageY - canvas.getBoundingClientRect().top - body.scrollTop) / canvas.height;

		var color = document.getElementById("divpreview").style.backgroundColor; 
		color = color.substr(4, color.length-5); 
		var RGB = color.split(",");

		lastLine.push( [mousePos.x, 1.0 - mousePos.y, parseInt(RGB[0]) * 1.0 / 255.0, parseInt(RGB[1]) * 1.0 / 255.0, parseInt(RGB[2]) * 1.0 / 255.0 , para.lineWidth] ); 
		//console.log(mousePos); 
		reload(); 
	} else {
		
	}
}

document.onmousedown = function() { isMouseDown = true; mousePos.z = 1; mousePos.w = 1; 
if (!debug) {
	lastLine = []; 
	paths.push(lastLine); 
}

};
document.onmouseup   = function() { isMouseDown = false; mousePos.z = 0; mousePos.w = 0;  
if (!debug) {

}

};

window.onresize = function resize()
{
    canvas = document.getElementById( "gl-canvas" );
	var parent = document.getElementById("one");
	canvas.width = parent.offsetWidth; 
	canvas.height = canvas.width;
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "Please use a WebGL-enabled explorer such as Chrome." ); }

    reload();
    render();
};

function rgb2vec4(r, g, b) {
	return vec4(1.0 * r / 255, 1.0 * g / 255, 1.0 * b / 255, 1.0); 
}

function addPoint(point, delta, theta) {
	delta = delta || 0;
	theta = theta || 0;
	var deltaX = 0, deltaY = 0; 


	if (debug){
	deltaX = Math.cos(delta+theta) * para.lineWidth / para.lineDivier; 
	deltaY = Math.sin(delta+theta) * para.lineWidth / para.lineDivier; 
	}
	else 
	{
	deltaX = Math.cos(delta+theta) * point[5] / para.lineDivier; 
	deltaY = Math.sin(delta+theta) * point[5] / para.lineDivier; 

	}
	points.push( vec2((point[0] * 2) - 1.0 + deltaX, (point[1] * 2) - 1.0 + deltaY ) ); 
	colors.push( vec4(point[2], point[3], point[4], 1.0) ); 
}

function addRawPoint(p, c) {
	//console.log(p); 
	points.push( vec2(p[0]*2-1, p[1]*2-1) ); 
	colors.push( c ); 
}

function reload() {
	points = []; 
	colors = []; 
	var vertices = [], vertexColors = []; 

	for (var i in paths)
	{
		var path = paths[i]; 
		if (path === null || path.length === 0) continue; 
		if (path.length === 1) {
			//addPoint(path[0]);
			//addPoint(path[0]);
			 
			addPoint(path[0], PI + PIc2 / 2); 
			addPoint(path[0], PI - PIc2 / 2); 
			addPoint(path[0], PI * 2 - PIc2 / 2); 

			addPoint(path[0], PI - PIc2 / 2); 
			addPoint(path[0], PI * 2 - PIc2 / 2); 
			addPoint(path[0], PIc2 / 2); 
		} if (path.length === 2) {
			var color = vec4(path[0][2], path[0][3], path[0][4], 1.0); 
			var thickness = debug ? 5.0 / para.lineDivier : path[0][5] / para.lineDivier; 
			var p0 = vec2(path[0][0], path[0][1]), 
				p1 = vec2(path[1][0], path[1][1]), 
				line = subtract(p1, p0),
				normal = normalize( vec2(-line[1], line[0]) ); 
				
			normal[0] *= thickness; normal[1] *= thickness; 
			//console.log( p0, p1, normal); 
			addRawPoint( subtract(p0, normal), color ); 
			addRawPoint( add(p0, normal), color ); 
			addRawPoint( subtract(p1, normal), color ); 

			addRawPoint( add(p0, normal), color ); 
			addRawPoint( add(p1, normal), color ); 
			addRawPoint( subtract(p1, normal), color ); 
		}
		else {
			var color = vec4(path[0][2], path[0][3], path[0][4], 1.0); 
			var thickness = debug ? 5.0 / para.lineDivier : path[0][5] / para.lineDivier; 
			
			for (var j = 0; j < path.length-2; ++j) {
				var p0 = vec2(path[j][0], 	path[j][1]), 
					p1 = vec2(path[j+1][0], path[j+1][1]), 
					p2 = vec2(path[j+2][0], path[j+2][1]);
				//console.log(p0, p1, p2); 
				
				var line1 = subtract(p1, p0); 
				var normal1 = normalize( vec2(-line1[1], line1[0]) ); 
				var line2 = subtract(p2, p1); 
				var normal2 = normalize( vec2(-line2[1], line2[0]) ) ; 
				
				var tangent = normalize( add ( normalize( subtract(p2, p1) ) ,
											   normalize( subtract(p1, p0) ) ) ); 
				var miter = vec2( -tangent[1], tangent[0] ); 
				
				var miter_length = thickness / dot(miter, normal1); 
				if (dot(miter, normal1) < 1e-6) miter_length = thickness; 
				//console.log(miter, dot(miter, normal1)); 
				
				miter[0] = miter[0] * miter_length; 
				miter[1] = miter[1] * miter_length; 
				normal1[0] *= thickness; normal1[1] *= thickness; 
				normal2[0] *= thickness; normal2[1] *= thickness; 
				
				//console.log(normal1, normal2, tangent, miter); 
				
				addRawPoint( add(p0, normal1), color ); 
				addRawPoint( subtract(p1, miter), color ); 
				addRawPoint( subtract(p0, normal1), color ); 
	
				addRawPoint( add(p0, normal1), color ); 
				addRawPoint( add(p1, miter), color ); 
				addRawPoint( subtract(p1, miter), color ); 
				
				addRawPoint( add(p1, miter), color ); 
				addRawPoint( subtract(p2, normal2), color ); 
				addRawPoint( subtract(p1, miter), color ); 
				
				addRawPoint( add(p1, miter), color ); 
				addRawPoint( add(p2, normal2), color ); 
				addRawPoint( subtract(p2, normal2), color ); 
			}
		}
	}
	//console.log(points); 
	//console.log(colors); 

	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
	
	$("#statistics").html(points.length + " vertices");
    render();
}

function length( p ) {
	return Math.sqrt(p[0] * p[0] + p[1] * p[1]); 
}

function triangle( a, b, c )
{
    points.push( a, b, c );
}

function addColor( a, b, c )
{
    colors.push( a, b, c );
}

function render()
{
	
    gl.clear( gl.COLOR_BUFFER_BIT );
	if (para.renderMode === RENDER_WIREFRAME) {
		for (var i = 0; i < points.length; i += 3)
			gl.drawArrays( gl.LINE_LOOP, i, 3);  
	} else {
		gl.drawArrays( gl.TRIANGLES, 0, points.length );
		//gl.drawArrays( gl.LINES, 0, points.length );
		//gl.lineWidth(2.0);

	}
}

$( document ).ready(function() {
	console.log("Hi, I am Ruofei Du and I am glad to be your friend."); 

	$( "#linewidth" ).slider({
      range: false,
      min: 1,
      max: 30,
	  value: para.lineWidth,
	  slide: function( event, ui ) {
        $( "#linewidth_value" ).html( ui.value );
		para.lineWidth = ui.value;
		reload();
      }
	});
	
	$('#clear').click(function(){
		paths = []; 
		lastLine = []; 
		reload(); 
	});
	
	
	$('#undo').click(function(){
		do {
			if (paths.length <= 0) break; 
			var x = paths.pop();
		}
		while (x.length === 0)
		reload(); 
	});
});