<!DOCTYPE html>
<html lang="">
<head>
	<meta charset="utf-8">
	<title>Chromotone | Explore the Universe with sound</title>
	<meta name="description" content="" />
	<meta name="keywords" content="" />
	<meta name="robots" content="" />
	<link href="css/screen.css" media="screen" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="js/jquery-1.5.2.min.js"></script>
	<script type="text/javascript" src="js/audiodata.js"></script>
	<script type="text/javascript" src="js/dsp.js"></script>
	<script type="text/javascript" src="js/chromotone.js"></script>
	<script>
		$(document).ready(function(){
			var chromotone = new Chromotone('chromotone');
		});
	</script>
</head>
<body>
	<div id="wrapper">
		<h1>Chromotone</h1>
		<p>This is work in progress...</p>
		<canvas id="chromotone">
			<img id="image" width="600" height="300" src="images/fullsky/Chromotone_DSS_red.jpg" />
		</canvas>
	</div>
</body>
</html>