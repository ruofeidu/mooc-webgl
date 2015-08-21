"use strict";

var canvas, canvas_top;
var gl;

var PI = 3.14159265359;
var debug = false; 
var paths = [];
var lastLine = []; 

var RENDER_FILL = 0, RENDER_GASKET = 1, RENDER_WIREFRAME = 2; 
var SHAPE_TRIANGLE = 0, SHAPE_SQUARE = 1, SHAPE_PENTAGON = 2; 
var PIc2 = PI / 2; 
var PIx2 = PI * 2; 
var PI23 = PI / 2 * 3; 
var deg2rad = PI / 180; 

var isMouseDown = false, mousePos = {x:0, y:0, z:0, w:0};
var program;

var models = [], lightings = [], currentModelID = 0; 


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


function extendRelation(Child, Parent) {
   var F = function () {};
   F.prototype = Parent.prototype;
   Child.prototype = new F();
   Child.prototype.constructor = Child;
}


function Camera() {
	this.theta = 0.0; 
	this.phi = 0.0; 
	this.radius = 6.0; 
	this.at = vec3(0.0, 0.0, 0.0); 
	this.up = vec3(0.0, 1.0, 0.0); 
	this.left = -2.0;
	this.right = 2.0;
	this.top = 2.0;
	this.bottom = -2.0;
	this.near = -10.0; 
	this.far = 10.0; 

	this.eye = vec3(this.radius * Math.sin(this.theta) * Math.cos(this.phi), this.radius * Math.sin(this.theta) * Math.sin(this.phi), this.radius*Math.cos(this.theta));
	
	this.modelViewMatrix = lookAt(this.eye, this.at, this.up);
	this.projectionMatrix = ortho(this.left, this.right, this.bottom, this.top, this.near, this.far);
	//this.projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);
};

var camera = new Camera(); 