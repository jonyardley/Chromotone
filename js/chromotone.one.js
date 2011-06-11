/*------------------------------------------------------------

	
	CHROMOTONE (JS) v0.1
	Developed by Jon Yardley
	
	Based on orignial code and idea by 
	Jon Yardley, Chris North, Haley Gomez, Edward Gomez & 
	Robert Howell as part of .Astronomy 3 (2011)
	
	
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
	this.amp = 0;
	this.osc = 0;
	
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

Chromotone.prototype.mouseEvents = function(){
	
	var ctInstance = this;
	
	$(this.qcontainer).mousedown(function(e){		
		this.dragging = true;
		var pos = ctInstance.getCPosition(e);
		var pixdata = ctInstance.context.getImageData(pos[0],pos[1],1,1);
		var pix = (pixdata.data[0] + pixdata.data[1] + pixdata.data[2] / 3)/255;
		ctInstance.amp = pix;
		ctInstance.play(440);
		
		return false;
	}).mousemove(function(e){
		if(this.dragging){
			var pos = ctInstance.getCPosition(e);
			var pixdata = ctInstance.context.getImageData(pos[0],pos[1],1,1);
			var pix = (pixdata.data[0] + pixdata.data[1] + pixdata.data[2] / 3)/255;
			if(pix > 1) pix = 1;
			ctInstance.amp = pix;
			ctInstance.updateAmp(ctInstance.amp);
		}

	}).mouseup(function(event){
		ctInstance.stop();
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

Chromotone.prototype.play = function(freq){

	var CI = this;
	
	CI.audiolet = new Audiolet();
  CI.sine = new Sine(CI.audiolet, freq);
  CI.gain = new Gain(CI.audiolet, CI.amp);
  
  CI.envelope = new Envelope(CI.audiolet, 1, [0,CI.amp] , [0.2,0], 0,
  	function() {
    	CI.audiolet.scheduler.addRelative(0,
      	CI.envelope.remove.bind(CI.envelope));
    }.bind(CI.envelope));
          
  CI.envelope.connect(CI.gain, 0, 1);
  CI.sine.connect(CI.gain);
  CI.gain.connect(CI.audiolet.output);
 
}

Chromotone.prototype.stop = function(){
	var CI = this;
	
	CI.audiolet.output.remove()
}

Chromotone.prototype.updateAmp = function(amp){
	
	var CI = this;
	
	
	CI.gain.gain.value = amp;
	
	
}