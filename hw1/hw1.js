"use strict";

var canvas;
var gl;

var points = [], colors = [];

var RENDER_FILL = 0, RENDER_GASKET = 1, RENDER_WIREFRAME = 2; 
var SHAPE_TRIANGLE = 0, SHAPE_SQUARE = 1, SHAPE_PENTAGON = 2; 
var PI = 3.14159265359;
var deg2rad = PI / 180; 

var para = {
	renderMode : RENDER_FILL,
	shape : SHAPE_TRIANGLE,
	
	animation : 0,
	scale : 1.0,
	twistDegree : 60,
	tessellationDegree: 5,
};

window.onload = function init()
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
	return vec4(1.0 * r / 255, 1.0 * g / 255, 1.0 * b / 255); 
}

function reload() {
	points = []; 
	colors = []; 
	var vertices = [], vertexColors = []; 
	
	if (para.shape === SHAPE_TRIANGLE) {
		vertices = [
			vec2( -0.5 * para.scale, - 0.5 / Math.sqrt(3) * para.scale ),
			vec2(  0,  Math.sqrt(3) / 3 * para.scale ),
			vec2(  0.5 * para.scale, - 0.5 / Math.sqrt(3) * para.scale )
		];
		vertexColors = [
			vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
			vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
			vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
		];
		divideTriangle( vertices[0], vertices[1], vertices[2], vertexColors[0], vertexColors[1], vertexColors[2], para.tessellationDegree);
	} else 
	if (para.shape == SHAPE_SQUARE){
		vertices = [
			vec2( 0.5 * para.scale, 0.5 * para.scale ),
			vec2( -0.5 * para.scale, 0.5 * para.scale ),
			vec2( -0.5 * para.scale, -0.5 * para.scale ),
			vec2( 0.5 * para.scale, -0.5 * para.scale ),
		];
		vertexColors = [
			vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
			vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
			vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
			vec4( 0.0, 1.0, 1.0, 1.0 ),  // blue
		];
		divideTriangle( vertices[0], vertices[1], vertices[2], vertexColors[0], vertexColors[1], vertexColors[2], para.tessellationDegree);
		divideTriangle( vertices[0], vertices[2], vertices[3], vertexColors[0], vertexColors[2], vertexColors[3], para.tessellationDegree);
	} else {
		var t = 54 * deg2rad; 
		var h = 0.5 * para.scale / Math.cos(t); 
		var lw = h * Math.cos(18 * deg2rad); 
		var lh = h * Math.sin(18 * deg2rad); 
		var bw = h * Math.cos(t); 
		var bh = h * Math.sin(t); 
		
		vertices = [
			vec2( 0, h ),
			vec2( -lw, lh ),
			vec2( -bw, -bh ),
			vec2( bw, -bh ),
			vec2( lw, lh ),
		];
		vertexColors = [
			vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
			vec4( 1.0, 1.0, 0.0, 1.0 ),  
			vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
			vec4( 0.0, 1.0, 1.0, 1.0 ),  
			vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
		];
		divideTriangle( vertices[0], vertices[1], vertices[2], vertexColors[0], vertexColors[1], vertexColors[2], para.tessellationDegree);
		divideTriangle( vertices[0], vertices[2], vertices[3], vertexColors[0], vertexColors[2], vertexColors[3], para.tessellationDegree);	
		divideTriangle( vertices[0], vertices[3], vertices[4], vertexColors[0], vertexColors[3], vertexColors[4], para.tessellationDegree);	
	}
	
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

function twist( p, theta ) {
	theta = theta || para.twistDegree * length(p); 
	return vec2( p[0] * Math.cos(theta * deg2rad) - p[1] * Math.sin(theta * deg2rad), p[0] * Math.sin(theta * deg2rad) + p[1] * Math.cos(theta * deg2rad) ); 
}

function triangle( a, b, c )
{
	a = twist(a); 
	b = twist(b); 
	c = twist(c); 
    points.push( a, b, c );
}

function addColor( a, b, c )
{
    colors.push( a, b, c );
}

function divideTriangle( a, b, c, c1, c2, c3, count )
{

    // check for end of recursion

    if ( count === 0 ) {
        triangle( a, b, c );
        addColor( c1, c2, c3 );
    }
    else {

        //bisect the sides

        var ab = mix( a, b, 0.5 );
        var ac = mix( a, c, 0.5 );
        var bc = mix( b, c, 0.5 );

        var c12 = mix( c1, c2, 0.5 );
        var c13 = mix( c1, c3, 0.5 );
        var c23 = mix( c2, c3, 0.5 );
        --count;

        // three new triangles

        divideTriangle( a, ab, ac, c1, c12, c13, count );
        divideTriangle( c, ac, bc, c3, c13, c23, count );
        divideTriangle( b, bc, ab, c2, c23, c12, count );
		
		if (para.renderMode !== RENDER_GASKET) {
			divideTriangle( ab, bc, ac, c12, c23, c13, count );
		}
    }
}

function render()
{
	
    gl.clear( gl.COLOR_BUFFER_BIT );
	if (para.renderMode === RENDER_WIREFRAME) {
		for (var i = 0; i < points.length; i += 3)
			gl.drawArrays( gl.LINE_LOOP, i, 3);  
	} else {
		gl.drawArrays( gl.TRIANGLES, 0, points.length );
	}
}

$( document ).ready(function() {
	console.log("Hi, I am Ruofei Du and I am glad to be your friend."); 
	
    $( "#vertices" ).slider({
      range: false,
      min: 0,
      max: 50,
	  value: 3,
	});
	
	$( "#tessellation" ).slider({
      range: false,
      min: 0,
      max: 7,
	  value: para.tessellationDegree,
	  slide: function( event, ui ) {
        $( "#tessellation_value" ).html( ui.value );
		para.tessellationDegree = ui.value;
		reload();
      }
	});
	
	$( "#twist" ).slider({
      range: false,
      min: -720,
      max: 720,
	  value: para.twistDegree,
	  slide: function( event, ui ) {
        $( "#twist_value" ).html( ui.value );
		para.twistDegree = ui.value;
		reload();
      }
	});
	
	$( "#scale" ).slider({
      range: false,
      min: 1,
      max: 20,
	  value: para.scale * 10,
	  slide: function( event, ui ) {
        $( "#scale_value" ).html( ui.value / 10 );
		para.scale = parseInt(ui.value) / 10;
		reload();
      }
	});
	
	$("input[name=render]").click(function() {
		para.renderMode = parseInt( $("input[name=render]:checked").val() ); 
		reload();
	}); 
	
	$("input[name=shape]").click(function() {
		para.shape = parseInt( $("input[name=shape]:checked").val() ); 
		reload();
	}); 
	
	$("input[name=animation]").click(function() {
		para.animation = parseInt( $("input[name=animation]:checked").val() ); 
		reload();
	}); 
});