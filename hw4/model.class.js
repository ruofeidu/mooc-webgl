"use strict";

function Model() {
	this.vertices = []; 
	this.pointsArray = []; 
	this.normalsArray = []; 
	this.lighting = lightings[0]; 
	this.lighting2 = lightings[1]; 
	this.numVertices = 0; 
	this.scale = 1.0; 
	this.rotationX = 0.0; 
	this.rotationY = 0.0; 
	this.rotationZ = 0.0; 
	this.axis = 0;
	this.xAxis = 0;
	this.yAxis = 1;
	this.zAxis = 2;
	this.rotation = [0.0, 0.0, 0.0];
	this.translation = [0.0, 0.0, 0.0];
	this.scale = [1.0, 1.0, 1.0];
	
	this.material = {
		ambient : vec4( 1.0, 0.0, 1.0, 1.0 ),
		diffuse : vec4( 1.0, 0.8, 0.0, 1.0),
		specular : vec4( 1.0, 0.8, 0.0, 1.0 ),
		shininess : 100.0,
	};
	
	this.annimation = false; 
	this.annimateDetla = Math.random() * 2.0; 
}

Model.prototype.render = function() {
	//console.log('render sphere'); 
	gl.useProgram( this.program );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
	gl.vertexAttribPointer( this.vNormal, 3, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
	gl.vertexAttribPointer( this.vPosition, 4, gl.FLOAT, false, 0, 0 );
	
    var ambientProduct = mult(this.lighting.ambient, this.material.ambient);
    var diffuseProduct = mult(this.lighting.diffuse, this.material.diffuse);
    var specularProduct = mult(this.lighting.specular, this.material.specular);

    gl.uniform4fv(gl.getUniformLocation(this.program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(this.program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(this.program, "specularProduct"), flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(this.program, "lightPosition"), flatten(this.lighting.aniposition) );
    gl.uniform4fv(gl.getUniformLocation(this.program, "lightPosition2"), flatten(this.lighting2.aniposition) );
    gl.uniform1f(gl.getUniformLocation(this.program, "shininess"), this.material.shininess);
    gl.uniform1i(gl.getUniformLocation(this.program, "lightSwitches"), 0 + this.lighting.isOn + this.lighting2.isOn + this.lighting2.isOn);
    gl.uniformMatrix4fv( gl.getUniformLocation(this.program, "projectionMatrix"), false, flatten(camera.projectionMatrix));
	
	if (this.annimation) {
		this.rotation[this.axis] += this.annimateDetla;
	}
    var modelView = mat4();
    modelView = mult(modelView, translate(this.translation[this.xAxis], this.translation[this.yAxis], this.translation[this.zAxis] ));
    modelView = mult(modelView, scalem(this.scale[this.xAxis], this.scale[this.yAxis], this.scale[this.zAxis] ));
	modelView = mult(modelView, rotate(this.rotation[this.xAxis], [1, 0, 0] ));
    modelView = mult(modelView, rotate(this.rotation[this.yAxis], [0, 1, 0] ));
    modelView = mult(modelView, rotate(this.rotation[this.zAxis], [0, 0, 1] ));
	
    gl.uniformMatrix4fv( gl.getUniformLocation(this.program, "modelViewMatrix"), false, flatten(modelView) );
    gl.drawArrays( gl.TRIANGLES, 0, this.numVertices );
}