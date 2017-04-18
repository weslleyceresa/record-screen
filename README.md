# record-screen
Grava a navegação do usuário

**Track da gravação:**

- windowWidth
- windowHeight
- documentHeight
- x
- y
- click
- contextmenu
- scrollTop
- timestamp

**Para inciar a gravação**

    var rec = new RecordScreen(),
	    dataRecorded = [];
	    
    rec.startRecord();
    
    rec.getRecordOnFinishInteraction(function(data){
	    dataRecorded = dataRecorded.concat(data);
    });
    
    //ou
    
    dataRecorded = rec.getRecord();
    

**Para visualizar a gravação**

    function play(data, callback, finish){
	    var ctrl = [];
	    
	    data.reverse();
	    
	    var startTime = data.length > 0 ? data[(data.length - 1)].timestamp : 0;
	    
	    data.forEach(function(item, index){
		    function fire(fireItem, fireIndex, fireCallback, fireFinish){
			    if(fireCallback)
				    fireCallback(fireItem, fireIndex);

				if(fireIndex == 0){
				    console.log("[Record] Play finished");
					ctrl.forEach(function(ctimeout){
	        			clearTimeout(ctimeout);
	        		});
	        		ctrl = [];
	        		if(fireFinish)
				        fireFinish();
				}
		    }
		    
		    var time = item.timestamp - startTime;
		    ctrl.push(setTimeout(function(){
		       fire(item, index, callback, finish);
	        }, time));
		});
    }

    play(dataRecorded, function(item, index){
		$("#content").css("height", item.documentHeight);
		
		$(window).scrollTop(item.scrollTop);
		
		$("#ponteiro").css({
			top: item.y,
			left: item.x,
		});

		if(item.click)
			$("#click").css({
				top: item.y,
				left: item.x,
			}).fakeClick();

	}, function(){
		console.log("acabou");
	});
