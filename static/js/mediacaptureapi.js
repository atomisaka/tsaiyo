try {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
  var localMediaStream = null;
  var localScriptProcessor = null;
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioContext = new AudioContext();
  var bufferSize = 1024;
  var audioData = [];
  var recordingFlg = false;
  
  var canvas = document.getElementById('canvas');
  var canvasContext = canvas.getContext('2d');
  
  var audioAnalyser = null;
  
  var onAudioProcess = function(e) {
      if (!recordingFlg) return;
  
      var input = e.inputBuffer.getChannelData(0);
      var bufferData = new Float32Array(bufferSize);
      for (var i = 0; i < bufferSize; i++) {
          bufferData[i] = input[i];
      }
      audioData.push(bufferData);
  
      analyseVoice();
  };
  
  var analyseVoice = function() {
      var fsDivN = audioContext.sampleRate / audioAnalyser.fftSize;
      var spectrums = new Uint8Array(audioAnalyser.frequencyBinCount);
      audioAnalyser.getByteFrequencyData(spectrums);
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  
      canvasContext.beginPath();
  
      for (var i = 0, len = spectrums.length; i < len; i++) {
          var x = (i / len) * canvas.width;
          var y = (1 - (spectrums[i] / 255)) * canvas.height;
          if (i === 0) {
              canvasContext.moveTo(x, y);
          } else {
              canvasContext.lineTo(x, y);
          }
          var f = Math.floor(i * fsDivN);  // index -> frequency;
  
          if ((f % 500) === 0) {
              var text = (f < 1000) ? (f + ' Hz') : ((f / 1000) + ' kHz');
              // Draw grid (X)
              canvasContext.fillRect(x, 0, 1, canvas.height);
              // Draw text (X)
              canvasContext.fillText(text, x, canvas.height);
          }
      }
  
      canvasContext.stroke();
  
      var textYs = ['1.00', '0.50', '0.00'];
      for (var i = 0, len = textYs.length; i < len; i++) {
          var text = textYs[i];
          var gy   = (1 - parseFloat(text)) * canvas.height;
          // Draw grid (Y)
          canvasContext.fillRect(0, gy, canvas.width, 1);
          // Draw text (Y)
          canvasContext.fillText(text, 0, gy);
      }
  }
  var startRecording = function() {
      recordingFlg = true;
      navigator.getUserMedia({audio: true}, function(stream) {
        try {
          localMediaStream = stream;
          var scriptProcessor = audioContext.createScriptProcessor(bufferSize, 1, 1);
          localScriptProcessor = scriptProcessor;
          var mediastreamsource = audioContext.createMediaStreamSource(stream);
          mediastreamsource.connect(scriptProcessor);
          scriptProcessor.onaudioprocess = onAudioProcess;
          scriptProcessor.connect(audioContext.destination);
  
          audioAnalyser = audioContext.createAnalyser();
          audioAnalyser.fftSize = 2048;
          frequencyData = new Uint8Array(audioAnalyser.frequencyBinCount);
          timeDomainData = new Uint8Array(audioAnalyser.frequencyBinCount);
          mediastreamsource.connect(audioAnalyser);
		  mediastream = stream;
        } catch (e) {
          alert(e);
        };
      },
      function(e) {
        console.log(e);
  		alert("error" + e);
      });
  };
  
  var endRecording = function() {
      recordingFlg = false;
	  localMediaStream.stop();
	  alert("end recording!");
  };
} catch (e) {
  alert(e);
};
