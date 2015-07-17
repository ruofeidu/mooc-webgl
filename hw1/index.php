<!DOCTYPE HTML>
<html>
<head>
<title>Assignment 1 Tessellation and Twist | Interactive Computer Graphics with WebGL | Ruofei Du</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!--[if lte IE 8]><script src="assets/js/ie/html5shiv.js"></script><![endif]-->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/ui-lightness/jquery-ui.css" />
<link rel="stylesheet" href="assets/css/main.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="assets/css/ie8.css" /><![endif]-->
<meta name="description" lang="en" content="Ruofei Du is a 3rd-year CS Ph.D. student advised by UMIACS Director Prof. Amitabh Varshney. His research mainly focus on virtual and augmented reality. His research interests include computer graphics, human-computer interaction and computer vision." />
<meta name="author" content="Ruofei Du">
<meta property="og:title" content="Assignment 1 Tessellation and Twist by Ruofei Du">
<meta property="og:image" content="http://duruofei.com/Public/img/avatar.jpg">
<meta property="og:description" content="Ruofei Du is a 3rd-year CS Ph.D. student advised by UMIACS Director Prof. Amitabh Varshney. His research mainly focus on virtual and augmented reality. His research interests include computer graphics, human-computer interaction and computer vision.">
<link rel="shortcut icon" type="image/x-icon" href="http://duruofei.com/Public/icon/favicon.ico" />
<link rel="icon" type="image/x-icon" href="http://duruofei.com/Public/icon/favicon.ico" />
<link rel="apple-touch-icon" sizes="57x57" href="http://duruofei.com/Public/icon/57.png" />
<link rel="apple-touch-icon" sizes="72x72" href="http://duruofei.com/Public/icon/72.png" />
<link rel="apple-touch-icon" sizes="114x114" href="http://duruofei.com/Public/icon/114.png" />
<link rel="apple-touch-icon" sizes="144x144" href="http://duruofei.com/Public/icon/144.png" />
<script id="vertex-shader" type="x-shader/x-vertex">
attribute vec4 vPosition;
attribute  vec4 vColor;
varying vec4 fColor;

void
main()
{
    fColor = vColor;
    gl_Position = vPosition;
}
</script>

<script id="fragment-shader" type="x-shader/x-fragment">
precision mediump float;
varying vec4 fColor;
void
main()
{
    gl_FragColor = fColor;
    //gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}
</script>
<script type="text/javascript" src="../Common/webgl-utils.js"></script>
<script type="text/javascript" src="../Common/initShaders.js"></script>
<script type="text/javascript" src="../Common/MV.js"></script>
<script type="text/javascript" src="assets/js/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/jquery.poptrox.min.js"></script>
<script type="text/javascript" src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
<script type="text/javascript" src="hw1.js"></script>
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
	<h2>WebGL MOOC Assignment 1: Tessellation and Twist</h2>
</header>
<p>This demo renders a twisted and tessellated triangle (5 pts); provides controls including amount of tessellation and twist, shape (3 pts); provides slider to set parameters (1 pt) and radio buttons for rendering effects. (1 pt) 
<i>Please scroll down for the interactive control panel.</i>
</p>
<div class="row">
<div class="col-md-12">
<canvas id="gl-canvas" width="100%">
Oops ... your browser doesn't support the HTML5 canvas element
</canvas>
</div>
</div>

<ul>
<div class="row hidden">
<div class="col-md-4" id="vertices_label">Vertices of the Triangle:</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="vertices"></div></div>
<div class="col-md-1" id="vertices_value">3</div>
</div>

<div class="row">
<div class="col-md-4" id="tessellation_label">Amount of Tessellation:</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="tessellation"></div></div>
<div class="col-md-1" id="tessellation_value">5</div>
</div>

<div class="row">
<div class="col-md-4" id="twist_label">Amount of Twist:</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="twist"></div></div>
<div class="col-md-1" id="twist_value">60</div>
</div>

<div class="row">
<div class="col-md-4" id="scale_label">Amount of Scale:</div>
<div class="col-md-7" style="margin-top: 10px;"><div id="scale"></div></div>
<div class="col-md-1" id="scale_value">1.0</div>
</div>

<div class="row">
<div class="col-md-4" id="shape_label">Shape:</div>
<div class="col-md-8" style="margin-top: 10px;">
<div id="shape">
<input type="radio" id="shape1" name="shape" value="0" checked="checked"><label for="shape1">Triangle</label>
<input type="radio" id="shape2" name="shape" value="1" ><label for="shape2">Square</label>
<input type="radio" id="shape3" name="shape" value="2" ><label for="shape3">Pentagon</label>
</div>
</div>
</div>

<div class="row">
<div class="col-md-4" id="render_label">Render Effect:</div>
<div class="col-md-8" style="margin-top: 10px;">
<div id="render">
<input type="radio" id="render1" name="render" value="0" checked="checked"><label for="render1">Fill</label>
<input type="radio" id="render2" name="render" value="1" ><label for="render2">Gasket</label>
<input type="radio" id="render3" name="render" value="2"><label for="render3">Wireframe</label>
</div>
</div>
</div>

<div class="row hidden">
<div class="col-md-4" id="animation_label">Animation:</div>
<div class="col-md-8" style="margin-top: 10px;">
<div id="animation">
<input type="radio" id="animation1" name="animation" value="0" checked="checked"><label for="animation1">Static</label>
<input type="radio" id="animation2" name="animation" value="1" ><label for="animation2">Self-rotating</label>
</div>
</div>
</div>

<div class="row">
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
		<h3>Twisted Maxwell Triangle Gasket</h3>
	</article>
	<article class="6u$ 12u$(xsmall) work-item">
		<a href="images/fulls/h12.jpg" class="image fit thumb"><img src="images/thumbs/h12.jpg" alt="" /></a>
		<h3>7 Tessellation 720 Twisted Pentagon Gasket</h3>
	</article>
	<article class="6u 12u$(xsmall) work-item">
		<a href="images/fulls/h13.jpg" class="image fit thumb"><img src="images/thumbs/h13.jpg" alt="" /></a>
		<h3>Twisted Filled Pentagon</h3>
	</article>
	<article class="6u$ 12u$(xsmall) work-item">
		<a href="images/fulls/h14.jpg" class="image fit thumb"><img src="images/thumbs/h14.jpg" alt="" /></a>
		<h3>Twisted Triangle Wireframe</h3>
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