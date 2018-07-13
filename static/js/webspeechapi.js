try {
  var SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
  var recognition = new SpeechRecognition();
  recognition.lang = "ja-JP";
  recognition.continuous = true;
  recognition.maxAlternatives = 10;
//  recognition.interimResults = true;
  var speechRecognitionList = new webkitSpeechGrammarList();
  speechRecognitionList.addFromString("Hey 朝日", 1);
  recognition.grammars = speechRecognitionList;
  
  recognition.appendlog = function(text) {
  	var div = document.createElement("div");
  	div.appendChild(document.createTextNode(text));
  	var log = document.getElementById("wsa_log");
  	log.insertBefore(div,log.firstChild);
  };
  recognition.appendtext = function(text) {
  	var div = document.createElement("div");
  	div.appendChild(document.createTextNode(text));
  	var log = document.getElementById("recognizedText");
  	log.insertBefore(div,log.firstChild);
  };
  //話し声の認識中
  recognition.onstart = function(){
  	recognition.appendlog("start");
  };
  recognition.onsoundstart = function(){
  	recognition.appendlog("soundstart");
  };
  recognition.onaudiostart = function(){
  	recognition.appendlog("audiostart");
  };
  recognition.onspeechstart = function(){
  	recognition.appendlog("speechstart");
  };
  //話し声の認識終了
  recognition.onsoundend = function(){
  	recognition.appendlog("soundend");
  };
  recognition.onaudioend = function(){
  	recognition.appendlog("audioend");
  };
  recognition.onspeechend = function(){
  	recognition.appendlog("speechend");
  };
  recognition.onend = function(){
  	recognition.appendlog("end");
  };
  //マッチする認識が無い
  recognition.onnomatch = function(){
    recognition.appendlog("nomatch");
  };
  //エラー
  recognition.onerror= function(){
    recognition.appendlog("error");
  };
  //認識が終了したときのイベント
  recognition.onresult = function(event){
    var results = event.results;
  	recognition.appendlog("ok");
    recognition.appendtext("resultIndex:" + event.resultIndex);
    recognition.appendtext(JSON.stringify(results));
    for (var i = event.resultIndex; i<results.length; i++){
      recognition.appendtext("isFinal:" + results[i].isFinal);
      for (var j = 0; j<results[i].length; j++){
        recognition.appendtext(results[i][j].transcript);
        recognition.appendtext(results[i][j].confidence);
      }
  	};
  }
} catch (e) {
  alert(e);
};
