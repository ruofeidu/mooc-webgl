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
    
	texImage = document.getElementById("texImage");
	texCheckerboard = document.getElementById("texCheckerboard");
	
	reload();
};

function configureTexture( image, tid) {
    var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, tid), 0);
}

function reload() {
	console.log("Reload..."); 
	gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
	
	gl.useProgram( program );
	lightings = []; 
	lightings.push(new Lighting()); 
	lightings.push(new Lighting()); 
	lightings[1].position = vec4( -1.0, -1.0, 1.0, 0.0 );
	var z = 180.0/3.1415926; 
	models = []; 
	models.push(new Sphere()); 
	models[0].scale = [0.9, 0.9, 0.9];
	models[0].translation = [0.0, 0.0, 1.4];
	
    render();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	for (var i = 0; i < lightings.length; ++i) {
		var currentLight = lightings[i]; 
		currentLight.update(); 
	}
	
	for (var i = 0; i < models.length; ++i) {		
		var currentObject = models[i];
		currentObject.render();
	}
	requestAnimFrame(render);
}

$( document ).ready(function() {
	console.log("Hi, I am Ruofei Du and I am glad to be your friend."); 
	//console.log("Debugging"); 
	//window.parent.document.body.style.zoom = 0.75;
	
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
	
	$( "#lightposx" ).slider({
      range: false,
      min: -20,
      max: 20,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#lightposx_value" ).html( ui.value / 10 );
		lightings[currentLightID].position[0] = ui.value / 10;
      }
	});
	
	$( "#lightposy" ).slider({
      range: false,
      min: -20,
      max: 20,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#lightposy_value" ).html( ui.value / 10 );
		lightings[currentLightID].position[1] = ui.value / 10;
      }
	});
	
	$( "#lightposz" ).slider({
      range: false,
      min: -40,
      max: 40,
	  value: 0,
	  slide: function( event, ui ) {
        $( "#lightposz_value" ).html( ui.value / 10 );
		lightings[currentLightID].position[2] = ui.value / 10;
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
	
	$(".lightui").hide(); 
	
    $( "#modellist" ).selectable({
      stop: function() {
        $( ".ui-selected", this ).each(function() {
          var index = $( "#modellist li" ).index( this );
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
		$(".modelui").show(); 
		$(".lightui").hide(); 
		$("#lightlist li").removeClass("ui-selected"); 
      }
    });
	
    $( "#lightlist" ).selectable({
      stop: function() {
        $( ".ui-selected", this ).each(function() {
          var index = $( "#lightlist li" ).index( this );
          currentLightID = index;
		  var v = 0; 
		  
		  v = lightings[currentLightID].position[0] * 10;
		  $( "#lightposx" ).slider( "value", v);
		  $( "#lightposx_value" ).html( v );
		  
		  v = lightings[currentLightID].position[1] * 10;
		  $( "#lightposy" ).slider( "value", v);
		  $( "#lightposy_value" ).html( v );
		  
		  v = lightings[currentLightID].position[2] * 10;
		  $( "#lightposz" ).slider( "value", v);
		  $( "#lightposz_value" ).html( v );
		  
		  
		  v = lightings[currentLightID].isOn; 
		  if (v) {
			  $( "input[name=lighton]" ).val(["0"]); 
		  } else {
			  $( "input[name=lighton]" ).val(["1"]); 
		  }
		  	
		   v = lightings[currentLightID].isSwinging; 
		  if (v) {
			  $( "input[name=lightmoving]" ).val(["0"]); 
		  } else {
			  $( "input[name=lightmoving]" ).val(["1"]); 
		  }
        });
		$(".modelui").hide(); 
		$(".lightui").show(); 
		$("#modellist li").removeClass("ui-selected"); 
      }
    });
	
	
		
	$("input[name=shape]").click(function() {
		var x = parseInt( $("input[name=shape]:checked").val() ); 
		switch (x) {
			case 0: models.push(new Cube()); ++cubeCount;  
			var h =  $( "#modellist" ).html(); 
			var s = '<li class="ui-widget-content">Cube ' + cubeCount + '</li>';
			$( "#modellist" ).html(h+s);  
			break; 
			case 1: models.push(new Sphere());  ++sphereCount;  
			
			var h =  $( "#modellist" ).html(); 
			var s = '<li class="ui-widget-content">Sphere ' + sphereCount + '</li>';
			$( "#modellist" ).html(h+s); 
			break;
			case 2: models.push(new Cone()); ++coneCount;  
			
			var h =  $( "#modellist" ).html(); 
			var s = '<li class="ui-widget-content">Cone ' + coneCount + '</li>';
			$( "#modellist" ).html(h+s); 
			break; 
		}; 
	}); 
	
	$("input[name=tm]").click(function() {
		var x = parseInt( $("input[name=tm]:checked").val() ); 
		texMode = x;  
	}); 
	
	$("input[name=lighton]").click(function() {
		var x = parseInt( $("input[name=lighton]:checked").val() ); 
		switch (x) {
			case 0: lightings[currentLightID].turnOn();   break; 
			case 1:  lightings[currentLightID].turnOff(); break;
		}; 
	}); 
	
	$("input[name=lightmoving]").click(function() {
		var x = parseInt( $("input[name=lightmoving]:checked").val() ); 
		switch (x) {
			case 0: lightings[currentLightID].isSwinging = true;   break; 
			case 1:  lightings[currentLightID].isSwinging = false; break;
		}; 
	}); 
	
	
	$('#clear').click(function(){
		models = []; 
		cubeCount = 0; 
		sphereCount = 0; 
		coneCount = 0; 
		$( "#modellist" ).html(''); 
	});
});