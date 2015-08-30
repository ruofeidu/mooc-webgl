<!DOCTYPE HTML>
<html>
<head>
<title>Assignment 3: Geometric CAD | Ruofei Du</title>
<meta charset="UTF-8">
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/ui-lightness/jquery-ui.css" />
<link rel="stylesheet" href="assets/css/main.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
<meta name="description" lang="en" content="Ruofei Du is a 3rd-year CS Ph.D. student advised by UMIACS Director Prof. Amitabh Varshney. His research mainly focus on virtual and augmented reality. His research interests include computer graphics, human-computer interaction and computer vision." />
<meta name="author" content="Ruofei Du">
<meta property="og:title" content="Assignment 2 Painting with the Mouse by Ruofei Du">
<meta property="og:image" content="http://duruofei.com/Public/img/avatar.jpg">
<meta property="og:description" content="Ruofei Du is a 3rd-year CS Ph.D. student advised by UMIACS Director Prof. Amitabh Varshney. His research mainly focus on virtual and augmented reality. His research interests include computer graphics, human-computer interaction and computer vision.">
<link rel="shortcut icon" type="image/x-icon" href="http://duruofei.com/Public/icon/favicon.ico" />
<link rel="icon" type="image/x-icon" href="http://duruofei.com/Public/icon/favicon.ico" />
<link rel="apple-touch-icon" sizes="57x57" href="http://duruofei.com/Public/icon/57.png" />
<link rel="apple-touch-icon" sizes="72x72" href="http://duruofei.com/Public/icon/72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="http://duruofei.com/Public/icon/114.png" />
<link rel="apple-touch-icon" sizes="144x144" href="http://duruofei.com/Public/icon/144.png" />
<style>
#selectedcolor {
	border:1px solid #e3e3e3;
	width:65%;
	height:199px;
	margin:auto;
}
#divpreview {
	border:1px solid #e3e3e3;
	width:80px;
	height:20px;
	margin:auto;
	visibility:hidden;
}
#colorhexDIV, #colorrgbDIV, #colornamDIV {
	font-family:Consolas, 'Courier New', Courier, monospace;
	text-align:center;
	margin-top:6px;
	height:24px;
	font-size:18px;
}
table.colorshade {
    width:100%;
    margin:auto;
    max-width:400px;
}
td.colorshade {
	border-left:1px solid #e3e3e3;	
}
td.colorshadetxt {
	padding-left:6px;
	width:70px;
	text-align:right;
	font-family:Consolas, courier new;
	font-size:110%;
	border-left:1px solid #e3e3e3;	
}
#wronginputDIV {
    text-align:left;
    position:absolute;
    margin:4px 10px;
    color:#a94442;
    display:none;
}
</style>

<script id="vertex-shader" type="x-shader/x-vertex">
attribute vec4 vPosition;
attribute vec3 vNormal;
varying vec4 fColor;

uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 lightPosition;
uniform float shininess;
void main()
{
    vec3 pos = -(modelViewMatrix * vPosition).xyz;
    vec3 light = lightPosition.xyz;
    vec3 L = normalize( light - pos );

	
    vec3 E = normalize( -pos );
    vec3 H = normalize( L + E );
    
    vec4 NN = vec4(vNormal,0);

    // Transform vertex normal into eye coordinates
       
    vec3 N = normalize( (modelViewMatrix*NN).xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd*diffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * specularProduct;
    
    if( dot(L, N) < 0.0 ) {
	specular = vec4(0.0, 0.0, 0.0, 1.0);
    } 

    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    fColor = ambient + diffuse + specular;
    
    fColor.a = 1.0;
}
</script>

<script id="fragment-shader" type="x-shader/x-fragment">
precision mediump float;

varying vec4 fColor;

void main()
{
    gl_FragColor = fColor;
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}
</script>

<script>
<!--
var colorhex = "FF0000";
function mouseOverColor(hex) {
    document.getElementById("divpreview").style.visibility = "visible";
    //  document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer";
}

function mouseOutMap() {
}

function clickColor(hex, seltop, selleft, html5) {
    document.getElementById("divpreview").style.visibility = "visible";
    document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer"; 

  if ((seltop+199)>-1 && selleft>-1) {
        document.getElementById("selectedhexagon").style.top=(seltop - 10) + "px";
        document.getElementById("selectedhexagon").style.left=selleft + "px";
        document.getElementById("selectedhexagon").style.visibility="visible";
  } else {
        document.getElementById("divpreview").style.backgroundColor = "#" + colorhex;
        document.getElementById("selectedhexagon").style.visibility = "hidden";
  }

}
</script>

<script id="vertex-shader2" type="x-shader/x-vertex">
attribute vec4 vPosition;
attribute vec3 vNormal;
varying vec4 fColor;

uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 lightPosition;
uniform float shininess;
void main()
{
    vec3 pos = -(modelViewMatrix * vPosition).xyz;
    vec3 light = lightPosition.xyz;
    vec3 L = normalize( light - pos );

	
    vec3 E = normalize( -pos );
    vec3 H = normalize( L + E );
    
    vec4 NN = vec4(vNormal,0);

    // Transform vertex normal into eye coordinates
       
    vec3 N = normalize( (modelViewMatrix*NN).xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd*diffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * specularProduct;
    
    if( dot(L, N) < 0.0 ) {
	specular = vec4(0.0, 0.0, 0.0, 1.0);
    } 

    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    fColor = ambient + diffuse + specular;
    
    fColor.a = 1.0;
}
</script>

<script id="fragment-shader2" type="x-shader/x-fragment">
precision mediump float;

varying vec4 fColor;

void main()
{
    gl_FragColor = fColor;
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}
</script>

<script>
<!--
var colorhex = "FF0000";
function mouseOverColor(hex) {
    document.getElementById("divpreview").style.visibility = "visible";
    //  document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer";
}

function mouseOutMap() {
}

function clickColor(hex, seltop, selleft, html5) {
    document.getElementById("divpreview").style.visibility = "visible";
    document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer"; 

  if ((seltop+199)>-1 && selleft>-1) {
        document.getElementById("selectedhexagon").style.top=(seltop - 10) + "px";
        document.getElementById("selectedhexagon").style.left=selleft + "px";
        document.getElementById("selectedhexagon").style.visibility="visible";
  } else {
        document.getElementById("divpreview").style.backgroundColor = "#" + colorhex;
        document.getElementById("selectedhexagon").style.visibility = "hidden";
  }

}
</script>

<script id="vertex-shader3" type="x-shader/x-vertex">
attribute vec4 vPosition;
attribute vec3 vNormal;
varying vec4 fColor;

uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 lightPosition;
uniform float shininess;
void main()
{
    vec3 pos = -(modelViewMatrix * vPosition).xyz;
    vec3 light = lightPosition.xyz;
    vec3 L = normalize( light - pos );

	
    vec3 E = normalize( -pos );
    vec3 H = normalize( L + E );
    
    vec4 NN = vec4(vNormal,0);

    // Transform vertex normal into eye coordinates
       
    vec3 N = normalize( (modelViewMatrix*NN).xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd*diffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * specularProduct;
    
    if( dot(L, N) < 0.0 ) {
	specular = vec4(0.0, 0.0, 0.0, 1.0);
    } 

    gl_Position = projectionMatrix * modelViewMatrix * vPosition;
    fColor = ambient + diffuse + specular;
    
    fColor.a = 1.0;
}
</script>

<script id="fragment-shader3" type="x-shader/x-fragment">
precision mediump float;

varying vec4 fColor;

void main()
{
    gl_FragColor = fColor;
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
}
</script>

<script>
<!--
var colorhex = "FF0000";
function mouseOverColor(hex) {
    document.getElementById("divpreview").style.visibility = "visible";
    //  document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer";
}

function mouseOutMap() {
}

function clickColor(hex, seltop, selleft, html5) {
    document.getElementById("divpreview").style.visibility = "visible";
    document.getElementById("divpreview").style.backgroundColor = hex;
    document.body.style.cursor = "pointer"; 

  if ((seltop+199)>-1 && selleft>-1) {
        document.getElementById("selectedhexagon").style.top=(seltop - 10) + "px";
        document.getElementById("selectedhexagon").style.left=selleft + "px";
        document.getElementById("selectedhexagon").style.visibility="visible";
  } else {
        document.getElementById("divpreview").style.backgroundColor = "#" + colorhex;
        document.getElementById("selectedhexagon").style.visibility = "hidden";
  }

}
</script>
<script type="text/javascript" src="../Common/webgl-utils.js"></script>
<script type="text/javascript" src="../Common/initShaders.js"></script>
<script type="text/javascript" src="../Common/MV.js"></script>
<script type="text/javascript" src="assets/js/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/jquery.poptrox.min.js"></script>
<script type="text/javascript" src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<script type="text/javascript" src="global.input.js"></script>
<script type="text/javascript" src="lighting.class.js"></script>
<script type="text/javascript" src="model.class.js"></script>
<script type="text/javascript" src="cube.class.js"></script>
<script type="text/javascript" src="sphere.class.js"></script>
<script type="text/javascript" src="cone.class.js"></script>
<script type="text/javascript" src="hw3.js"></script>
</head>
<body id="top">
<header id="header">
<a href="http://www.duruofei.com" target="_blank" class="image avatar"><img src="http://www.duruofei.com/Public/img/avatar.jpg" alt="" /></a>
<h1><strong>I am Ruofei Du</strong>, a Research Assistant<br />
at Augmentarium Lab, <a href="http://www.umiacs.umd.edu/">UMIACS</a><br />
advised by <a href="http://www.cs.umd.edu/~varshney/">Prof. Varshney</a>.</h1>
</header>

<div id="main">
<section id="one">
<header class="major">
	<h2>WebGL MOOC Assignment 3: Geometric CAD</h2>
</header>
<p>This demo allows users to render some simple geometries using a basic control panel.</i> Feel free to play with it. 
</p>

<div class="row">
<div class="col-md-12">
<canvas id="gl-canvas" width="100%" style="border-style: dashed; border-width: 2px;">
Oops ... your browser doesn't support the HTML5 canvas element
</canvas>
</div>
</div>

<ul>


<div class="row">
<div class="col-md-4" id="color_label">Model List:</div>
<div class="col-md-7">
<ol id="selectable">
  <li class="ui-widget-content ui-selected">Cube 1</li>
  <li class="ui-widget-content">Sphere 1</li>
  <li class="ui-widget-content">Cone 1</li>
  <li class="ui-widget-content">Cube 2</li>
  <li class="ui-widget-content">Sphere 2</li>
  <li class="ui-widget-content">Cone 2</li>
</ol>
</div>
</div>

<div class="row">
<div class="col-md-4" id="color_label">Add New Model:</div>
<div class="col-md-7">
<div id="shape">
<input type="radio" id="shape1" name="shape" value="0"><label for="shape1">Cube</label>
<input type="radio" id="shape2" name="shape" value="1" ><label for="shape2">Sphere</label>
<input type="radio" id="shape3" name="shape" value="2" ><label for="shape3">Cone</label>
</div>
</div>
</div>

<div class="row hidden">
<div class="col-md-4" id="color_label">Model Color:</div>
<div class="col-md-7">
      <div style="margin:auto;width:236px;">
        <img style='margin-right:2px;' src='colormap.gif' usemap='#colormap' alt='colormap' /><map id='colormap' name='colormap' onmouseout='mouseOutMap()'><area style='cursor:pointer' shape='poly' coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-199,54)' onmouseover='mouseOverColor("#003366")' alt='#003366' /><area style='cursor:pointer' shape='poly' coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-199,72)' onmouseover='mouseOverColor("#336699")' alt='#336699' /><area style='cursor:pointer' shape='poly' coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-199,90)' onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' /><area style='cursor:pointer' shape='poly' coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-199,108)' onmouseover='mouseOverColor("#003399")' alt='#003399' /><area style='cursor:pointer' shape='poly' coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-199,126)' onmouseover='mouseOverColor("#000099")' alt='#000099' /><area style='cursor:pointer' shape='poly' coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-199,144)' onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' /><area style='cursor:pointer' shape='poly' coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-199,162)' onmouseover='mouseOverColor("#000066")' alt='#000066' /><area style='cursor:pointer' shape='poly' coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-184,45)' onmouseover='mouseOverColor("#006666")' alt='#006666' /><area style='cursor:pointer' shape='poly' coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-184,63)' onmouseover='mouseOverColor("#006699")' alt='#006699' /><area style='cursor:pointer' shape='poly' coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-184,81)' onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' /><area style='cursor:pointer' shape='poly' coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-184,99)' onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' /><area style='cursor:pointer' shape='poly' coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-184,117)' onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' /><area style='cursor:pointer' shape='poly' coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-184,135)' onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' /><area style='cursor:pointer' shape='poly' coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-184,153)' onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' /><area style='cursor:pointer' shape='poly' coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-184,171)' onmouseover='mouseOverColor("#333399")' alt='#333399' /><area style='cursor:pointer' shape='poly' coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-169,36)' onmouseover='mouseOverColor("#669999")' alt='#669999' /><area style='cursor:pointer' shape='poly' coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-169,54)' onmouseover='mouseOverColor("#009999")' alt='#009999' /><area style='cursor:pointer' shape='poly' coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-169,72)' onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' /><area style='cursor:pointer' shape='poly' coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-169,90)' onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' /><area style='cursor:pointer' shape='poly' coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-169,108)' onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' /><area style='cursor:pointer' shape='poly' coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-169,126)' onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' /><area style='cursor:pointer' shape='poly' coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-169,144)' onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' /><area style='cursor:pointer' shape='poly' coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-169,162)' onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' /><area style='cursor:pointer' shape='poly' coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-169,180)' onmouseover='mouseOverColor("#666699")' alt='#666699' /><area style='cursor:pointer' shape='poly' coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-154,27)' onmouseover='mouseOverColor("#339966")' alt='#339966' /><area style='cursor:pointer' shape='poly' coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-154,45)' onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' /><area style='cursor:pointer' shape='poly' coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-154,63)' onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' /><area style='cursor:pointer' shape='poly' coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-154,81)' onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' /><area style='cursor:pointer' shape='poly' coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-154,99)' onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' /><area style='cursor:pointer' shape='poly' coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-154,117)' onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' /><area style='cursor:pointer' shape='poly' coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-154,135)' onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' /><area style='cursor:pointer' shape='poly' coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-154,153)' onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' /><area style='cursor:pointer' shape='poly' coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-154,171)' onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' /><area style='cursor:pointer' shape='poly' coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-154,189)' onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' /><area style='cursor:pointer' shape='poly' coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-139,18)' onmouseover='mouseOverColor("#339933")' alt='#339933' /><area style='cursor:pointer' shape='poly' coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-139,36)' onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' /><area style='cursor:pointer' shape='poly' coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-139,54)' onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' /><area style='cursor:pointer' shape='poly' coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-139,72)' onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' /><area style='cursor:pointer' shape='poly' coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-139,90)' onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' /><area style='cursor:pointer' shape='poly' coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-139,108)' onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' /><area style='cursor:pointer' shape='poly' coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-139,126)' onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' /><area style='cursor:pointer' shape='poly' coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-139,144)' onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' /><area style='cursor:pointer' shape='poly' coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-139,162)' onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' /><area style='cursor:pointer' shape='poly' coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-139,180)' onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' /><area style='cursor:pointer' shape='poly' coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-139,198)' onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' /><area style='cursor:pointer' shape='poly' coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-124,9)' onmouseover='mouseOverColor("#006600")' alt='#006600' /><area style='cursor:pointer' shape='poly' coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-124,27)' onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' /><area style='cursor:pointer' shape='poly' coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-124,45)' onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' /><area style='cursor:pointer' shape='poly' coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-124,63)' onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' /><area style='cursor:pointer' shape='poly' coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-124,81)' onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' /><area style='cursor:pointer' shape='poly' coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-124,99)' onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' /><area style='cursor:pointer' shape='poly' coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-124,117)' onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' /><area style='cursor:pointer' shape='poly' coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-124,135)' onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' /><area style='cursor:pointer' shape='poly' coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-124,153)' onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' /><area style='cursor:pointer' shape='poly' coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-124,171)' onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' /><area style='cursor:pointer' shape='poly' coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-124,189)' onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' /><area style='cursor:pointer' shape='poly' coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-124,207)' onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' /><area style='cursor:pointer' shape='poly' coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-109,0)' onmouseover='mouseOverColor("#003300")' alt='#003300' /><area style='cursor:pointer' shape='poly' coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-109,18)' onmouseover='mouseOverColor("#009933")' alt='#009933' /><area style='cursor:pointer' shape='poly' coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-109,36)' onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' /><area style='cursor:pointer' shape='poly' coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-109,54)' onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' /><area style='cursor:pointer' shape='poly' coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-109,72)' onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' /><area style='cursor:pointer' shape='poly' coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-109,90)' onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' /><area style='cursor:pointer' shape='poly' coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-109,108)' onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' /><area style='cursor:pointer' shape='poly' coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-109,126)' onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' /><area style='cursor:pointer' shape='poly' coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-109,144)' onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' /><area style='cursor:pointer' shape='poly' coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-109,162)' onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' /><area style='cursor:pointer' shape='poly' coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-109,180)' onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' /><area style='cursor:pointer' shape='poly' coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-109,198)' onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' /><area style='cursor:pointer' shape='poly' coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-109,216)' onmouseover='mouseOverColor("#660066")' alt='#660066' /><area style='cursor:pointer' shape='poly' coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-94,9)' onmouseover='mouseOverColor("#336600")' alt='#336600' /><area style='cursor:pointer' shape='poly' coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-94,27)' onmouseover='mouseOverColor("#009900")' alt='#009900' /><area style='cursor:pointer' shape='poly' coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-94,45)' onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' /><area style='cursor:pointer' shape='poly' coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-94,63)' onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' /><area style='cursor:pointer' shape='poly' coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-94,81)' onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' /><area style='cursor:pointer' shape='poly' coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-94,99)' onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' /><area style='cursor:pointer' shape='poly' coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-94,117)' onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' /><area style='cursor:pointer' shape='poly' coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-94,135)' onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' /><area style='cursor:pointer' shape='poly' coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-94,153)' onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' /><area style='cursor:pointer' shape='poly' coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-94,171)' onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' /><area style='cursor:pointer' shape='poly' coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-94,189)' onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' /><area style='cursor:pointer' shape='poly' coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-94,207)' onmouseover='mouseOverColor("#993399")' alt='#993399' /><area style='cursor:pointer' shape='poly' coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-79,18)' onmouseover='mouseOverColor("#333300")' alt='#333300' /><area style='cursor:pointer' shape='poly' coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-79,36)' onmouseover='mouseOverColor("#669900")' alt='#669900' /><area style='cursor:pointer' shape='poly' coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-79,54)' onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' /><area style='cursor:pointer' shape='poly' coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-79,72)' onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' /><area style='cursor:pointer' shape='poly' coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-79,90)' onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' /><area style='cursor:pointer' shape='poly' coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-79,108)' onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' /><area style='cursor:pointer' shape='poly' coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-79,126)' onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' /><area style='cursor:pointer' shape='poly' coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-79,144)' onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' /><area style='cursor:pointer' shape='poly' coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-79,162)' onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' /><area style='cursor:pointer' shape='poly' coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-79,180)' onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' /><area style='cursor:pointer' shape='poly' coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-79,198)' onmouseover='mouseOverColor("#990099")' alt='#990099' /><area style='cursor:pointer' shape='poly' coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-64,27)' onmouseover='mouseOverColor("#666633")' alt='#666633' /><area style='cursor:pointer' shape='poly' coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-64,45)' onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' /><area style='cursor:pointer' shape='poly' coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-64,63)' onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' /><area style='cursor:pointer' shape='poly' coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-64,81)' onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' /><area style='cursor:pointer' shape='poly' coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-64,99)' onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' /><area style='cursor:pointer' shape='poly' coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-64,117)' onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' /><area style='cursor:pointer' shape='poly' coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-64,135)' onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' /><area style='cursor:pointer' shape='poly' coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-64,153)' onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' /><area style='cursor:pointer' shape='poly' coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-64,171)' onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' /><area style='cursor:pointer' shape='poly' coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-64,189)' onmouseover='mouseOverColor("#993366")' alt='#993366' /><area style='cursor:pointer' shape='poly' coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-49,36)' onmouseover='mouseOverColor("#999966")' alt='#999966' /><area style='cursor:pointer' shape='poly' coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-49,54)' onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' /><area style='cursor:pointer' shape='poly' coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-49,72)' onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' /><area style='cursor:pointer' shape='poly' coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-49,90)' onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' /><area style='cursor:pointer' shape='poly' coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-49,108)' onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' /><area style='cursor:pointer' shape='poly' coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-49,126)' onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' /><area style='cursor:pointer' shape='poly' coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-49,144)' onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' /><area style='cursor:pointer' shape='poly' coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-49,162)' onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' /><area style='cursor:pointer' shape='poly' coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-49,180)' onmouseover='mouseOverColor("#660033")' alt='#660033' /><area style='cursor:pointer' shape='poly' coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-34,45)' onmouseover='mouseOverColor("#996633")' alt='#996633' /><area style='cursor:pointer' shape='poly' coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-34,63)' onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' /><area style='cursor:pointer' shape='poly' coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-34,81)' onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' /><area style='cursor:pointer' shape='poly' coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-34,99)' onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' /><area style='cursor:pointer' shape='poly' coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-34,117)' onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' /><area style='cursor:pointer' shape='poly' coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-34,135)' onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' /><area style='cursor:pointer' shape='poly' coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-34,153)' onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' /><area style='cursor:pointer' shape='poly' coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-34,171)' onmouseover='mouseOverColor("#990033")' alt='#990033' /><area style='cursor:pointer' shape='poly' coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-19,54)' onmouseover='mouseOverColor("#663300")' alt='#663300' /><area style='cursor:pointer' shape='poly' coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-19,72)' onmouseover='mouseOverColor("#996600")' alt='#996600' /><area style='cursor:pointer' shape='poly' coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-19,90)' onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' /><area style='cursor:pointer' shape='poly' coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-19,108)' onmouseover='mouseOverColor("#993300")' alt='#993300' /><area style='cursor:pointer' shape='poly' coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-19,126)' onmouseover='mouseOverColor("#990000")' alt='#990000' /><area style='cursor:pointer' shape='poly' coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-19,144)' onmouseover='mouseOverColor("#800000")' alt='#800000' /><area style='cursor:pointer' shape='poly' coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-19,162)' onmouseover='mouseOverColor("#993333")' alt='#993333' /></map>
        <div id='selectedhexagon' style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("selectedcolor.gif")'></div>
      
       </div>
</div>
<div class="col-md-1" id="color_value"><div id='divpreview'>&nbsp;</div></div>
</div>

<div class="row">
<div class="col-md-4" id="scale_label">Scale</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="scale"></div></div>
<div class="col-md-1" id="scale_value">1</div>
</div>


<div class="row">
<div class="col-md-4" id="translationx_label">TranslationX</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="translationx"></div></div>
<div class="col-md-1" id="translationx_value">0</div>
</div>

<div class="row">
<div class="col-md-4" id="translationy_label">TranslationY</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="translationy"></div></div>
<div class="col-md-1" id="translationy_value">0</div>
</div>

<div class="row">
<div class="col-md-4" id="translationz_label">TranslationZ</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="translationz"></div></div>
<div class="col-md-1" id="translationz_value">0</div>
</div>

<div class="row">
<div class="col-md-4" id="rotationx_label">RotationX</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="rotationx"></div></div>
<div class="col-md-1" id="rotationx_value">0</div>
</div>

<div class="row">
<div class="col-md-4" id="rotationy_label">RotationY</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="rotationy"></div></div>
<div class="col-md-1" id="rotationy_value">0</div>
</div>

<div class="row">
<div class="col-md-4" id="rotationz_label">RotationZ</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="rotationz"></div></div>
<div class="col-md-1" id="rotationz_value">0</div>
</div>


<div class="row">
<div class="col-md-4" id="clear_label">Clear:</div>
<div class="col-md-8" >
<ul class="actions">
	<li><a id="clear" class="button">Clear</a></li>
	<li class="hidden"><a id="undo" class="button">Undo</a></li>
</ul>
</div>
</div>
</ul>

<div class="row hidden">
<div class="col-md-4" id="statistics_label">Statistics:</div>
<div class="col-md-8" id="statistics"></div>
</div>
</ul>

</section>

<section id="two">
<h2>Screenshots</h2>
<div class="row">
	<article class="6u 12u$(xsmall) work-item">
		<a href="images/fulls/h11.jpg" class="image fit thumb"><img src="images/thumbs/h11.jpg" alt="" /></a>
		<h3>Models</h3>
	</article>
	<article class="6u$ 12u$(xsmall) work-item">
		<a href="images/fulls/h12.jpg" class="image fit thumb"><img src="images/thumbs/h12.jpg" alt="" /></a>
		<h3>Panel</h3>
	</article>
</div>
<ul class="actions">
	<li><a href="http://duruofei.com" class="button">Visit Author's Website</a></li>
</ul>
</section>


</div>

<footer id="footer"><ul class="icons"><li><a href="https://www.youtube.com/user/stareadrf" class="icon fa-youtube" target="_blank"><span class="label">YouTube</span></a></li><li><a href="https://scholar.google.com/citations?user=VnIyMxQAAAAJ&amp;hl=en&amp;oi=ao" class="icon fa-university" target="_blank"><span class="label">Google Scholar</span></a></li><li><a href="https://www.linkedin.com/in/duruofei" class="icon fa-linkedin" target="_blank"><span class="label">LinkedIn</span></a></li><li><a href="https://twitter.com/DuRuofei" class="icon fa-twitter" target="_blank"><span class="label">Twitter</span></a></li><li><a href="https://www.facebook.com/duruofei" class="icon fa-facebook" target="_blank"><span class="label">Facebook</span></a></li><li><a href="https://instagram.com/stareadrf/" class="icon fa-instagram" target="_blank"><span class="label">Instagram</span></a></li><li><a href="https://github.com/ruofeidu" class="icon fa-github" target="_blank"><span class="label">Github</span></a></li><li><a href="http://music.duruofei.com" class="icon fa-music" target="_blank"><span class="label">Music</span></a></li><li><a href="http://art.duruofei.com" class="icon fa-camera-retro" target="_blank"><span class="label">Art</span></a></li></ul><ul class="copyright"><li>© Ruofei Du</li><li>2015</li></ul></footer>

<!-- Scripts -->
<script src="assets/js/skel.min.js"></script>
<script src="assets/js/util.js"></script>

<!--[if lte IE 8]><script src="assets/js/ie/respond.min.js"></script><![endif]-->
<script src="assets/js/main.js"></script>
</body>
</html>