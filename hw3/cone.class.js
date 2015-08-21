"use strict";

function Cone() {
	Model.call(this); 
	this.init(); 
}
extendRelation(Cone, Model);

Cone.prototype.create = function(
	bottomRadius,
	topRadius,
	height,
	radialSubdivisions,
	verticalSubdivisions,
	opt_topCap,
	opt_bottomCap) {

	var topCap = (opt_topCap === undefined) ? true : opt_topCap;
	var bottomCap = (opt_bottomCap === undefined) ? true : opt_bottomCap;

	var extra = (topCap ? 2 : 0) + (bottomCap ? 2 : 0);

	this.numVertices = (radialSubdivisions + 1) * (verticalSubdivisions + 1 + extra);
	var vertsAroundEdge = radialSubdivisions + 1;

	// The slant of the cone is constant across its surface
	var slant = Math.atan2(bottomRadius - topRadius, height);
	var cosSlant = Math.cos(slant);
	var sinSlant = Math.sin(slant);

	var start = topCap ? -2 : 0;
	var end = verticalSubdivisions + (bottomCap ? 2 : 0);

	for (var yy = start; yy <= end; ++yy) {
	  var v = yy / verticalSubdivisions;
	  var y = height * v;
	  var ringRadius;
	  if (yy < 0) {
		y = 0;
		v = 1;
		ringRadius = bottomRadius;
	  } else if (yy > verticalSubdivisions) {
		y = height;
		v = 1;
		ringRadius = topRadius;
	  } else {
		ringRadius = bottomRadius +
		  (topRadius - bottomRadius) * (yy / verticalSubdivisions);
	  }
	  if (yy === -2 || yy === verticalSubdivisions + 2) {
		ringRadius = 0;
		v = 0;
	  }
	  y -= height / 2;
	  for (var ii = 0; ii < vertsAroundEdge; ++ii) {
		var sin = Math.sin(ii * Math.PI * 2 / radialSubdivisions);
		var cos = Math.cos(ii * Math.PI * 2 / radialSubdivisions);
		this.vertices.push(vec4(sin * ringRadius, y, cos * ringRadius, 1.0))
		this.normals.push(
		vec3(
			(yy < 0 || yy > verticalSubdivisions) ? 0 : (sin * cosSlant),
			(yy < 0) ? -1 : (yy > verticalSubdivisions ? 1 : sinSlant),
			(yy < 0 || yy > verticalSubdivisions) ? 0 : (cos * cosSlant)
		) );
	  }
	}

	for (var yy = 0; yy < verticalSubdivisions + extra; ++yy) {
	  for (var ii = 0; ii < radialSubdivisions; ++ii) {
		this.pointsArray.push( this.vertices[ vertsAroundEdge * (yy + 0) + 0 + ii ] ); 
		this.pointsArray.push( this.vertices[ vertsAroundEdge * (yy + 0) + 1 + ii ] ); 
		this.pointsArray.push( this.vertices[ vertsAroundEdge * (yy + 1) + 1 + ii ] ); 
		
		this.pointsArray.push( this.vertices[ vertsAroundEdge * (yy + 0) + 0 + ii ] ); 
		this.pointsArray.push( this.vertices[ vertsAroundEdge * (yy + 1) + 1 + ii ] ); 
		this.pointsArray.push( this.vertices[ vertsAroundEdge * (yy + 1) + 0 + ii ] ); 
		
		this.normalsArray.push( this.vertices[ vertsAroundEdge * (yy + 0) + 0 + ii ] ); 
		this.normalsArray.push( this.vertices[ vertsAroundEdge * (yy + 0) + 1 + ii ] ); 
		this.normalsArray.push( this.vertices[ vertsAroundEdge * (yy + 1) + 1 + ii ] ); 
		
		this.normalsArray.push( this.vertices[ vertsAroundEdge * (yy + 0) + 0 + ii ] ); 
		this.normalsArray.push( this.vertices[ vertsAroundEdge * (yy + 1) + 1 + ii ] ); 
		this.normalsArray.push( this.vertices[ vertsAroundEdge * (yy + 1) + 0 + ii ] ); 
	  }
	}
	this.numVertices = this.pointsArray.length; 
}


Cone.prototype.init = function (){
	
	this.program = initShaders( gl, "vertex-shader3", "fragment-shader3" );
	gl.useProgram( this.program );
	this.numTimesToSubdivide = 4;
	this.normals = []; 
	this.create(0.5, 0, 1.0, 20, 1, true, false);
	
	this.nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );

    this.vNormal = gl.getAttribLocation( this.program, "vNormal" );
    gl.vertexAttribPointer( this.vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.vNormal);
	
	this.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(this.pointsArray), gl.STATIC_DRAW);

    this.vPosition = gl.getAttribLocation( this.program, "vPosition");
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

Cone.prototype.render = function() {
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