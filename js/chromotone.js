/*------------------------------------------------------------

	
	CHROMOTONE (JS) v0.2
	Developed by Jon Yardley
	
	Based on orignial code and idea by 
	Jon Yardley, Chris North, Haley Gomez, Edward Gomez & 
	Robert Howell as part of .Astronomy 3 (2011)
	
	
------------------------------------------------------------*/

function Chromotone(input){

	//info
	this.version = "0.2";
	
	
	//container
	this.container = '#'+input;
	this.width = $(this.container).width();
	this.height = $(this.container).height();
	this.offset = $(this.container).offset();
	
		//arrays
		this.image = Array(); //array containing images inside container
		this.canvas = Array(); //array containing canvas info for each image
		this.context = Array(); //aarry of canvas contexts
		this.pix = Array(); //array for current pix value of each canvas image
	
	
	//Audio
	this.cAmp = 0; //current amplitue
	this.amp = 0; //new amplitude
	this.audiolet = Array();
	
		//arrays
		this.freq = Array(); //array of frequences to use
		this.sine = Array(); //array of sine waves
		this.gain = Array(); //array of gain controllers
		this.amp = Array(); //array of ampliude values
	
	//temp set frequencies!!!
	//Chromotone_fermi.jpg, G5 
	//Chromotone_xray.jpg, B5
	//Chromotone_DDS_blue.jpg, B4
	//Chromotone_DSS_green.jpg, E4
	//Chromotone_DSS_red.jpg, G3
	//Chromotone_Halpha.jpg, A3
	//Chromotone_IRAS.jpg, G2
	//Chromotone_planck.jpg, E2
	//Chromotone_radio.jpg, C1
	
	this.freq = ['G5','B5','B4','E4','G3','A3','G2','E2','C1'];
	
	
	this.init();
		
}



Chromotone.prototype.init = function(){
	
	var CI = this;
	
	//give each image inside container its own canvas to live in.
	CI.images2canvas();
	
	//Attach Mouse Events to each canvas
	CI.mouseEvents();

}



Chromotone.prototype.images2canvas = function(){
	
	var CI = this;

	//for each image create a canvas and place image inside.
	$(CI.container+' img').each(function(){
	
		//this index
		var index = $(this).index();
		
		//add image to images array()
		CI.image[index] = this;
		
		//wrap canvas around image
		$(this).wrap('<canvas class="chromotone-canvas" id="c'+index+'">');
		
		//add current canvas to array
		CI.canvas[index] = $(this).parent();
		
		//set this canvas dimentions
		$(CI.canvas[index]).attr('width', CI.width).attr('height', CI.height);
		
		//add this canvas context to array
		var ctx = $(CI.container+' canvas')[index].getContext('2d');
		CI.context[index] = ctx;
		
		//print image to this canvas
		CI.context[index].drawImage(CI.image[index],0,0);
		
	});
	
}



Chromotone.prototype.getCPosition = function(e){
	
	var CI = this;	
	var x;
	var y;
	
	x = e.pageX;
	x -= CI.offset.left;
	y = e.pageY;
  y -= CI.offset.top;
  x = x - 9; //hack!!!
	
	return [x,y];
	
}



Chromotone.prototype.mouseEvents = function(){

	var CI = this;
	
	$(CI.container).mousedown(function(e){
		
		//your now dragging
		this.dragging = true;
		//get curser position inside the container
		var pos = CI.getCPosition(e);
		
		//set pixel value for each canvas
		$(CI.container+' canvas').each(function(){
			var index = $(this).index();
			//get pixel value and add to array
			CI.pix[index] = CI.getPixelValue(index,pos[0],pos[1]);
		});
		
		//start playing audio!!!
		CI.play();
		
	}).mousemove(function(e){
			//are you dragging???
			if(this.dragging){
				var pos = CI.getCPosition(e);
				//set pixel value for each canvas
				$(CI.container+' canvas').each(function(){
					var index = $(this).index();
					//get pixel value and add to array
					CI.pix[index] = CI.getPixelValue(index,pos[0],pos[1]);
				});		
				
				//change gain on each output;
				CI.updateAmp();
			}
	}).mouseup(function(e){
		//not dragging anymore
		this.dragging = false;
		//stop playing audio!!!
		CI.stop();
	});

}



Chromotone.prototype.getPixelValue = function(i,x,y){

	var pixdata,pix,CI;
	CI = this;
	
	//get pixel data for this context
	pixdata = CI.context[i].getImageData(x,y,1,1);
	pix = ((pixdata.data[0] + pixdata.data[1] + pixdata.data[2]) / 3) / pixdata.data[3];
	
	return pix;

	
}



Chromotone.prototype.play = function(freq){

	var CI = this;
	
	//generic audio controller!
	
	
	$(CI.container+' canvas').each(function(){
	  var i = $(this).index();
	  var n = Note.fromLatin(CI.freq[i]);
	  var freq = n.frequency(); 
	  CI.audiolet[i] = new Audiolet();
	  CI.sine[i] = new Sine(CI.audiolet[i], freq);
  	CI.gain[i] = new Gain(CI.audiolet[i], CI.pix[i]);
  	CI.sine[i].connect(CI.gain[i]);
  	CI.gain[i].connect(CI.audiolet[i].output);
  
  });
 
}

Chromotone.prototype.stop = function(){
	var CI = this;
	
	$(CI.container+' canvas').each(function(){
		var i = $(this).index();
	CI.audiolet[i].output.remove()
	});
}

Chromotone.prototype.updateAmp = function(amp){
	
	var CI = this;
	
	$(CI.container+' canvas').each(function(){
	var i = $(this).index();
		CI.gain[i].gain.value = CI.pix[i];
	});
	
	
}