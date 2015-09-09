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

Sphere.prototype.loadCubeMap = function(tname, tid) {
    var texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + tid); 
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    var faces = [["images/cube00_0.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
                 ["images/cube00_1.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
                 ["images/cube00_2.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
                 ["images/cube00_3.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
                 ["images/cube00_4.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
                 ["images/cube00_5.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i][1];
        var image = new Image();
        image.onload = function(texture, face, image) {
            return function() {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            }
        } (texture, face, image);
        image.src = faces[i][0];
    }
    gl.uniform1i(gl.getUniformLocation(this.program, tname), tid);
    return texture;
}

Sphere.prototype.configureTexture = function(image, tname, tid) {
    var texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0 + tid); 
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(this.program, tname), tid);
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
	this.numTimesToSubdivide = 7;
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
	
    this.configureTexture( texImage, "t0", 0);
    this.configureTexture( texCheckerboard , "t1", 1);
    this.loadCubeMap("cubeMap", 2);  
}
