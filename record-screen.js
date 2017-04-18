var RecordScreen = function(){
    this.mouseTrack = [];
    this.onFinishRecord = null;
    this.time2finish = 500;
    this.events = {};
  	console.log("[Record] Instance");
    return this;
};

RecordScreen.prototype.getLastTrack = function(){
    var self = this;
    if(self.mouseTrack.length > 0){
      var lastIndex = self.mouseTrack.length - 1;
      return self.mouseTrack[lastIndex];
    }
    return self.createTrack(0,0,false,false,0);
};

RecordScreen.prototype.createTrack = function(x, y, click, contextmenu, scrollTop){
    return {
      x: x, 
      y: y,
      click: click,
      contextmenu: contextmenu,
      scrollTop: scrollTop,
      timestamp: (new Date()).getTime()
    };       
};

RecordScreen.prototype.delay = (function(){
      var timer = 0;
      return function(callback, ms){
          clearTimeout (timer);
          timer = setTimeout(callback, ms);
      };
})();

RecordScreen.prototype.recordTrack = function(data){
    var self = this;

    self.mouseTrack.push(data);
      
    self.delay(function(){
      
    	if(self.onFinishRecord){
    		self.onFinishRecord(self.mouseTrack);
    		self.mouseTrack = [];
    		console.log("[Record] Stop recording on after finish action");
      }
        
    }, self.time2finish);
}

RecordScreen.prototype.on = function(element, events, callback){
  var self = this;
  events = events.split(' ');
  events.forEach(function(eventName){
    element.addEventListener(eventName, callback, false);
    self.events[eventName] = callback;
  });
}

RecordScreen.prototype.off = function(element, events){
  var self = this;
  events = events.split(' ');
  events.forEach(function(eventName){
    if(self.events[eventName] != undefined){
      element.removeEventListener(eventName, self.events[eventName], false);
    }
  });
}

RecordScreen.prototype.startRecord = function(){
    var self = this;

    console.log("[Record] Start recording");

    self.on(document, "mousemove click contextmenu scroll", function(e){
      	var x = e.pageX,
          	y = (e.pageY - window.pageYOffset);

      	switch(e.type){
            case "click":
            	var trackObj = self.createTrack(x, y, true, false, $(window).scrollTop());
              	self.recordTrack(trackObj);
            break;

            case "contextmenu":
             	 var trackObj = self.createTrack(x, y, false, true, $(window).scrollTop());
              	self.recordTrack(trackObj);
            break;

            case "scroll":
              	self.delay(function(){

                	var trackObj = self.createTrack(self.getLastTrack().x, self.getLastTrack().y, false, false, $(window).scrollTop());

                	self.recordTrack(trackObj);

              	},100);
            break;

            case "mousemove":
              	var trackObj = self.createTrack(x, y, false, false, $(window).scrollTop());
              	self.recordTrack(trackObj);
            break;
      	}
    });

    return this;
};

RecordScreen.prototype.stopRecord = function(){
  var self = this;
	self.off(document, "mousemove click contextmenu scroll");
	console.log("[Record] Stop recording");
	return this;
};

RecordScreen.prototype.resetRecord = function(){
	var self = this;
  self.off(document, "mousemove click contextmenu scroll");
	console.log("[Record] Reset recording");
	this.mouseTrack = [];
	return this;
};

RecordScreen.prototype.getRecord = function(){
	return this.mouseTrack;
};

RecordScreen.prototype.getRecordOnFinishInteraction = function(callback, time){
    var self = this;
    if(callback){
      if(time)
        self.time2finish = time;    
    	self.onFinishRecord = callback;
    }
    return this;
};