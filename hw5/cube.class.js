"use strict";

function Cube() {
	Model.call(this); 
	this.init(); 
}
extendRelation(Cube, Model);

Cube.prototype.quad = function(a, b, c, d) {
	var t1 = subtract(this.vertices[b], this.vertices[a]);
	var t2 = subtract(this.vertices[c], this.vertices[b]);
	var normal = cross(t1, t2);
	var normal = vec3(normal);
	normal = normalize(normal);

	this.pointsArray.push(this.vertices[a]);		this.normalsArray.push(normal);
	this.pointsArray.push(this.vertices[b]);		this.normalsArray.push(normal);
	this.pointsArray.push(this.vertices[c]);		this.normalsArray.push(normal);
	this.pointsArray.push(this.vertices[a]);		this.normalsArray.push(normal);
	this.pointsArray.push(this.vertices[c]);		this.normalsArray.push(normal);
	this.pointsArray.push(this.vertices[d]);		this.normalsArray.push(normal);
}

Cube.prototype.create = function() {
	console.log("Creating a cube..."); 
	this.quad( 1, 0, 3, 2 );
    this.quad( 2, 3, 7, 6 );
    this.quad( 3, 0, 4, 7 );
    this.quad( 6, 5, 1, 2 );
    this.quad( 4, 5, 6, 7 );
    this.quad( 5, 4, 0, 1 );
	this.numVertices  = 36;
}

Cube.prototype.init = function (){
	
	this.program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( this.program );
	this.vertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
    ];
	this.create(); 
	this.nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );
	
	this.vNormal = gl.getAttribLocation( this.program, "vNormal" );
    gl.vertexAttribPointer( this.vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vNormal );
	
	this.vBuffer = gl.createBuffer(); 
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.pointsArray), gl.STATIC_DRAW );
	
	this.vPosition = gl.getAttribLocation(this.program, "vPosition");
    gl.vertexAttribPointer(this.vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vPosition);
}
