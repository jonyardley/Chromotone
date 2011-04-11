/*------------------------------------------------------------

	
	CHROMOTONE (JS) v0.1
	Developed by Jon Yardley
	
	Based on orignial code and idea by 
	Jon Yardley, Chris North, Haley Gomez, Edward Gomez & 
	Robert Howell as part of .Astronomy 2011
	
	
------------------------------------------------------------*/

function Chromotone(input){

	this.container = input;
	this.qcontainer = "#"+input;

	this.version = "0.1";
	this.width = $(this.qcontainer).width();
	this.height = $(this.qcontainer).height();
	this.offset = $(this.qcontainer).offset();
	//this.offset.top = $(this.qcontainer).position().top;
	//this.offset.left = $(this.qcontainer).position().left;
	
	this.init();
		
}

Chromotone.prototype.init = function(){
	
	//set canvas size
	$(this.qcontainer).attr('width', this.width).attr('height', this.height);
	
	//set up canvas
	var canvas = document.getElementById(this.container);
	this.context = canvas.getContext('2d');

	//Load test image...
	this.image = document.getElementById("image");
	
	//print to canvas
	this.context.drawImage(this.image,0,0);
	
	//setup click events
	this.mouseEvents();

}

var amp;
var osc;

Chromotone.prototype.mouseEvents = function(){
	
	var ctInstance = this;
	
	$(this.qcontainer).mousedown(function(e){		
		this.dragging = true;
		var pos = ctInstance.getCPosition(e);
		var pixdata = ctInstance.context.getImageData(pos[0],pos[1],1,1);
		var pix = (pixdata.data[0] + pixdata.data[1] + pixdata.data[2] / 3)/255;
		amp = pix;
		console.log(amp);
		play();
		
		return false;
	}).mousemove(function(e){
		if(this.dragging){
			var pos = ctInstance.getCPosition(e);
			var pixdata = ctInstance.context.getImageData(pos[0],pos[1],1,1);
			var pix = (pixdata.data[0] + pixdata.data[1] + pixdata.data[2] / 3)/255;
			amp = pix;
		}

	}).mouseup(function(event){
		this.dragging = false;
	});


}

Chromotone.prototype.getCPosition = function(e){
		
	var x;
	var y;
	
	x = e.pageX;
	y = e.pageY;
	
   	x -= this.offset.left;
   	y -= this.offset.top;
	
	return [x,y];
	 
}

function play(){
var output = new Audio();

output.mozSetup(1,44100);

osc = new Oscillator(DSP.SIN, 100, amp, 10000, 22050);
   osc.generate();
   var signal = osc.signal;



	output.mozWriteAudio(signal);
}