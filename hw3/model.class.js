"use strict";

function Model() {
	this.vertices = []; 
	this.pointsArray = []; 
	this.normalsArray = []; 
	this.lighting = lightings[0]; 
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
	
	this.annimation = true; 
	this.annimateDetla = Math.random() * 2.0; 
}
