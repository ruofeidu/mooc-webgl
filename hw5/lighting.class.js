"use strict";

function Lighting() {
	this.position = vec4( 1.0, 1.0, 1.0, 0.0 );
	this.aniposition = vec4( 1.0, 1.0, 1.0, 0.0 );
	this.ambient = vec4( 0.2, 0.2, 0.2, 1.0 );
	this.diffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
	this.specular = vec4( 1.0, 1.0, 1.0, 1.0 );
	this.isOn = true; 
	this.isSwinging = true; 
}

Lighting.prototype.turnOff = function (){
	this.isOn = false; 
} 

Lighting.prototype.turnOn = function (){
	this.isOn = true; 
}

Lighting.prototype.toggle = function (){
	this.isOn = !this.isOn; 
}

Lighting.prototype.update = function (){
	if (this.isSwinging) {
		var range = 100; 
		var delta = parseInt(new Date() / 10) % range;
		if (delta > range / 2) { 
			delta = range - delta; 
		}
		//console.log('light swing', this.position[2]); 
		this.aniposition[2] = this.position[2] + delta / 100 - 1.2; 
	} else {
		this.aniposition = this.position; 
	}
}