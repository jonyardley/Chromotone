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

	this.width = $(this.qcontainer).width();
	this.height = $(this.qcontainer).height();
	this.offset = $(this.qcontainer).offset();
	//this.offset.top = $(this.qcontainer).position().top;
	//this.offset.left = $(this.qcontainer).position().left;
	this.amp = 0;
	this.g;//gain control
	this.ac;//audio context
	
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
			ctInstance.g.setGain(ctInstance.amp);
		}

	}).mouseup(function(event){
		ctInstance.ac.stop();
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
	
	this.ac = this.play.ac = new Beads.AudioContext();

	var modulator = new Beads.ugens.WavePlayer(this.ac, freq, Beads.data.Buffer.SINE);

	var modUGen = Beads.extend(new Beads.UGen(this.ac, 1, 1), {
		calculateBuffer : function() {
		
			for (var i = 0; i < this.bufferSize; i++) {
				for (var j = 0; j < this.ins; j++) {
					this.bufOut[j][i] = this.bufIn[j][i] * 10 + freq;
				}
			}
		}
	});
	
	modUGen.addInput(modulator);

	var carrier = new Beads.ugens.WavePlayer(this.ac, modUGen, Beads.data.Buffer.SINE);

	this.g = new Beads.ugens.Gain(this.ac, 1, this.amp);
	this.g.addInput(carrier);
	this.ac.out.addInput(this.g);
	this.ac.start();

}