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

    var ambientProduct = mult(this.lighting.ambient, this.material.ambient);
    var diffuseProduct = mult(this.lighting.diffuse, this.material.diffuse);
    var specularProduct = mult(this.lighting.specular, this.material.specular);

    gl.uniform4fv(gl.getUniformLocation(this.program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(this.program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(this.program, "specularProduct"), flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(this.program, "lightPosition"), flatten(this.lighting.position) );
    gl.uniform1f(gl.getUniformLocation(this.program, "shininess"), this.material.shininess);
    gl.uniformMatrix4fv( gl.getUniformLocation(this.program, "projectionMatrix"), false, flatten(camera.projectionMatrix));
}

Cube.prototype.render = function() {
	//console.log('render cube'); 
	gl.useProgram( this.program );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
	gl.vertexAttribPointer( this.vNormal, 3, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
	gl.vertexAttribPointer( this.vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	if (this.annimation) {
		this.rotation[this.axis] += this.annimateDetla;
	}
    var modelView = mat4();
    modelView = mult(modelView, translate(this.translation[this.xAxis], this.translation[this.yAxis], this.translation[this.zAxis] ));
    modelView = mult(modelView, rotate(this.rotation[this.xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(this.rotation[this.yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(this.rotation[this.zAxis], [0, 0, 1] ));
	modelView = mult(modelView, scalem(this.scale[this.xAxis], this.scale[this.yAxis], this.scale[this.zAxis] ));

    gl.uniformMatrix4fv( gl.getUniformLocation(this.program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 0, this.numVertices );
}
