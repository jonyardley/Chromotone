/*
Beads.js is a JavaScript port of the Beads computer music and sound art library.
Copyright (C) 2010 Chris Morgan
Beads Copyright (C) Ollie Bown, Ben Porter and Benito Crawford

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
Array.prototype.deleteIndex = function (c) {
	return this.splice(c, 1)
};
Array.prototype.deleteElement = function (c) {
	c = this.indexOf(c);
	c != -1 && this.splice(c, 1);
	return c != -1
};
window.Beads = {
	extend: function (c, d) {
		for (var a in d) if (d.hasOwnProperty(a)) c[a] = d[a];
		return c
	},
	inherits: function (c, d) {
		function a() {}
		Beads.assert(d !== undefined, "Beads.inherits: superclass not defined.");
		Beads.assert(d.constructor === Function, "superclass must be a class.");
		Beads.assert(c.constructor === Function, "subclass must be a class.");
		a.prototype = d.prototype;
		c.prototype = new a;
		return c.prototype.constructor = c
	},
	abstractMethod: function () {
		Beads.error("Abstract method called!")
	},
	debug: function (c) {
		if (c && window.console !== undefined) {
			Beads.log = console.log ?
			function () {
				console.log.apply(console, arguments)
			} : function () {};
			Beads.assert = console.assert ?
			function () {
				console.assert.apply(console, arguments)
			} : function () {};
			Beads.error = console.error ?
			function () {
				console.error.apply(console, arguments)
			} : function () {};
			Beads.log("Logging enabled.")
		} else {
			window.console !== undefined && Beads.log === console.log && Beads.log("Logging disabled.");
			Beads.log = Beads.assert = Beads.error = function () {}
		}
	},
	flatten: function () {
		if (!Beads.isFlattened) {
			Beads.isFlattened =
			true;
			Beads.extend(Beads, Beads.analysis);
			Beads.extend(Beads, Beads.data);
			Beads.extend(Beads, Beads.data.buffers);
			Beads.extend(Beads, Beads.events);
			Beads.extend(Beads, Beads.ugens)
		}
	},
	globalise: function () {
		if (!Beads.isGlobalised) {
			Beads.isGlobalised = true;
			Beads.flatten();
			for (var c in Beads) if (c != "extend" && c != "inherits" && c != "abstractMethod" && c != "debug" && c != "flatten" && c != "globalise" && c != "log" && c != "assert" && c != "error" && c != "isFlattened" && c != "isGlobalised" && c != "supportedBrowser" && c != "Function" && c != "Base64") window[c] = Beads[c];
			window.BFunction = Beads.Function
		}
	},
	supportedBrowser: function () {
		return typeof Audio === "function"
	}
};
Beads.debug(false);
Beads.Float32Array = typeof window.Float32Array === "function" ? Float32Array : typeof window.WebGLFloatArray === "function" ? WebGLFloatArray : function (c) {
	return c instanceof Array ? c : Array(c)
};
Beads.Base64 = function () {
	function c(b) {
		return d(b) + String.fromCharCode(b >> 8 & 255)
	}
	function d(b) {
		return String.fromCharCode(b & 255)
	}
	var a = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "="];
	return {
		base64: function (b) {
			try {
				var e = window.btoa(b)
			} catch (f) {
				e = "";
				var g = b.length;
				if (g > 0) {
					for (var h = [0, 0, 0], j = 0, l = g % 3; b.length % 3 > 0;) b[b.length] = " ";
					for (; j < g;) {
						h = [b.charCodeAt(j++), b.charCodeAt(j++), b.charCodeAt(j++)];
						e += a[h[0] >> 2] + a[(h[0] & 3) << 4 | h[1] >> 4] + a[(h[1] & 15) << 2 | h[2] >> 6] + a[h[2] & 63]
					}
					if (l > 0) {
						e[e.length - 1] = "=";
						if (l == 2) {
							e[e.length - 2] = "=";
							e[e.length - 3] = a[(h[0] & 3) << 4]
						} else e[e.length - 2] = a[(h[1] & 15) << 2]
					}
				}
			}
			return e
		},
		base64_decode: function (b) {
			try {
				var e = window.atob(b)
			} catch (f) {
				e = "";
				var g = b.length;
				if (g > 3 && g % 4 == 0) {
					for (var h = [0, 0, 0, 0], j = 0; j < g;) {
						h = ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(j++)), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(j++)), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(j++)), "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(b.charAt(j++))];
						e += String.fromCharCode(h[0] << 2 | h[1] >> 4) + String.fromCharCode((h[1] & 15) << 4 | h[2] >> 2) + String.fromCharCode((h[2] & 3) << 6 | h[3])
					}
					if (h[3] >= 64) {
						e.length -= 1;
						if (h[2] >= 64) e.length -= 1
					}
				}
			}
			return e
		},
		to_little_endian_dword: function (b) {
			return c(b) + String.fromCharCode(b >> 16 & 255, b >> 24 & 255)
		},
		to_little_endian_word: c,
		to_byte: d
	}
}();
Beads.AudioContext = function (c, d, a) {
	if (c === undefined) c = Beads.AudioContext.DEFAULT_BUFFER_SIZE;
	this.bufferSizeInFrames = c;
	if (d === undefined) d = this.constructor.defaultAudioIO();
	if (a === undefined) a = this.constructor.defaultAudioFormat(2);
	this.stopped = true;
	this.maxReserveBufs = 50;
	this.outputAudioFormat = a;
	this.setBufferSize(c);
	this.out = new Beads.ugens.Gain(this, a.channels);
	this.audioIO = d;
	this.audioIO.context = this;
	this.audioIO.prepare()
};
Beads.extend(Beads.AudioContext, {
	DEFAULT_BUFFER_SIZE: 512,
	defaultAudioIO: function () {
		return typeof Audio === "function" && (new Audio).mozWriteAudio instanceof Function ? new Beads.MozAudioIO : new Beads.WAVEDataAudioIO
	},
	defaultAudioFormat: function () {
		return {
			sampleRate: 22050,
			channels: 2
		}
	},
	printCallChain: function (c, d) {
		for (var a = c.getConnectedInputs(), b = "", e = 0; e < d; e++) b += "  ";
		Beads.log(b + "- " + c);
		for (var f in a) Beads.AudioContext.printCallChain(a[f], d + 1)
	}
});
Beads.extend(Beads.AudioContext.prototype, {
	setupBufs: function () {
		for (this.bufferStore = []; this.bufferStore.length < this.maxReserveBufs;) this.bufferStore.push(new Beads.Float32Array(this.bufferSizeInFrames));
		this.zeroBuf = new Beads.Float32Array(this.bufferSizeInFrames)
	},
	update: function () {
		this.bufStoreIndex = 0;
		this.out.update();
		this.timeStep++
	},
	getBuf: function () {
		if (this.bufStoreIndex < this.bufferStore.length) return this.bufferStore[this.bufStoreIndex++];
		else {
			var c = new Beads.Float32Array(this.bufferSizeInFrames);
			this.bufferStore.push(c);
			this.bufStoreIndex++;
			return c
		}
	},
	getCleanBuf: function () {
		for (var c = this.getBuf(), d = 0; d < c.length; d++) c[d] = 0;
		return c
	},
	getZeroBuf: function () {
		return this.zeroBuf
	},
	setBufferSize: function (c) {
		this.bufferSizeInFrames = c;
		this.setupBufs()
	},
	getBufferSize: function () {
		return this.bufferSizeInFrames
	},
	getSampleRate: function () {
		return this.outputAudioFormat.sampleRate
	},
	getAudioFormat: function (c) {
		return c === undefined ? this.outputAudioFormat : {
			sampleRate: this.outputAudioFormat.sampleRate,
			channels: c
		}
	},
	postAudioFormatInfo: function () {
		console.group("Beads AudioFormat information");
		console.log("Sample Rate: " + this.outputAudioFormat.sampleRate);
		console.log("Channels: " + this.outputAudioFormat.channels);
		console.groupEnd()
	},
	printCallChain: function () {
		Beads.AudioContext.printCallChain(this.out, 0)
	},
	msToSamples: function (c) {
		return c * this.outputAudioFormat.sampleRate / 1E3
	},
	samplesToMs: function (c) {
		return c / this.outputAudioFormat.sampleRate * 1E3
	},
	getTimeStep: function () {
		return this.timeStep
	},
	generateTimeStamp: function (c) {
		return new Beads.TimeStamp(this, this.timeStep, c)
	},
	getTime: function () {
		return this.samplesToMs(this.timeStep * this.bufferSizeInFrames)
	},
	start: function () {
		if (this.stopped) {
			this.timeStep = 0;
			this.stopped = false;
			this.audioIO.start()
		}
	},
	stop: function () {
		this.stopped = true;
		this.audioIO.stop()
	},
	isRunning: function () {
		return !this.stopped
	},
	getAudioIO: function () {
		return this.audioIO
	}
});
Beads.AudioIO = function () {};
Beads.extend(Beads.AudioIO.prototype, {
	context: null,
	prepare: function () {
		return true
	},
	start: function () {
		Beads.abstractMethod()
	},
	stop: function () {
		return true
	},
	update: function () {
		this.context.update()
	}
});
Beads.MozAudioIO = function () {};
Beads.inherits(Beads.MozAudioIO, Beads.AudioIO);
Beads.extend(Beads.MozAudioIO.prototype, {
	prepare: function () {
		var c = this.context.outputAudioFormat;
		this.channels = c.channels;
		this.outputLine = new Audio;
		this.outputLine.mozSetup(c.channels, c.sampleRate);
		this.bufferSizeInFrames = this.context.bufferSizeInFrames;
		this.bufOut = new Beads.Float32Array(this.bufferSizeInFrames * this.channels);
		return true
	},
	start: function () {
		var c = this;
		this.interval = setInterval(function () {
			c.run()
		}, this.context.samplesToMs(this.bufferSizeInFrames));
		return true
	},
	stop: function () {
		clearInterval(this.interval);
		delete this.interval;
		return true
	},
	run: function () {
		var c = this.bufOutTail,
			d;
		if (c) {
			d = this.outputLine.mozWriteAudio(c);
			if (d < c.length) {
				this.bufOutTail = c.slice(d);
				return
			}
			this.bufOutTail = null
		}
		this.update();
		d = this.bufferSizeInFrames;
		c = this.bufOut;
		for (var a = 0, b = this.channels; a < b; ++a) for (var e = this.context.out.bufOut[a], f = 0, g = 0; f < d; ++f) {
			var h = e[f];
			c[a + b * g++] = h < -1 ? -1 : h > 1 ? 1 : h
		}
		d = this.outputLine.mozWriteAudio(c);
		if (d < c.length) this.bufOutTail = c.slice(d)
	}
});
Beads.WAVEDataAudioIO = function () {};
Beads.inherits(Beads.WAVEDataAudioIO, Beads.AudioIO);
Beads.extend(Beads.WAVEDataAudioIO.prototype, {
	prepare: function () {
		var c = this.context.outputAudioFormat;
		this.channels = c.channels;
		this.outputLine = new Beads.WAVEDataAudioIO.AudioThread(c.channels, c.sampleRate, 16, false);
		this.outTracker = 0;
		this.bufferSizeInFrames = this.context.bufferSizeInFrames;
		this.bufOut = new Beads.Float32Array(this.bufferSizeInFrames * this.channels);
		this.batchSize = 44100 / c.sampleRate * 15;
		if (this.channels > 2) {
			Beads.error("Oh dear, WAVEDataAudioIO currently doesn't support more than two channels.");
			return false
		}
		return true
	},
	start: function () {
		var c = this;
		this.interval = setInterval(function () {
			c.run()
		}, this.context.samplesToMs(this.bufferSizeInFrames));
		return true
	},
	stop: function () {
		clearInterval(this.interval);
		delete this.interval;
		return true
	},
	run: function () {
		this.update();
		for (var c = this.bufferSizeInFrames, d = this.bufOut, a = this.context.outputAudioFormat, b = 0, e = this.channels; b < e; ++b) for (var f = this.context.out.bufOut[b], g = 0, h = 0; g < c; ++g) {
			var j = f[g];
			d[b + e * h++] = j < -1 ? -1 : j > 1 ? 1 : j
		}
		this.outputLine = this.outTracker++ > 0 ? this.outputLine : new Beads.WAVEDataAudioIO.AudioThread(a.channels, a.sampleRate, 16, false);
		c = 0;
		for (a = d.length; c < a;) this.channels == 2 ? this.outputLine.appendSample([d[c++], d[c++]]) : this.outputLine.appendSample([d[c++]]);
		if (this.outTracker > this.batchSize) {
			this.outputLine.outputAudio();
			this.outTracker = 0
		}
	}
});
Beads.WAVEDataAudioIO.WAVEAudio = function (c, d, a) {
	this.NumChannels = c;
	this.SampleRate = d;
	this.BitsPerSample = a;
	this.samples = [];
	this.buildable = false;
	this.init = function () {
		if (this.NumChannels >= 1 && this.NumChannels <= 65535 && (this.BitsPerSample == 8 || this.BitsPerSample == 16)) this.buildable = true;
		else throw Error("Initial setup values for WAVEAudio were invalid.");
	};
	this.compileWAVE = function () {
		var b = this.BitsPerSample * this.NumChannels / 8,
			e = this.samples.length / this.NumChannels * b,
			f = "RIFF" + Beads.Base64.to_little_endian_dword(36 + e) + "WAVE";
		f += "fmt " + Beads.Base64.to_little_endian_dword(16) + Beads.Base64.to_little_endian_word(1) + Beads.Base64.to_little_endian_word(this.NumChannels) + Beads.Base64.to_little_endian_dword(this.SampleRate) + Beads.Base64.to_little_endian_dword(this.SampleRate * b) + Beads.Base64.to_little_endian_word(b) + Beads.Base64.to_little_endian_word(this.BitsPerSample);
		f += "data" + Beads.Base64.to_little_endian_dword(e);
		b = 0;
		e = this.samples.length;
		if (this.BitsPerSample == 8) for (; b < e;) f += Beads.Base64.to_byte(this.samples[b++]);
		else for (; b < e;) f += Beads.Base64.to_little_endian_word(this.samples[b++]);
		return f
	};
	this.checkSanity = function (b, e) {
		if (this.buildable && b.length == this.NumChannels) {
			for (channel in b) {
				var f = e ? this.convertRelativeUnits(b[channel]) : b[channel];
				switch (this.BitsPerSample) {
				case 8:
					if (f < 0 || f > 255) return false;
					break;
				case 16:
					if (f < -32768 || f > 32767) return false
				}
			}
			return true
		}
		return false
	};
	this.convertRelativeUnits = function (b) {
		switch (this.BitsPerSample) {
		case 8:
			return Math.round(b * 127.5 + 127.5);
		case 16:
			return Math.round(b * 32767.5 - 0.5)
		}
	};
	this.init()
};
Beads.WAVEDataAudioIO.WAVEAudio.prototype.appendSample = function (c, d) {
	if (this.checkSanity(c, d)) for (var a = 0, b = c.length; a < b;) this.samples.push(d ? this.convertRelativeUnits(c[a++]) : c[a++]);
	else throw Error("Could not append sample data into the WAVE PCM data.");
};
Beads.WAVEDataAudioIO.WAVEAudio.prototype.dumpSamples = function () {
	this.samples = []
};
Beads.WAVEDataAudioIO.WAVEAudio.prototype.replaceSample = function (c, d, a) {
	if (this.checkSanity(c, a) && !isNaN(this.samples[d * this.NumChannels])) for (currentChannel = 0; currentChannel < this.NumChannels; currentChannel++) this.samples[d * this.NumChannels + currentChannel] = a ? this.convertRelativeUnits(c[channel]) : c[channel];
	else throw Error("Could not replace a sample in the WAVE PCM data.");
};
Beads.WAVEDataAudioIO.WAVEAudio.prototype.removeSamples = function (c, d) {
	if (isNaN(this.samples[c * this.NumChannels])) this.samples.splice(c * this.NumChannels, d * this.NumChannels);
	else throw Error("Could not remove a sample in the WAVE PCM data.");
};
Beads.WAVEDataAudioIO.WAVEAudio.prototype.dataURI = function () {
	if (this.buildable) return "data:audio/wav;base64," + Beads.Base64.base64(this.compileWAVE());
	else throw Error("Could not output base64 encoded WAVE PCM data into a data URI.");
};
Beads.WAVEDataAudioIO.AudioThread = function (c, d, a, b) {
	this.NumChannels = c;
	this.SampleRate = d;
	this.BitsPerSample = typeof a == "number" ? a : 16;
	this.autoContinue = typeof b == "boolean" && b ? true : false;
	this.type = 0;
	this.ended = false;
	this.init = function () {
		this.checkAudioSupport();
		try {
			switch (this.type) {
			case 1:
				if (typeof this.audioHandle.canPlayType == "function") if (this.audioHandle.canPlayType("audio/wav") === "" || this.audioHandle.canPlayType("audio/wav") == "no") this.checkBGSoundSupport();
			case 2:
				this.waveHandle = new Beads.WAVEDataAudioIO.WAVEAudio(this.NumChannels, this.SampleRate, this.BitsPerSample);
				break;
			default:
				this.notSupported()
			}
		} catch (e) {
			throw Error(e.message);
		}
	};
	this.checkAudioSupport = function () {
		try {
			this.audioHandle = new Audio;
			this.type = 1
		} catch (e) {
			throw Error("Could not find audio support.");
		}
	};
	this.checkBGSoundSupport = function () {
		this.audioHandle = document.createElement("bgsound");
		this.type = 2;
		if (typeof this.audioHandle.loop == "undefined" || this.audioHandle.loop != 1) throw Error("No sound support was detected.");
	};
	this.notSupported = function () {
		this.type = 0;
		throw Error("A generic audio error in AudioThread has been issued.");
	};
	this.init()
};
Beads.WAVEDataAudioIO.AudioThread.prototype.appendSample = function (c) {
	switch (this.type) {
	case 1:
	case 2:
		this.waveHandle.appendSample(c, true);
		break;
	default:
		this.notSupported()
	}
};
Beads.WAVEDataAudioIO.AudioThread.prototype.replaceSamples = function (c, d) {
	switch (this.type) {
	case 1:
	case 2:
		this.waveHandle.replaceSamples(c, d, true);
		break;
	default:
		this.notSupported()
	}
};
Beads.WAVEDataAudioIO.AudioThread.prototype.removeSamples = function (c, d) {
	switch (this.type) {
	case 1:
	case 2:
		this.waveHandle.removeSamples(c, d);
		break;
	default:
		this.notSupported()
	}
};
Beads.WAVEDataAudioIO.AudioThread.prototype.dumpSamples = function () {
	switch (this.type) {
	case 1:
	case 2:
		this.waveHandle.dumpSamples();
		break;
	default:
		this.notSupported()
	}
};
Beads.WAVEDataAudioIO.AudioThread.prototype.outputAudio = function () {
	switch (this.type) {
	case 1:
		this.audioHandle.setAttribute("src", this.waveHandle.dataURI());
		this.autoContinue && this.audioHandle.setAttribute("loop", "loop");
		this.audioHandle.error === null ? this.audioHandle.play() : this.notSupported();
		break;
	case 2:
		this.audioHandle.setAttribute("src", this.waveHandle.dataURI());
		document.getElementsByTagName("body")[0].appendChild(this.audioHandle);
	default:
		this.notSupported()
	}
};
Beads.WAVEDataAudioIO.AudioThread.prototype.abort = function () {
	this.audioHandle.pause()
};
Beads.Bead = function () {};
Beads.extend(Beads.Bead.prototype, {
	paused: false,
	deleted: false,
	killListener: null,
	name: null,
	toString: function () {
		return this.name !== null ? this.constructor.toString() + " name=" + name : this.constructor.toString()
	},
	message: function (c) {
		this.paused || this.messageReceived(c)
	},
	messageReceived: function () {},
	start: function () {
		this.paused = false
	},
	kill: function () {
		if (!this.deleted) {
			this.deleted = true;
			this.killListener !== null && this.killListener.message(this)
		}
	},
	isPaused: function () {
		return this.paused
	},
	pause: function (c) {
		this.paused =
		c
	},
	setKillListener: function (c) {
		this.killListener = c
	},
	getKillListener: function () {
		return this.killListener
	},
	isDeleted: function () {
		return this.deleted
	}
});
Beads.BeadArray = function () {
	this.beads = []
};
Beads.inherits(Beads.BeadArray, Beads.Bead);
Beads.extend(Beads.BeadArray.prototype, {
	beads: null,
	forwardKillCommand: false,
	forwardPauseCommand: false,
	add: function (c) {
		this.beads.push(c)
	},
	remove: function (c) {
		this.beads.deleteElement(c)
	},
	get: function (c) {
		return this.beads[c]
	},
	clear: function () {
		this.beads = []
	},
	size: function () {
		return this.beads.length
	},
	getBeads: function () {
		return this.beads
	},
	messageReceived: function (c) {
		for (var d = this.clone(), a = 0; a < d.size(); a++) {
			var b = d.get(a);
			b.isDeleted() ? this.remove(b) : b.message(c)
		}
	},
	clone: function () {
		for (var c = new Beads.BeadArray, d = 0; d < this.size(); d++) c.add(this.beads[d]);
		return c
	},
	doesForwardKillCommand: function () {
		return this.forwardKillCommand
	},
	setForwardKillCommand: function (c) {
		this.forwardKillCommand = c
	},
	doesForwardPauseCommand: function () {
		return this.forwardPauseCommand
	},
	setForwardPauseCommand: function (c) {
		this.forwardPauseCommand = c
	},
	kill: function () {
		Beads.Bead.prototype.kill.call(this);
		if (this.forwardKillCommand) {
			var c = this.clone(),
				d;
			for (d in c.beads) c.beads[d].isDeleted() ? this.remove(c.beads[d]) : c.beads[d].kill()
		}
	},
	pause: function (c) {
		Beads.Bead.prototype.pause.call(this, c);
		if (this.forwardPauseCommand) {
			var d = this.clone(),
				a;
			for (a in d.beads) d.beads[a].isDeleted() ? this.remove(d.beads[a]) : d.beads[a].pause(c)
		}
	},
	start: function () {
		Beads.Bead.prototype.start.call(this);
		if (this.forwardPauseCommand) {
			var c = this.clone(),
				d;
			for (d in c.beads) c.beads[d].isDeleted() ? this.remove(c.beads[d]) : c.beads[d].start()
		}
	}
});
Beads.TimeStamp = function (c, d, a) {
	if (a === undefined) {
		d = Math.floor(d / c.bufferSizeInFrames);
		a = d % c.bufferSizeInFrames
	}
	this.context = c;
	this.timeStep = d;
	this.index = a
};
Beads.extend(Beads.TimeStamp.prototype, {
	getTimeMS: function () {
		return this.context.samplesToMs(this.getTimeSamples())
	},
	getTimeSamples: function () {
		return this.timeSamples = this.timeStep * this.context.bufferSizeInFrames + this.index
	},
	since: function (c) {
		return this.getTimeMS() - c.getTimeMS()
	},
	isBefore: function (c) {
		if (this.timeStep < c.timeStep) return true;
		else if (this.timeStep == c.timeStep && this.timeSamples < c.timeSamples) return true;
		return false
	},
	isAfter: function (c) {
		if (this.timeStep > c.timeStep) return true;
		else if (this.timeStep == c.timeStep && this.timeSamples > c.timeSamples) return true;
		return false
	}
});
Beads.TimeStamp.subtract = function (c, d, a) {
	return new Beads.TimeStamp(c, d.getTimeSamples() - a.getTimeSamples())
};
Beads.UGen = function (c, d, a) {
	if (arguments.length == 1) a = d = 0;
	else if (arguments.length == 2) {
		a = d;
		d = 0
	}
	Beads.assert(c instanceof Beads.AudioContext);
	Beads.assert(typeof d == "number");
	Beads.assert(typeof a == "number");
	this.dependents = [];
	this.noInputs = true;
	this.lastTimeStep = -1;
	this.outputInitializationRegime = Beads.UGen.OutputInitializationRegime.JUNK;
	this.outputPauseRegime = Beads.UGen.OutputPauseRegime.ZERO;
	this.timerMode = false;
	this.setIns(d);
	this.setOuts(a);
	this.setContext(c)
};
Beads.inherits(Beads.UGen, Beads.Bead);
Beads.UGen.OutputInitializationRegime = {
	ZERO: 0,
	NULL: 1,
	JUNK: 2,
	RETAIN: 3
};
Beads.UGen.OutputPauseRegime = {
	ZERO: 0,
	RETAIN: 1,
	NULL: 2
};
Beads.UGen.envelopeGetterMethods = {};
Beads.extend(Beads.UGen.prototype, {
	context: null,
	ins: 0,
	outs: 0,
	bufIn: null,
	bufOut: null,
	bufferSize: 0,
	inputsAtChannel: null,
	dependents: null,
	noInputs: true,
	lastTimeStep: 0,
	timerMode: false,
	timeTakenLastUpdate: 0,
	outputInitializationRegime: Beads.UGen.OutputInitializationRegime.JUNK,
	outputPauseRegime: Beads.UGen.OutputInitializationRegime.ZERO,
	setContext: function (c) {
		this.context = c;
		if (c !== null) {
			this.bufferSize = c.bufferSizeInFrames;
			this.setupInputBuffer();
			this.setupOutputBuffer();
			this.zeroIns();
			this.zeroOuts()
		} else this.bufOut = this.bufIn = null
	},
	setIns: function (c) {
		this.ins = c;
		this.inputsAtChannel = Array(c);
		for (var d = 0; d < c; d++) this.inputsAtChannel[d] = []
	},
	getIns: function () {
		return this.ins
	},
	setOuts: function (c) {
		this.outs = c
	},
	getOuts: function () {
		return this.outs
	},
	setupInputBuffer: function () {
		this.bufIn = Array(this.ins);
		for (var c = 0; c < this.ins; c++) this.bufIn[c] = new Beads.Float32Array(this.bufferSize)
	},
	setupOutputBuffer: function () {
		this.bufOut = Array(this.outs);
		for (var c = 0; c < this.outs; c++) this.bufOut[c] = new Beads.Float32Array(this.bufferSize)
	},
	zeroOuts: function () {
		for (var c = 0; c < this.outs; c++) this.bufOut[c] = this.context.getZeroBuf()
	},
	zeroIns: function () {
		for (var c = 0; c < this.ins; c++) this.bufIn[c] = this.context.getZeroBuf()
	},
	setOutsToPause: function () {
		switch (this.outputPauseRegime) {
		case Beads.UGen.OutputPauseRegime.ZERO:
			for (var c = 0; c < this.outs; c++) this.bufOut[c] = this.context.getZeroBuf();
			break;
		case Beads.UGen.OutputPauseRegime.NULL:
			for (c = 0; c < this.outs; c++) this.bufOut[c] = null
		}
	},
	initializeOuts: function () {
		switch (this.outputInitializationRegime) {
		case Beads.UGen.OutputInitializationRegime.JUNK:
			for (var c =
			0; c < this.outs; c++) this.bufOut[c] = this.context.getBuf();
			break;
		case Beads.UGen.OutputInitializationRegime.ZERO:
			for (c = 0; c < this.outs; c++) this.bufOut[c] = this.context.getCleanBuf();
			break;
		case Beads.UGen.OutputInitializationRegime.RETAIN:
			break;
		default:
			for (c = 0; c < this.outs; c++) this.bufOut[c] = null
		}
	},
	pullInputs: function () {
		for (var c = this.dependents.length, d = 0; d < c; d++) {
			var a = this.dependents[d];
			if (a.isDeleted()) {
				this.dependents.deleteIndex(d);
				d--;
				c--
			} else a.update()
		}
		if (this.noInputs) {
			if (this.ins !== 0) for (a = 0; a < this.inputsAtChannel.length; a++) this.bufIn[a] = this.context.getZeroBuf()
		} else {
			this.noInputs = true;
			for (a = 0; a < this.inputsAtChannel.length; a++) {
				c = this.inputsAtChannel[a].length;
				this.bufIn[a] = this.context.getZeroBuf();
				if (c == 1) {
					var b = this.inputsAtChannel[a][0];
					if (b.ugen.isDeleted()) this.removeInputAtChannel(a, b);
					else {
						b.ugen.update();
						this.noInputs = false;
						this.bufIn[a] = b.ugen.bufOut[b.index];
						if (this.bufIn[a] === null) for (var e = this.bufIn[a] = this.context.getBuf(), f = 0; f < this.bufferSize; f++) e[f] = b.ugen.getValue(b.index, f)
					}
				} else if (c !== 0) {
					e = this.bufIn[a] = this.context.getCleanBuf();
					for (d = 0; d < c; d++) {
						b = this.inputsAtChannel[a][d];
						if (b.ugen.isDeleted()) {
							this.removeInputAtChannel(a, b);
							c--;
							d--
						} else {
							b.ugen.update();
							this.noInputs = false;
							for (f = 0; f < this.bufferSize; f++) e[f] += b.ugen.getValue(b.index, f)
						}
					}
				}
			}
		}
	},
	update: function () {
		if (!this.paused) {
			if (!this.isUpdated()) {
				var c;
				if (this.timerMode) c = (new Date).getTime();
				this.lastTimeStep = this.context.timeStep;
				this.pullInputs();
				this.initializeOuts();
				this.calculateBuffer();
				if (this.timerMode) this.timeTakenLastUpdate = (new Date).getTime() - c
			}
			this.paused && this.setOutsToPause()
		}
	},
	addInput: function (c, d, a) {
		if (d === undefined) {
			d = c;
			if (this.ins !== 0 && d.outs !== 0) for (c = 0; c < this.ins; c++) this.addInput(c, d, c % d.outs)
		} else {
			this.inputsAtChannel[c].push({
				ugen: d,
				index: a
			});
			this.noInputs = false
		}
	},
	crossfadeInput: function (c, d, a) {
		this.removeAllConnections(c);
		var b = new Beads.ugens.Envelope(this.context, 1),
			e = new Beads.ugens.Gain(this.context, c.outs, b);
		b.addSegment(0, a, new Beads.events.KillTrigger(e));
		e.addInput(c);
		this.addInput(e);
		b = new Beads.ugens.Envelope(this.context, 0);
		var f = new Beads.ugens.Gain(this.context, d.outs, b);
		e = new Beads.Bead;
		var g = this;
		e.messageReceived = function () {
			g.removeAllConnections(f);
			g.addInput(d)
		};
		b.addSegment(1, a, e);
		f.addInput(c);
		this.addInput(f)
	},
	addDependent: function (c) {
		this.dependents.push(c)
	},
	removeDependent: function (c) {
		this.dependents.deleteElement(c)
	},
	clearDependents: function () {
		this.dependents = []
	},
	getNumberOfConnectedUGens: function (c) {
		return this.inputsAtChannel[c].length
	},
	getNumberOfDependents: function () {
		return this.dependents.length
	},
	containsInput: function (c) {
		if (!this.noInputs) for (var d = 0; d < this.inputsAtChannel.length; d++) for (var a in this.inputsAtChannel[d]) if (c.equals(this.inputsAtChannel[d][a].ugen)) return true;
		return false
	},
	getConnectedInputs: function () {
		for (var c = [], d = 0; d < this.ins; d++) for (var a in this.inputsAtChannel[d])!this.inputsAtChannel[d][a].ugen in c && c.push(this.inputsAtChannel[d][a].ugen);
		return c
	},
	removeInputAtChannel: function (c, d) {
		this.inputsAtChannel[c].deleteElement(d)
	},
	removeAllConnections: function (c) {
		if (!this.noInputs) {
			for (var d =
			0, a = 0; a < this.inputsAtChannel.length; a++) {
				var b = Beads.extend({}, this.inputsAtChannel[a]),
					e;
				for (e in b) if (c == b[e].ugen) this.removeInputAtChannel(a, b[e]);
				else d++
			}
			if (d === 0) {
				this.noInputs = true;
				this.zeroIns()
			}
		}
	},
	removeConnection: function (c, d, a) {
		if (this.noInputs) return false;
		else {
			var b = 0,
				e = false,
				f = Beads.extend({}, this.inputsAtChannel[c]),
				g;
			for (g in f) if (d == f[g].ugen && f[g].index == a) {
				this.removeInputAtChannel(c, f[g]);
				e = true
			} else b++;
			if (b === 0) {
				this.noInputs = true;
				this.zeroIns()
			}
			return e
		}
	},
	clearInputConnections: function () {
		for (var c =
		0; c < this.inputsAtChannel.length; c++) {
			var d = Beads.extend({}, this.inputsAtChannel[c]),
				a;
			for (a in d) this.removeInputAtChannel(c, d[a]);
			this.noInputs = true;
			this.zeroIns()
		}
	},
	calculateBuffer: function () {
		Beads.abstractMethod()
	},
	getValue: function (c, d) {
		if (arguments.length === 0) d = c = 0;
		return this.bufOut[c][d]
	},
	getOutBuffer: function (c) {
		return this.bufOut[c]
	},
	getValueDouble: function () {
		return this.getValue.apply(this, arguments)
	},
	setValue: function () {},
	isUpdated: function () {
		return this.lastTimeStep == this.context.timeStep
	},
	pause: function (c) {
		!this.paused && c && this.setOutsToPause();
		Beads.Bead.prototype.pause.call(this, c)
	},
	isTimerMode: function () {
		return this.timerMode
	},
	setTimerMode: function (c) {
		this.timerMode = c
	},
	getTimeTakenLastUpdate: function () {
		return this.timeTakenLastUpdate
	}
});
Beads.UGenChain = function (c, d, a) {
	Beads.UGen.call(this, c, d, a);
	this.chainIn = Beads.extend(new Beads.UGen(c, 0, d), {
		calcuateBuffer: function () {}
	});
	this.chainIn.bufOut = this.bufIn;
	this.chainIn.outputInitializationRegime = Beads.UGen.OutputInitializationRegime.RETAIN;
	this.chainOut = Beads.extend(new Beads.UGen(c, a, 0), {
		calculateBuffer: function () {}
	});
	this.bufOut = this.chainOut.bufIn;
	this.outputInitializationRegime = Beads.UGen.OutputInitializationRegime.RETAIN
};
Beads.inherits(Beads.UGenChain, Beads.UGen);
Beads.extend(Beads.UGenChain.prototype, {
	drawFromChainInput: function (c, d, a) {
		if (d === undefined) c.addInput(this.chainIn);
		else if (a === undefined) for (a = 0; a < d.ins; a++) d.addInput(a, this.chainIn, c);
		else d.addInput(a, this.chainIn, c)
	},
	addToChainOutput: function (c, d, a) {
		if (d === undefined) this.chainOut.addInput(c);
		else if (a === undefined) for (a = 0; a < d.outs; a++) this.chainOut.addInput(c, d, a);
		else this.chainOut.addInput(c, d, a)
	},
	calculateBuffer: function () {
		this.preFrame();
		this.chainOut.update();
		this.postFrame()
	},
	preFrame: function () {},
	postFrame: function () {}
});
Beads.data = function () {
	function c(a, b, e) {
		e = e ||
		function () {};
		Beads.inherits(e, d.BufferFactory);
		if (b !== undefined) e.prototype.generateBuffer = function (f) {
			for (var g = new d.Buffer(f), h = 0; h < f; h++) g.buf[h] = b(h, f);
			return g
		};
		e.prototype.getName = typeof a == "function" ? a : function () {
			return a
		};
		return e
	}
	var d = {};
	d.BufferFactory = function () {};
	Beads.extend(d.BufferFactory.prototype, {
		generateBuffer: function () {
			Beads.abstractMethod()
		},
		getName: function () {
			Beads.abstractMethod()
		},
		getDefault: function () {
			var a = this.getName();
			a in d.Buffer.staticBufs || (d.Buffer.staticBufs[a] = this.generateBuffer(d.BufferFactory.DEFAULT_BUFFER_SIZE));
			return d.Buffer.staticBufs[a]
		}
	});
	d.BufferFactory.DEFAULT_BUFFER_SIZE = 4096;
	d.buffers = {};
	d.buffers.CosineWindow = c("Cosine", function (a, b) {
		return Math.sin(a / b * Math.PI)
	});
	d.buffers.CurveBuffer = c(function () {
		return "Curve " + this.curviness
	}, function (a, b) {
		return Math.pow(a / b, this.exponent)
	}, function (a) {
		this.curviness = a < -1 ? -1 : a > 1 ? 1 : a;
		this.exponent = Math.exp(-this.curviness)
	});
	d.buffers.Exp01Buffer = c("Exp01", function (a, b) {
		return Math.exp(1 - (b - 1) / a)
	});
	d.buffers.HanningWindow = c("Hanning");
	d.buffers.HanningWindow.prototype.generateBuffer = function (a) {
		for (var b = new d.Buffer(a), e = a / 4, f = a - e, g = 0; g < a; g++) b.buf[g] = g < e || g > f ? 0.5 * (1 + Math.cos(Math.PI + Math.PI * 4 * g / (a - 1))) : 1;
		return b
	};
	d.buffers.Log01Buffer = c("Log01", function (a, b) {
		return 1 / (1 - Math.log(a / (b - 1)))
	});
	d.buffers.MeanFilter = c("MeanFilter", function (a, b) {
		return 1 / b
	});
	d.buffers.NoiseBuffer = c("Noise", function () {
		return 1 - 2 * Math.random()
	});
	d.buffers.OneWindow = c("Ones", function () {
		return 1
	});
	d.buffers.RampBuffer = c("Ramp", function (a, b) {
		return this.ramp((a + 0.5) / b) / b
	});
	d.buffers.RampBuffer.ramp = function (a) {
		return 2 * a
	};
	d.buffers.SawBuffer = c("Saw", function (a, b) {
		return a / b * 2 - 1
	});
	d.buffers.SineBuffer = c("Sine", function (a, b) {
		return Math.sin(2 * Math.PI * a / b)
	});
	d.buffers.SquareBuffer = c("Square");
	d.buffers.SquareBuffer.prototype.generateBuffer = function (a) {
		for (var b = new d.Buffer(a), e = a / 2, f = 0; f < e; f++) b.buf[f] = 1;
		for (f = e; f < a; f++) b.buf[f] = -1;
		return b
	};
	d.buffers.TriangleBuffer = c("Triangle", function (a, b) {
		return a < b / 2 ? 4 * a / b - 1 : 1 - (4 * (a - b / 2) / b - 1)
	});
	d.buffers.TriangularWindow = c("TriangularBuffer", function (a, b) {
		return this.tri((a + 0.5) / b) / b
	});
	d.buffers.TriangularWindow.tri = function (a) {
		return a < 0.5 ? 4 * a : 4 * (1 - a)
	};
	d.Buffer = function (a) {
		this.buf = new Beads.Float32Array(a)
	};
	d.Buffer.staticBufs = {};
	Beads.extend(d.Buffer, {
		SINE: (new d.buffers.SineBuffer).getDefault(),
		SAW: (new d.buffers.SawBuffer).getDefault(),
		SQUARE: (new d.buffers.SquareBuffer).getDefault(),
		TRIANGLE: (new d.buffers.TriangleBuffer).getDefault(),
		NOISE: (new d.buffers.NoiseBuffer).getDefault()
	});
	Beads.extend(d.Buffer.prototype, {
		getValueFraction: function (a) {
			var b = Math.floor(a * this.buf.length);
			return this.buf[b < 0 ? 0 : a >= 1 ? this.buf.length - 1 : b]
		},
		getValueIndex: function (a) {
			return this.buf[a < 0 ? 0 : a >= this.buf.length ? this.buf.length - 1 : a]
		},
		toString: function () {
			for (var a = "", b = 0; b < this.buf.length; b++) a += this.buf[b] + " ";
			return a
		}
	});
	d.Pitch = {
		LOG2: 0.6931472,
		ftom: function (a) {
			return Math.max(0, Math.log(a / 440) / d.Pitch.LOG2 * 12 + 69)
		},
		mtof: function (a) {
			return 440 * Math.pow(2, (a - 69) / 12)
		},
		forceToScale: function (a, b, e) {
			if (e === undefined) e = 12;
			var f = a % e;
			a = a / e;
			for (var g = -1, h = b.length - 1; h >= 0; h--) if (f >= b[h]) {
				g = b[h];
				break
			}
			if (g == -1) g = f;
			return a * e + g
		},
		forceFrequencyToScale: function (a, b) {
			return d.Pitch.mtof(d.Pitch.forceToScale(Math.floor(d.Pitch.ftom(a)), b))
		},
		pitchNames: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
		dorian: [0, 2, 3, 5, 7, 9, 10],
		major: [0, 2, 4, 5, 7, 9, 11],
		minor: [0, 2, 3, 5, 7, 8, 10],
		circleOfFifths: [0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7]
	};
	return d
}();
Beads.events = function () {
	function c(a, b) {
		Beads.inherits(a, Beads.Bead);
		a.prototype.messageReceived = b;
		return a
	}
	var d = {};
	d.AudioContextStopTrigger = c(function (a) {
		this.ac = a
	}, function () {
		this.kill()
	});
	d.AudioContextStopTrigger.prototype.kill = function () {
		this.ac.stop()
	};
	d.KillTrigger = c(function (a) {
		this.receiver = a
	}, function () {
		this.receiver !== null && this.receiver.kill()
	});
	d.PauseTrigger = c(function (a) {
		this.receiver = a
	}, function () {
		this.receiver !== null && this.receiver.pause(true)
	});
	d.StartTrigger = c(function (a) {
		this.receiver =
		a
	}, function () {
		this.receiver !== null && this.receiver.start()
	});
	return d
}();
Beads.ugens = function () {
	function c(a, b) {
		var e = a ||
		function () {};
		Beads.inherits(e, Beads.UGen);
		e.prototype.calculateBuffer = b;
		return e
	}
	var d = {};
	d.Clicker = c(function (a, b) {
		Beads.UGen.call(this, a, 0, 1);
		b = Math.abs(b);
		this.strength = b < 1 ? b : 1;
		this.done = false
	}, function () {
		if (this.done) this.kill();
		else {
			this.bufOut[0][0] = this.strength;
			this.done = true
		}
	});
	d.Clock = c(function (a, b) {
		if (b === undefined) b = new d.Static(a, 1E3);
		else if (typeof b === "number") b = new d.Static(a, b);
		Beads.UGen.call(this, a, 0, 0);
		this.intervalEnvelope = b;
		this.listeners =
		new Beads.BeadArray;
		this.reset();
		this.ticksPerBeat = 16;
		this.click = false;
		this.clickStrength = 0.1;
		this.subticks = new Beads.Float32Array(a.getBufferSize())
	}, function () {
		this.intervalEnvelope.update();
		for (var a = 0; a < this.bufferSize; a++) {
			this.subticks[a] = this.point;
			var b = this.intervalEnvelope.getValueDouble(0, a),
				e = Math.max(1, Math.abs(b) / this.ticksPerBeat),
				f = b < 0;
			if (f) e *= -1;
			for (this.point += 1 / this.context.msToSamples(e); !f && this.point >= this.count + 1;) {
				this.tick();
				if (b < 0) this.count--;
				else b > 0 && this.count++
			}
			for (; f && this.point <= this.count;) {
				this.tick();
				if (b < 0) this.count--;
				else b > 0 && this.count++
			}
		}
	});
	Beads.extend(d.Clock.prototype, {
		isClicking: function () {
			return this.click
		},
		setClick: function (a) {
			this.click = a
		},
		addMessageListener: function (a) {
			this.listeners.add(a)
		},
		removeMessageListener: function (a) {
			this.listeners.remove(a)
		},
		reset: function () {
			this.point = 0;
			this.count = -1
		},
		getCount: function () {
			return Math.floor(this.point)
		},
		setIntervalEnvelope: function (a) {
			this.intervalEnvelope = a
		},
		getIntervalEnvelope: function () {
			return this.intervalEnvelope
		},
		getTempo: function () {
			return 6E4 / Math.abs(this.intervalEnvelope.getValue())
		},
		tick: function () {
			this.click && this.isBeat() && this.context.out.addInput(new d.Clicker(this.context, this.clickStrength));
			this.listeners.message(this)
		},
		getInt: function () {
			return parseInt(this.getCount())
		},
		getTicksPerBeat: function () {
			return this.ticksPerBeat
		},
		setTicksPerBeat: function (a) {
			this.ticksPerBeat = Math.max(1, a)
		},
		isBeat: function (a) {
			return a === undefined ? this.getCount() % this.ticksPerBeat === 0 : this.getCount() % this.ticksPerBeat === 0 && this.getBeatCount() % a === 0
		},
		getBeatCount: function () {
			return parseInt(this.getCount() / this.ticksPerBeat)
		},
		getSubTickAtIndex: function (a) {
			return this.subticks[a]
		},
		getSubTickNow: function () {
			return this.point
		}
	});
	d.DelayEvent = c(function (a, b, e) {
		Beads.UGen.call(this, a, 0, 0);
		this.sampleDelay = a.msToSamples(b);
		this.reset();
		this.triggeredAfter(e || false)
	}, function () {
		if (this.sampleDelay - this.count > this.threshold) this.count += this.bufferSize;
		else this.trigger()
	});
	Beads.extend(d.DelayEvent.prototype, {
		reset: function () {
			this.count =
			0
		},
		trigger: function () {
			Beads.abstractMethod()
		},
		getSampleDelay: function () {
			return this.context.samplesToMs(this.sampleDelay)
		},
		setSampleDelay: function (a) {
			this.sampleDelay = this.context.msToSamples(a);
			return this
		},
		getCount: function () {
			return this.context.samplesToMs(this.count)
		},
		isTriggeredAfter: function () {
			return this.triggerAfter
		},
		triggeredAfter: function (a) {
			this.threshold = (this.triggerAfter = a) ? 0 : this.bufferSize;
			return this
		}
	});
	d.DelayTrigger = function (a, b, e, f) {
		d.DelayEvent.call(this, a, b);
		this.receiver = e;
		this.message = f || this
	};
	Beads.inherits(d.DelayTrigger, d.DelayEvent);
	Beads.extend(d.DelayTrigger.prototype, {
		trigger: function () {
			this.receiver !== null && this.receiver.message(this.message);
			this.kill()
		},
		getReceiver: function () {
			return this.receiver
		},
		setReceiver: function (a) {
			this.receiver = a;
			return this
		},
		getMessage: function () {
			return this.message
		},
		setMessage: function (a) {
			this.message = a;
			return this
		}
	});
	d.Envelope = c(function (a, b) {
		Beads.UGen.call(this, a, 1);
		this.segments = [];
		this.currentTime = this.currentValue = this.currentStartValue =
		0;
		this.currentSegment = null;
		this.unchanged = this.lock = false;
		this.outputInitializationRegime = Beads.UGen.OutputInitializationRegime.RETAIN;
		this.outputPauseRegime = Beads.UGen.OutputPauseRegime.RETAIN;
		this.myBufOut = new Beads.Float32Array(this.bufferSize);
		this.bufOut[0] = this.myBufOut;
		b !== undefined && this.setValue(b)
	}, function () {
		if (!this.unchanged) {
			for (var a = false, b = 0; b < this.bufferSize; ++b) {
				if (this.currentSegment === null) this.getNextSegment();
				else if (this.currentSegment.duration === 0) {
					this.getNextSegment();
					a =
					true
				} else {
					a = true;
					var e;
					e = this.currentSegment.curvature != 1 ? Math.pow(this.currentTime / this.currentSegment.duration, this.currentSegment.curvature) : this.currentTime / this.currentSegment.duration;
					this.currentValue = (1 - e) * this.currentStartValue + e * this.currentSegment.endValue;
					this.currentTime++;
					this.currentTime > this.currentSegment.duration && this.getNextSegment()
				}
				this.myBufOut[b] = this.currentValue
			}
			if (!a) this.unchanged = true
		}
	});
	Beads.extend(d.Envelope.prototype, {
		lock: function (a) {
			this.lock = a;
			return this
		},
		isLocked: function () {
			return this.lock
		},
		addSegment: function (a, b, e, f) {
			if (!this.lock) {
				if (e === undefined) e = 1;
				else if (e instanceof Beads.Bead) {
					f = e;
					e = 1
				}
				if (f === undefined) f = null;
				if (!isNaN(a) && a !== Infinity) {
					this.segments.push({
						endValue: a,
						duration: this.context.msToSamples(b),
						curvature: Math.abs(e),
						trigger: f
					});
					this.unchanged = false
				}
			}
			return this
		},
		addSegments: function (a) {
			if (!this.lock) for (var b in a) if (!isNaN(a[b].endValue) && a[b].endValue !== Infinity) {
				this.segments.push(a[b]);
				this.unchanged = false
			}
			return this
		},
		setValue: function (a) {
			if (!this.lock) {
				this.clear();
				this.addSegment(a, 0);
				this.currentValue = a
			}
		},
		clear: function () {
			if (!this.lock) {
				this.segments = [];
				this.currentSegment = null
			}
			return this
		},
		getNextSegment: function () {
			if (this.currentSegment !== null) {
				this.currentValue = this.currentStartValue = this.currentSegment.endValue;
				this.segments.deleteElement(this.currentSegment);
				this.currentSegment.trigger !== null && this.currentSegment.trigger.message(this)
			} else this.currentStartValue = this.currentValue;
			this.currentSegment = this.segments.length > 0 ? this.segments[0] : null;
			this.currentTime =
			0
		},
		getCurrentValue: function () {
			return this.currentValue
		},
		getValue: function (a, b) {
			return this.unchanged ? this.currentValue : this.myBufOut[b]
		}
	});
	d.Function = c(function () {
		Beads.UGen.call(this, arguments[0].context, 1);
		this.inputs = Array.prototype.slice.call(arguments);
		this.x = new Beads.Float32Array(this.inputs.length)
	}, function () {
		for (var a = 0; a < this.inputs.length; a++) this.inputs[a].update();
		for (a = 0; a < this.bufferSize; a++) {
			for (var b = 0; b < this.inputs.length; b++) this.x[b] = this.inputs[b].getValue(0, a);
			this.bufOut[0][a] =
			this.calculate()
		}
	});
	d.Function.prototype.calculate = function () {
		Beads.abstractMethod()
	};
	d.Gain = c(function (a, b, e) {
		Beads.UGen.call(this, a, b, b);
		this.setGain(arguments.length == 3 ? e : 1)
	}, function () {
		var a = this.gain,
			b = this.ins,
			e = this.bufferSize;
		if (this.gainUGen === null) for (var f = 0; f < b; f++) for (var g = this.bufIn[f], h = this.bufOut[f], j = 0; j < e; ++j) h[j] = a * g[j];
		else {
			this.gainUGen.update();
			for (f = 0; f < b; f++) {
				g = this.bufIn[f];
				h = this.bufOut[f];
				for (j = 0; j < e; ++j) h[j] = (a = this.gainUGen.getValue(0, j)) * g[j]
			}
			this.gain = a
		}
	});
	Beads.extend(d.Gain.prototype, {
		getGain: function () {
			return this.gain
		},
		setGain: function (a) {
			if (typeof a == "number") {
				this.gainUGen = null;
				this.gain = a
			} else if (a === null) this.gainUGen = null;
			else {
				this.gainUGen = a;
				a.update();
				this.gain = this.gainUGen.getValue()
			}
			return this
		},
		getGainUGen: function () {
			return this.gainUGen
		},
		sendData: function (a) {
			if (a !== null) {
				var b = a.getUGen("gain");
				b === null ? this.setGain(a.getFloat("gain", this.gain)) : this.setGain(b)
			}
			return this
		}
	});
	d.Glide = c(function (a, b, e) {
		Beads.UGen.call(this, a, 1);
		this.currentValue = b === undefined ? 0 : b;
		this.countSinceGlide = 0;
		this.nothingChanged = this.gliding = false;
		this.outputInitializationRegime = Beads.UGen.OutputInitializationRegime.RETAIN;
		this.outputPauseRegime = Beads.UGen.OutputPauseRegime.RETAIN;
		this.bufOut[0] = new Beads.Float32Array(this.bufferSize);
		this.setGlideTime(e === undefined ? 100 : e)
	}, function () {
		if (!this.nothingChanged) {
			this.nothingChanged = true;
			for (var a = 0; a < this.bufferSize; a++) if (this.gliding) {
				if (this.glideTime <= 0) {
					this.gliding = false;
					this.bufOut[0][a] = this.previousValue = this.currentValue =
					this.targetValue;
					this.nothingChanged = false
				} else if (this.countSinceGlide >= this.glideTime) {
					this.gliding = false;
					this.bufOut[0][a] = this.previousValue = this.targetValue
				} else {
					var b = this.countSinceGlide / this.glideTime;
					this.bufOut[0][a] = this.currentValue = b * this.targetValue + (1 - b) * this.previousValue;
					this.nothingChanged = false
				}
				this.countSinceGlide++
			} else this.bufOut[0][a] = this.currentValue
		}
	});
	Beads.extend(d.Glide.prototype, {
		setValue: function (a) {
			this.targetValue = a;
			this.gliding = true;
			this.nothingChanged = false;
			this.countSinceGlide =
			0;
			this.previousValue = this.currentValue
		},
		setValueImmediately: function (a) {
			this.currentValue = a;
			this.nothingChanged = this.gliding = false;
			this.countSinceGlide = 0
		},
		setGlideTime: function (a) {
			this.glideTime = this.context.msToSamples(a)
		},
		getGlideTime: function () {
			return this.context.samplesToMs(this.glideTime)
		}
	});
	d.Noise = c(function (a) {
		Beads.UGen.call(this, a, 1);
		if ("noise" in Beads.data.Buffer.staticBufs) this.noiseBuffer = Beads.data.Buffer.staticBufs.noise;
		else {
			this.noiseBuffer = (new Beads.data.buffers.NoiseBuffer).generateBuffer(2E5);
			Beads.data.Buffer.staticBufs.noise = this.noiseBuffer
		}
		this.index = parseInt(Math.random() * this.noiseBuffer.buf.length)
	}, function () {
		for (var a = this.bufOut[0], b = this.noiseBuffer.buf, e = this.index, f = this.bufferSize, g = 0; g < f; g++) {
			a[g] = b[e];
			e++;
			if (e == b.length) e = 0
		}
		this.index = e
	});
	d.RandomPWM = function () {
		var a = {
			ALTERNATING: 0,
			NOISE: 1,
			PULSING: 2,
			SAW: 3,
			RAMPED_NOISE: 4,
			NOISE_ENVELOPE: 5
		},
			b = a.ALTERNATING,
			e = a.NOISE,
			f = a.PULSING,
			g = a.SAW,
			h = a.RAMPED_NOISE,
			j = a.NOISE_ENVELOPE,
			l = c(function (i, k, m, n, o) {
				if (o === undefined) o = 1;
				Beads.UGen.call(this, i, 0, 1);
				this.setParams(k, m, n, o)
			}, function () {
				switch (this.mode) {
				case b:
					this.calculateBufferAlternating();
					break;
				case e:
					this.calculateBufferNoise();
					break;
				case f:
					this.calculateBufferPulsing();
					break;
				case g:
					this.calculateBufferPulsing();
					break;
				case h:
					this.calculateBufferRampedNoise();
					break;
				case j:
					this.calculateBufferNoiseEnvelope()
				}
			});
		l.Mode = a;
		Beads.extend(l, a);
		Beads.extend(l.prototype, {
			mode: b,
			targetVal: 0,
			baseVal: 0,
			valDiff: 0,
			count: 0,
			pulseLen: 0,
			minLength: 10,
			maxLength: 100,
			lengthExponent: 1,
			lengthDiff: 0,
			calculateBufferPulsing: function () {
				for (var i =
				this.bufOut[0], k = 0; k < i.length; k++) {
					if (this.count <= 0) {
						this.calcVals();
						this.targetVal = this.targetVal > 0 ? 0 : 1;
						this.valDiff = this.targetVal - this.baseVal
					}
					i[k] = this.targetVal;
					this.count--
				}
			},
			calculateBufferAlternating: function () {
				for (var i = this.bufOut[0], k = 0; k < i.length; k++) {
					if (this.count <= 0) {
						this.calcVals();
						this.targetVal = this.targetVal > 0 ? -1 : 1;
						this.valDiff = this.targetVal - this.baseVal
					}
					i[k] = this.targetVal;
					this.count--
				}
			},
			calculateBufferSaw: function () {
				for (var i = this.bufOut[0], k = 0; k < i.length; k++) {
					if (this.count <= 0) {
						this.calcVals();
						this.targetVal = this.targetVal > 0 ? -1 : 1;
						this.valDiff = this.targetVal - this.baseVal
					}
					i[k] = this.targetVal - this.count / this.pulseLen * this.valDiff;
					this.count--
				}
			},
			calculateBufferRampedNoise: function () {
				for (var i = this.bufOut[0], k = 0; k < i.length; k++) {
					if (this.count <= 0) {
						this.calcVals();
						this.targetVal = Math.random() * 2 - 1;
						this.valDiff = this.targetVal - this.baseVal
					}
					i[k] = this.targetVal - this.count / this.pulseLen * this.valDiff;
					this.count--
				}
			},
			calculateBufferNoiseEnvelope: function () {
				for (var i = this.bufOut[0], k =
				0; k < i.length; k++) {
					if (this.count <= 0) {
						this.calcVals();
						this.targetVal = Math.random();
						this.valDiff = this.targetVal - this.baseVal
					}
					i[k] = this.targetVal - this.count / this.pulseLen * this.valDiff;
					this.count--
				}
			},
			calculateBufferNoise: function () {
				for (var i = this.bufOut[0], k = 0; k < this.bo.length; k++) {
					if (this.count <= 0) {
						this.calcVals();
						this.targetVal = Math.random() * 2 - 1;
						this.valDiff = this.targetVal - this.baseVal
					}
					i[k] = this.targetVal;
					this.count--
				}
			},
			calcVals: function () {
				this.count += Math.pow(Math.random(), this.lengthExponent) * this.lengthDiff + this.minLength;
				this.pulseLen = this.count;
				this.baseVal = this.targetVal
			},
			setParams: function (i, k, m, n) {
				if (arguments.length == 3) {
					n = m;
					m = k;
					k = i
				} else this.setMode(i);
				this.setLengthExponent(n);
				this.minLength = k > 1 ? k : 1;
				this.maxLength = this.minLength > m ? this.minLength : m;
				this.lengthDiff = this.maxLength - this.minLength;
				return this
			},
			setMinLength: function (i) {
				this.setParams(i, this.maxLength, this.lengthExponent);
				return this
			},
			getMinLength: function () {
				return this.minLength
			},
			setMaxLength: function (i) {
				this.setParams(this.minLength, i, this.lengthExponent);
				return this
			},
			getMaxLength: function () {
				return this.maxLength
			},
			setLengthExponent: function (i) {
				if ((this.lengthExponent = i) < 0.0010) this.lengthExponent = 0.0010;
				return this
			},
			getLengthExponent: function () {
				return this.lengthExponent
			},
			setMode: function (i) {
				this.mode = i;
				return this
			},
			getMode: function () {
				return this.mode
			},
			sendData: function (i) {
				if (i !== null) {
					var k = i.get("mode");
					this.setParams(k in a ? k : this.mode, i.getFloat("minLength", this.minLength), i.getFloat("maxLength", this.maxLength), i.getFloat("lengthExponent", this.lengthExponent))
				}
				return this
			},
			messageReceived: function (i) {
				i instanceof Beads.data.DataBead && this.sendData(i)
			},
			getParams: function () {
				var i = new Beads.data.DataBead;
				i.put("mode", this.mode);
				i.put("minLength", this.minLength);
				i.put("maxLength", this.maxLength);
				i.put("lengthExponent", this.lengthExponent);
				return i
			}
		});
		return l
	}();
	d.Reverb = function (a, b) {
		if (b === undefined) b = 1;
		Beads.UGenChain.call(this, a, 1, b);
		var e = this.sampsPerMS = a.msToSamples(1);
		this.src = new Beads.ugens.OnePoleFilter(a, 4E3);
		var f = new Beads.ugens.TapIn(a, 125);
		this.earlyTapOut = new Beads.ugens.TapOut(a, f, 10);
		this.eAPF1 = new Beads.ugens.AllpassFilter(a, Math.floor(12.812 * e), 113, 0.3);
		this.eAPF2 = new Beads.ugens.AllpassFilter(a, Math.floor(12.812 * e * 3), 337, 0.4);
		this.eAPF3 = new Beads.ugens.AllpassFilter(a, Math.floor(12.812 * e * 9.4), 1051, 0.5);
		var g = new Beads.ugens.Gain(a, 1, -0.3);
		this.lAPF1 = new Beads.ugens.AllpassFilter(a, Math.floor(140 * e), 19, 0.72);
		this.lAPF2 = new Beads.ugens.AllpassFilter(a, Math.floor(140 * e), 23, 0.7);
		this.lAPF3 = new Beads.ugens.AllpassFilter(a, Math.floor(140 * e), 29, 0.65);
		this.lAPF4 = new Beads.ugens.AllpassFilter(a, Math.floor(140 * e), 37, 0.6);
		this.lpf = new Beads.ugens.OnePoleFilter(a, 1E3);
		var h = new Beads.ugens.TapIn(a, 1E3),
			j = new Beads.ugens.TapOut(a, h, 10),
			l = new Beads.ugens.TapOut(a, h, 31.17),
			i = new Beads.ugens.Gain(a, 1, -0.25);
		this.earlyGain = new Beads.ugens.Gain(a, 1, 1);
		this.lateGain = new Beads.ugens.Gain(a, 1, 1);
		var k = new Beads.ugens.Gain(a, 1, 1);
		this.delayModulator = new Beads.ugens.RandomPWM(a, Beads.ugens.RandomPWM.RAMPED_NOISE, 4E3, 15E3, 1);
		this.drawFromChainInput(this.src);
		f.addInput(this.src);
		f.addInput(this.earlyGain);
		this.eAPF1.addInput(this.earlyTapOut);
		this.eAPF2.addInput(this.eAPF1);
		this.eAPF3.addInput(this.eAPF2);
		g.addInput(this.eAPF3);
		this.earlyGain.addInput(g);
		this.lAPF1.addInput(g);
		this.lAPF1.addInput(i);
		this.lAPF1.addInput(this.src);
		this.lAPF2.addInput(this.lAPF1);
		this.lAPF3.addInput(this.lAPF2);
		this.lAPF4.addInput(this.lAPF3);
		this.lpf.addInput(this.lAPF4);
		h.addInput(this.lpf);
		i.addInput(j);
		i.addInput(l);
		this.lateGain.addInput(i);
		k.addInput(this.earlyGain);
		k.addInput(this.lateGain);
		this.apfOuts = Array(b);
		this.outDelayScale = new Beads.Float32Array(b);
		for (f = 0; f < b; f++) {
			g = 0.3 + f / (f + 1) * 0.1 + Math.sin(f) * 0.05;
			this.outDelayScale[f] = (3 * f + 5) / (5 * f + 5);
			this.apfOuts[f] = new Beads.ugens.AllpassFilter(a, Math.floor(60 * e), 20, g);
			this.apfOuts[f].addInput(k);
			this.addToChainOutput(f, this.apfOuts[f])
		}
		this.setSize(0.5).setDamping(0.7).setEarlyReflectionsLevel(1).setLateReverbLevel(1)
	};
	Beads.inherits(d.Reverb, Beads.UGenChain);
	Beads.extend(d.Reverb.prototype, {
		preFrame: function () {
			this.delayModulator.update();
			var a = Math.floor(this.delayModulator.getValue() * 0.3 * this.sampsPerMS);
			this.lAPF1.setDelay(Math.floor(this.lateDelay1) - a);
			this.lAPF2.setDelay(Math.floor(this.lateDelay2) + a);
			this.lAPF3.setDelay(Math.floor(this.lateDelay3) - a);
			this.lAPF4.setDelay(Math.floor(this.lateDelay4) + a)
		},
		getSize: function () {
			return this.size
		},
		setSize: function (a) {
			this.size = a = a > 1 ? 1 : a < 0.01 ? 0.01 : a;
			this.lateDelay1 = 86 * a * this.sampsPerMS;
			this.lateDelay2 = this.lateDelay1 * 1.16;
			this.lateDelay3 = this.lateDelay2 * 1.16;
			this.lateDelay4 = this.lateDelay3 * 1.16;
			this.earlyTapOut.setDelay(60 * a);
			var b = 12.812 * this.sampsPerMS * a;
			this.eAPF1.setDelay(Math.floor(b));
			this.eAPF2.setDelay(Math.floor(b * 3 - 2));
			this.eAPF3.setDelay(Math.floor(b * 9.3 + 1));
			b = 60 * this.sampsPerMS * a;
			for (a = 0; a < this.outs; a++) this.apfOuts[a].setDelay(Math.floor(b * this.outDelayScale[a]));
			return this
		},
		getDamping: function () {
			return this.damping
		},
		setDamping: function (a) {
			if (a < 0) a = 0;
			else if (a > 1) a = 1;
			this.damping = a;
			a = 1 - Math.sqrt(a);
			this.src.setFrequency(a * 1E4 + 250);
			this.lpf.setFrequency(a * 8E3 + 200);
			return this
		},
		getEarlyReflectionsLevel: function () {
			return this.earlyLevel
		},
		setEarlyReflectionsLevel: function (a) {
			this.earlyLevel = a;
			this.earlyGain.setGain(a);
			return this
		},
		getLateReverbLevel: function () {
			return this.lateLevel
		},
		setLateReverbLevel: function (a) {
			this.lateLevel = a;
			this.lateGain.setGain(a);
			return this
		},
		sendData: function (a) {
			if (a !== null) {
				this.setDamping(a.getFloat("damping", this.damping));
				this.setSize(a.getFloat("roomSize", this.size));
				this.setEarlyReflectionsLevel(a.getFloat("earlyReflectionsLevel", this.earlyLevel));
				this.setLateReverbLevel(a.getFloat("lateReverbLevel", this.lateLevel))
			}
			return this
		},
		getParams: function () {
			var a = new Beads.DataBead;
			a.put("damping", this.damping);
			a.put("roomSize", this.size);
			a.put("earlyReflectionsLevel", this.earlyLevel);
			a.put("lateReverbLevel", this.lateLevel);
			return a
		}
	});
	d.Static = c(function (a, b) {
		Beads.UGen.call(this, a, 1);
		this.x = b;
		this.outputInitializationRegime = Beads.UGen.OutputInitializationRegime.NULL;
		this.outputPauseRegime = Beads.UGen.OutputPauseRegime.NULL;
		this.pause(true)
	}, function () {});
	Beads.extend(d.Static.prototype, {
		setValue: function (a) {
			this.x = a
		},
		getValue: function () {
			return this.x
		}
	});
	d.TapIn = c(function (a, b) {
		Beads.UGen.call(this, a, 1, 0);
		this.sampsPerMS = a.msToSamples(1);
		this.maxDelay = Math.floor(a.msToSamples(b)) + 1;
		if (this.maxDelay < this.bufferSize) this.maxDelay = this.bufferSize;
		this.memLength = this.maxDelay + 1;
		this.mem = new Beads.Float32Array(this.memLength);
		this.counter = 0
	}, function () {
		for (var a = this.bufIn[0], b = 0; b < this.bufferSize; b++) {
			this.mem[this.counter] = a[b];
			this.counter = (this.counter + 1) % this.memLength
		}
	});
	Beads.extend(d.TapIn.prototype, {
		fillBufferLinear: function (a, b) {
			if (typeof b === "number") {
				var e = b;
				if (e < 0) e = 0;
				else if (e > this.maxDelay) e = this.maxDelay;
				for (var f = e % 1, g = this.counter - this.bufferSize - Math.floor(e) - 1 + this.memLength + this.memLength, h = 0; h < a.length; h++) {
					e = (g + h) % this.memLength;
					a[h] = this.mem[e] * f + this.mem[(e + 1) % this.memLength] * (1 - f)
				}
			} else {
				g = (this.counter - this.bufferSize + this.memLength) % this.memLength;
				for (h = 0; h < a.length; h++) {
					if ((e = b.getValue(0, h) * this.sampsPerMS) < 0) e = 0;
					else if (e > this.maxDelay) e = this.maxDelay;
					f = e % 1;
					e = (g + h - Math.floor(e) - 1 + this.memLength) % this.memLength;
					a[h] = this.mem[e] * f + this.mem[(e + 1) % this.memLength] * (1 - f)
				}
			}
		},
		fillBufferNoInterp: function (a, b) {
			if (typeof b == "number") {
				var e = b;
				if (e < 0) e = 0;
				else if (e > this.maxDelay) e = this.maxDelay;
				for (var f = this.counter - this.bufferSize - e + this.memLength + this.memLength, g = 0; g < a.length; g++) a[g] = this.mem[(f + g) % this.memLength]
			} else {
				f = this.counter - this.bufferSize + this.memLength + this.memLength;
				for (g = 0; g < a.length; g++) {
					if ((e = Math.floor(b.getValue(0, g) * this.sampsPerMS + 0.5)) < 0) e = 0;
					else if (e > this.maxDelay) e = this.maxDelay;
					a[g] = this.mem[(f + g - e) % this.memLength]
				}
			}
		},
		fillBufferAllpass: function () {
			if (arguments.length == 3) for (var a = arguments[0], b = arguments[1], e = arguments[2], f = this.counter - this.bufferSize + this.memLength + this.memLength, g = 0; g < a.length; g++) {
				var h;
				if ((h = b.getValue(0, g) * this.sampsPerMS) < 0) h = 0;
				else if (h > this.maxDelay) h = this.maxDelay;
				var j = h % 1;
				j = (1 - j) / (1 + j);
				h = (f + g - Math.floor(h) - 1 + this.memLength) % this.memLength;
				a[g] = e = this.mem[h] + j * (this.mem[(h + 1) % this.memLength] - e)
			} else {
				a = arguments[0];
				b = arguments[1];
				j = arguments[2];
				e = arguments[3];
				if (b < 0) b = 0;
				else if (b > this.maxDelay) b = this.maxDelay;
				f = this.counter - this.bufferSize - b - 1 + this.memLength + this.memLength;
				for (g = 0; g < a.length; g++) {
					h = (f + g) % this.memLength;
					a[g] = e = this.mem[h] + j * (this.mem[(h + 1) % this.memLength] - e)
				}
			}
			return e
		}
	});
	d.TapOut = c(function (a, b, e, f) {
		Beads.UGen.call(this, a, 0, 1);
		this.sampsPerMS = a.msToSamples(1);
		this.ti = b;
		this.addDependent(b);
		this.setMode(d.TapOut.NO_INTERP);
		this.lastY = 0;
		if (arguments.length == 3) this.setDelay(e);
		else arguments.length == 4 && this.setMode(e).setDelay(f)
	}, function () {
		if (this.delayUGen === null) switch (this.mode) {
		case d.TapOut.NO_INTERP:
			this.ti.fillBufferNoInterp(this.bufOut[0], this.sampDelayInt);
			this.lastY = this.bufOut[0][this.bufferSize - 1];
			break;
		case d.TapOut.LINEAR:
			this.ti.fillBufferLinear(this.bufOut[0], this.sampDelayFloat);
			this.lastY = this.bufOut[0][this.bufferSize - 1];
			break;
		case d.TapOut.ALLPASS:
			this.lastY = this.ti.fillBufferAllpass(this.bufOut[0], this.sampDelayAPInt, this.g, this.lastY)
		} else {
			this.delayUGen.update();
			switch (this.mode) {
			case d.TapOut.InterpolationType.NO_INTERP:
				this.ti.fillBufferNoInterp(this.bufOut[0], this.delayUGen);
				this.lastY = this.bufOut[0][this.bufferSize - 1];
				break;
			case d.TapOut.InterpolationType.LINEAR:
				this.ti.fillBufferLinear(this.bufOut[0], this.delayUGen);
				this.lastY = this.bufOut[0][this.bufferSize - 1];
				break;
			case d.TapOut.InterpolationType.ALLPASS:
				this.lastY = this.ti.fillBufferAllpass(this.bufOut[0], this.delayUGen, this.lastY)
			}
		}
	});
	d.TapOut.InterpolationType = {
		NO_INTERP: 0,
		LINEAR: 1,
		ALLPASS: 2
	};
	d.TapOut.NO_INTERP =
	d.TapOut.InterpolationType.NO_INTERP;
	d.TapOut.LINEAR = d.TapOut.InterpolationType.LINEAR;
	d.TapOut.ALLPASS = d.TapOut.InterpolationType.ALLPASS;
	Beads.extend(d.TapOut.prototype, {
		getDelay: function () {
			return this.delay
		},
		setDelay: function (a) {
			if (typeof a === "number" || a === null) {
				if (a === null) a = this.delay;
				else this.delay = a;
				this.sampDelayFloat = this.sampsPerMS * a;
				this.sampDelayInt = Math.floor(this.sampDelayFloat + 0.5);
				this.sampDelayAPInt = Math.floor(this.sampDelayFloat);
				a = this.sampDelayFloat % 1;
				this.g = (1 - a) / (1 + a);
				this.delayUGen =
				null
			} else {
				this.delayUGen = a;
				a.update();
				this.delay = a.getValue()
			}
			return this
		},
		getDelayUGen: function () {
			return this.delayUGen
		},
		setMode: function (a) {
			if (a in d.TapOut.InterpolationType) this.mode = a;
			return this
		},
		getMode: function () {
			return this.mode
		}
	});
	d.WavePlayer = c(function (a, b, e) {
		Beads.UGen.call(this, a, 1);
		this.buffer = e;
		this.phase = 0;
		this.phaseEnvelope = null;
		this.one_over_sr = 1 / a.getSampleRate();
		this.setFrequency(b)
	}, function () {
		var a = this.one_over_sr,
			b = this.bufOut[0],
			e = this.bufferSize,
			f = this.buffer,
			g = this.frequencyEnvelope,
			h = this.phaseEnvelope;
		g.update();
		if (h === null) {
			h = this.phase;
			for (var j = 0; j < e; j++) b[j] = f.getValueFraction(h = (h + g.getValue(0, j) * a) % 1);
			this.phase = h;
			this.frequency = g.getValue(0, j)
		} else {
			h.update();
			for (j = 0; j < e; j++) b[j] = f.getValueFraction(h.getValue(0, j))
		}
	});
	Beads.extend(d.WavePlayer.prototype, {
		start: function () {
			Beads.UGen.prototype.start.call(this);
			this.phase = 0
		},
		getFrequencyUGen: function () {
			return this.isFreqStatic ? null : this.frequencyEnvelope
		},
		getFrequency: function () {
			return this.frequency
		},
		setFrequency: function (a) {
			if (typeof a === "number" || a === null) {
				if (a === null) a = this.frequency;
				if (this.isFreqStatic) this.frequencyEnvelope.setValue(a);
				else {
					this.frequencyEnvelope = new d.Static(this.context, a);
					this.isFreqStatic = true
				}
				this.frequency = a
			} else {
				this.frequencyEnvelope = a;
				this.isFreqStatic = false
			}
			return this
		},
		getPhaseUGen: function () {
			return this.phaseEnvelope
		},
		getPhase: function () {
			return this.phase
		},
		setPhase: function (a) {
			if (typeof a === "number") {
				this.phase = a;
				this.phaseEnvelope = null
			} else {
				this.phaseEnvelope = a;
				if (a !== null) this.phase = a.getValue()
			}
			return this
		},
		setBuffer: function (a) {
			this.buffer = a;
			return this
		},
		getBuffer: function () {
			return this.buffer
		}
	});
	return d
}();
Beads.extend(Beads.ugens, function () {
	function c(b, e, f) {
		Beads.UGen.call(this, b, e, f)
	}
	function d(b, e, f, g) {
		Beads.ugens.IIRFilter.call(this, b, 1, 1);
		this.maxDelay = Math.max(e, 1);
		this.bufLen = this.maxDelay + 1;
		this.xn = new Float32Array(this.bufLen);
		this.yn = new Float32Array(this.bufLen);
		this.g = 0;
		this.delay = 1;
		this.ind = 0;
		this.setDelay(f).setG(g)
	}
	function a(b, e) {
		c.call(this, b, 1, 1);
		this.samplingfreq = b.getSampleRate();
		this.two_pi_over_sf = 2 * Math.PI / this.samplingfreq;
		this.y1 = 0;
		this.setFrequency(e)
	}
	Beads.inherits(c, Beads.UGen);
	Beads.extend(c.prototype, {
		getFilterResponse: function () {
			Beads.abstractMethod()
		},
		getAmplitudeResponse: function (b) {
			return this.getFilterResponse(b).amplitudeResponse
		},
		getPhaseResponse: function (b) {
			return this.getFilterResponse(b).phaseResponse
		},
		getPhaseDelay: function (b) {
			return this.getFilterResponse(b).phaseDelay
		},
		getGroupDelay: function (b) {
			return this.getFilterResponse(b).groupDelay
		}
	});
	c.calculateFilterResponse = function (b, e, f, g) {
		var h = c.analyzeFilter(b, e, f, g);
		h.groupDelay = c.calculateGroupDelay(b, e, f, g);
		return h
	};
	c.calculateGroupDelay = function (b, e, f, g) {
		var h = c.analyzeFilter(b, e, f - 0.01, g);
		b = c.analyzeFilter(b, e, f + 0.01, g);
		return (b.phaseResponse - h.phaseResponse) / (h.w - b.w)
	};
	c.analyzeFilter = function (b, e, f, g) {
		g = -2 * f * Math.PI / g;
		var h = 0,
			j = 0,
			l = 1,
			i = 0;
		if (b.length > 0) {
			h = b[0];
			for (var k = 1; k < b.length; k++) {
				h += b[k] * Math.cos(g * k);
				j += b[k] * Math.sin(g * k)
			}
		}
		if (e.length > 0) {
			l = e[0];
			for (k = 1; k < e.length; k++) {
				l += e[k] * Math.cos(g * k);
				i += e[k] * Math.sin(g * k)
			}
		}
		b = l * l + i * i;
		e = Math.atan2(j, h) - Math.atan2(i, l);
		return {
			frReal: (h * l + j * i) / b,
			frImag: (j * l - h * i) / b,
			amplitudeResponse: Math.sqrt((h * h + j * j) / b),
			phaseResponse: e,
			phaseDelay: e / Math.PI / -2 / f,
			groupDelay: 0,
			w: g
		}
	};
	c.IIRFilterAnalysis = function () {
		this !== window && Beads.error("In Beads.js IIRFilterAnalysis is a function, not a class.");
		return {
			frReal: 0,
			frImag: 0,
			amplitudeResponse: 0,
			phaseResponse: 0,
			phaseDelay: 0,
			groupDelay: 0,
			w: 0
		}
	};
	Beads.inherits(d, c);
	Beads.extend(d, {
		calculateBuffer: function () {
			var b = this.bufIn[0],
				e = this.bufOut[0];
			if (this.isDelayStatic && this.isGStatic) for (var f = (this.ind + this.bufLen - this.delay) % this.bufLen, g = 0; g < this.bufferSize; g++) {
				e[g] = this.yn[this.ind] = this.xn[f] + this.g * (this.yn[f] - (this.xn[this.ind] = b[g]));
				f = (f + 1) % this.bufLen;
				this.ind = (this.ind + 1) % this.bufLen
			} else {
				this.gUGen.update();
				this.delayUGen.update();
				for (g = 0; g < this.bufferSize; g++) {
					if ((this.delay = Math.floor(this.gUGen.getValue(0, g))) < 1) this.delay = 1;
					else if (this.delay > this.maxDelay) this.delay = this.maxDelay;
					f = (this.ind + this.bufLen - this.delay) % this.bufLen;
					e[g] = this.yn[this.ind] = this.xn[f] + this.gUGen.getValue(0, g) * (this.yn[f] - (this.xn[this.ind] =
					b[g]));
					this.ind = (this.ind + 1) % this.bufLen
				}
				this.g = this.gUGen.getValue(0, this.bufferSize - 1)
			}
		},
		getG: function () {
			return this.g
		},
		setG: function (b) {
			if (b === null) b = this.g;
			if (typeof b == "number") {
				this.g = b;
				if (this.isGStatic) this.gUGen.setValue(b);
				else {
					this.gUGen = new Beads.ugens.Static(this.context, b);
					this.isGStatic = true
				}
			} else {
				this.gUGen = b;
				b.update();
				this.g = b.getValue();
				this.isGStatic = false
			}
			return this
		},
		getGUGen: function () {
			return this.isGStatic ? null : this.gUGen
		},
		getDelay: function () {
			return this.delay
		},
		setDelay: function (b) {
			if (b === null) b = this.delay;
			if (typeof b == "number") {
				this.delay = b > this.maxDelay ? this.maxDelay : b < 1 ? 1 : b;
				if (this.isDelayStatic) this.delayUGen.setValue(this.delay);
				else {
					this.delayUGen = new Beads.ugens.Static(this.context, this.delay);
					this.isDelayStatic = true
				}
			} else {
				this.delayUGen = b;
				b.update();
				if ((this.delay = Math.floor(b.getValue())) < 0) this.delay = 0;
				else if (this.delay > this.maxDelay) this.delay = this.maxDelay;
				this.isDelayStatic = false
			}
			return this
		},
		getDelayUGen: function () {
			return this.isDelayStatic ? null : this.delayUGen
		},
		setParams: function (b) {
			if (b !== null) {
				var e;
				if ((e = b.get("delay")) !== null) e instanceof Beads.UGen ? this.setDelay(e) : this.setDelay(Math.floor(b.getFloat("delay", this.delay)));
				if ((e = b.get("g")) !== null) e instanceof Beads.UGen ? this.setG(e) : this.setG(b.getFloat("g", this.g))
			}
			return this
		},
		messageReceived: function (b) {
			b instanceof Beads.DataBead && this.setParams(b)
		},
		getParams: function () {
			var b = new Beads.DataBead;
			b.put("delay", this.isDelayStatic ? this.delay : this.delayUGen);
			b.put("g", this.isGStatic ? this.g : this.gUGen);
			return b
		},
		getStaticParams: function () {
			var b =
			new Beads.data.DataBead;
			b.put("delay", this.delay);
			b.put("g", this.g);
			return b
		},
		sendData: function (b) {
			this.setParams(b);
			return this
		},
		getFilterResponse: function (b) {
			var e = new Float32Array(this.delay + 1),
				f = new Float32Array(this.delay + 1);
			f[0] = e[this.delay] = -this.g;
			e[0] = f[this.delay] = 1;
			return c.calculateFilterResponse(f, e, b, this.context.getSampleRate())
		}
	});
	Beads.inherits(a, c);
	Beads.extend(a.prototype, {
		calcVals: function () {
			this.a1 = (this.b0 = Math.sin(this.two_pi_over_sf * this.freq)) - 1
		},
		calculateBuffer: function () {
			var b =
			this.bufIn[0],
				e = this.bufOut[0];
			if (this.isFreqStatic) for (var f = 0; f < this.bufferSize; f++) this.bo[f] = this.y1 = this.b0 * b[f] - this.a1 * this.y1;
			else {
				this.freqUGen.update();
				for (f = 0; f < this.bufferSize; f++) {
					this.a1 = (this.b0 = Math.sin(this.two_pi_over_sf * this.freqUGen.getValue(0, f))) - 1;
					e[f] = this.y1 = this.b0 * b[f] - this.a1 * this.y1
				}
				this.freq = this.freqUGen.getValue(0, this.bufferSize - 1)
			}
			if (isNaN(this.y1)) this.y1 = 0
		},
		getFrequency: function () {
			return this.freq
		},
		setFrequency: function (b) {
			if (b === null) b = this.freq;
			if (typeof b == "number") {
				this.freq =
				b;
				this.a1 = (this.b0 = Math.sin(this.two_pi_over_sf * b)) - 1;
				this.isFreqStatic = true
			} else {
				this.freqUGen = b;
				b.update();
				this.freq = b.getValue();
				this.isFreqStatic = false
			}
			return this
		},
		getFrequencyUGen: function () {
			return this.isFreqStatic ? null : this.freqUGen
		},
		setParams: function (b) {
			if (b !== null) {
				var e;
				if ((e = b.get("frequency")) !== null) e instanceof Beads.UGen ? this.setFrequency(e) : this.setFrequency(b.getFloat("frequency", this.freq))
			}
			return this
		},
		messageReceived: function (b) {
			b instanceof Beads.data.DataBead && this.setParams(b)
		},
		getParams: function () {
			var b = new Beads.data.DataBead;
			b.put("frequency", this.isFreqStatic ? this.freq : this.freqUGen);
			return b
		},
		getStaticParams: function () {
			var b = new Beads.data.DataBead;
			b.put("frequency", this.freq);
			return b
		},
		sendData: function (b) {
			this.setParams(b);
			return this
		},
		getFilterResponse: function (b) {
			var e = new Float32Array(1),
				f = new Float32Array(2);
			e[0] = this.b0;
			f[0] = 1;
			f[1] = this.a1;
			return this.constructor.calculateFilterResponse(e, f, b, this.context.getSampleRate())
		}
	});
	return {
		IIRFilter: c,
		AllpassFilter: d,
		OnePoleFilter: a
	}
}());
