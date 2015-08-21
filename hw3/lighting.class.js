"use strict";

function Lighting() {
	this.position = vec4(1.0, 1.0, 1.0, 0.0 );
	this.ambient = vec4(0.2, 0.2, 0.2, 1.0 );
	this.diffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
	this.specular = vec4( 1.0, 1.0, 1.0, 1.0 );
}