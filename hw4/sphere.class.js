"use strict";

function Sphere() {
	Model.call(this); 
	this.init(); 
}
extendRelation(Sphere, Model);

Sphere.prototype.triangle = function(a, b, c) {
	var t1 = subtract(b, a);
	var t2 = subtract(c, a);
	var normal = normalize(cross(t2, t1));

	this.normalsArray.push(normal);
	this.normalsArray.push(normal);
	this.normalsArray.push(normal);
	this.pointsArray.push(a);
	this.pointsArray.push(b);
	this.pointsArray.push(c);
	this.numVertices += 3;
}

Sphere.prototype.divideTriangle = function(a, b, c, count) {
    if ( count > 0 ) {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        this.divideTriangle( a, ab, ac, count - 1 );
        this.divideTriangle( ab, b, bc, count - 1 );
        this.divideTriangle( bc, c, ac, count - 1 );
        this.divideTriangle( ab, bc, ac, count - 1 );
    }
    else {
        this.triangle( a, b, c );
    }
}

Sphere.prototype.tetrahedron = function(a, b, c, d, n) {
    this.divideTriangle(a, b, c, n);
    this.divideTriangle(d, c, b, n);
    this.divideTriangle(a, d, b, n);
    this.divideTriangle(a, c, d, n);
}

Sphere.prototype.init = function (){
	
	this.program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( this.program );
	this.numTimesToSubdivide = 6;
	this.va = vec4(0.0, 0.0, -1.0,1);
	this.vb = vec4(0.0, 0.942809, 0.333333, 1);
	this.vc = vec4(-0.816497, -0.471405, 0.333333, 1);
	this.vd = vec4(0.816497, -0.471405, 0.333333,1);
	this.tetrahedron(this.va, this.vb, this.vc, this.vd, this.numTimesToSubdivide);
	
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
}
