"use strict";

window.onload = function ()
{
    canvas = document.getElementById( "gl-canvas" );
	var parent = document.getElementById("one");
	canvas.width = parent.offsetWidth; 
	canvas.height = canvas.width;
	
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "Please use a WebGL-enabled explorer such as Chrome." ); }
	clickColor("#993333", -19, 162);
	program = initShaders( gl, "vertex-shader", "fragment-shader" );
    
	reload();
};

function reload() {
	console.log("Reload..."); 
	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
	
	gl.useProgram( program );
	lightings = []; 
	lightings.push(new Lighting()); 
	
	models = []; 
	models.push(new Cube()); 
	models[0].translation = [-1.0, 1.0, 0.0];
	models.push(new Sphere()); 
	models[1].scale = [0.5, 0.5, 0.5];
	models.push(new Cone()); 
	models[2].translation = [1.0, -1.0, 0.0];
	//models.push(new Cube()); 
    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for (var i = 0; i < models.length; ++i) {		
		var currentObject = models[i];
		currentObject.render();
		
		//gl.bindBuffer(gl.ARRAY_BUFFER,currentObject.vbuffer);
		//gl.vertexAttribPointer(program.vPosition, 4, gl.FLOAT, false, 0, 0);
		// gl.bindBuffer(gl.ARRAY_BUFFER,currentObject.cbuffer)
		// gl.vertexAttribPointer( program.vColor, 4, gl.FLOAT, false, 0, 0 );
		
		//gl.drawArrays(gl.TRIANGLES, 0, currentObject.numVertices);
	}
	requestAnimFrame(render);
}

$( document ).ready(function() {
	//console.log("Hi, I am Ruofei Du and I am glad to be your friend."); 
	console.log("Debugging"); 
	
	$( "#scale" ).slider({
      range: false,
      min: 1,
      max: 10,
	  value: 5,
	  slide: function( event, ui ) {
        $( "#scale_value" ).html( ui.value );
		models[currentModelID].scale[0] = ui.value / 5;
		models[currentModelID].scale[1] = ui.value / 5;
		models[currentModelID].scale[2] = ui.value / 5;
      }
	});
	
	$( "#rotationx" ).slider({
      range: false,
      min: -180,
      max: 180,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#rotationx_value" ).html( ui.value / 180 * 3.1415926 );
		models[currentModelID].rotation[0] = ui.value;
      }
	});
	
	$( "#rotationy" ).slider({
      range: false,
      min: -180,
      max: 180,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#rotationy_value" ).html( ui.value / 180 * 3.1415926 );
		models[currentModelID].rotation[1] = ui.value ;
      }
	});
	
	$( "#rotationz" ).slider({
      range: false,
      min: -180,
      max: 180,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#rotationz_value" ).html( ui.value / 180 * 3.1415926 );
		models[currentModelID].rotation[2] = ui.value;
      }
	});
	
	$( "#translationx" ).slider({
      range: false,
      min: -20,
      max: 20,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#translationx_value" ).html( ui.value / 10 );
		models[currentModelID].translation[0] = ui.value / 10;
      }
	});
	
	$( "#translationy" ).slider({
      range: false,
      min: -20,
      max: 20,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#translationy_value" ).html( ui.value / 10 );
		models[currentModelID].translation[1] = ui.value / 10;
      }
	});
	
	$( "#translationz" ).slider({
      range: false,
      min: -20,
      max: 20,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#translationz_value" ).html( ui.value / 10 );
		models[currentModelID].translation[2] = ui.value / 10;
      }
	});
	
	$('#clear').click(function(){
		paths = []; 
		lastLine = []; 
		reload(); 
	});
	
	
	$('#undo').click(function(){
		do {
			if (paths.length <= 0) break; 
			var x = paths.pop();
		}
		while (x.length === 0)
		reload(); 
	});
	
    $( "#selectable" ).selectable({
      stop: function() {
        var result = $( "#select-result" ).empty();
        $( ".ui-selected", this ).each(function() {
          var index = $( "#selectable li" ).index( this );
          currentModelID = index;
		  var v = 0; 
		  v = models[currentModelID].scale[0] * 5;
		  $( "#scale" ).slider( "value", v);
		  $( "#scale_value" ).html( v );
		  
		  v = models[currentModelID].rotation[0];
		  $( "#rotationx" ).slider( "value", v);
		  $( "#rotationx_value" ).html( v );
		  
		  v = models[currentModelID].rotation[1];
		  $( "#rotationy" ).slider( "value", v);
		  $( "#rotationy_value" ).html( v );
		  
		  v = models[currentModelID].rotation[2];
		  $( "#rotationz" ).slider( "value", v);
		  $( "#rotationz_value" ).html( v );
		  
		  
		  v = models[currentModelID].translation[0] * 10;
		  $( "#translationnx" ).slider( "value", v);
		  $( "#translationx_value" ).html( v );
		  
		  v = models[currentModelID].translation[1] * 10;
		  $( "#translationy" ).slider( "value", v);
		  $( "#translationy_value" ).html( v );
		  
		  v = models[currentModelID].translation[2] * 10;
		  $( "#translationz" ).slider( "value", v);
		  $( "#translationz_value" ).html( v );
        });
      }
    });
});