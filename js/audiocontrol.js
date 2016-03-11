

window.onload=function()
{
	window.bgnum=4;//背景图片数量
	var myFirebaseRef = new Firebase("https://five-african.firebaseio.com/opentimes");
	myFirebaseRef.on("value", function(snapshot) {
		$(".good").text("已有"+snapshot.val()+"人点赞");
	});
	window.currentrandom=1;
	var audio = $("#audio")["0"];
	var disk = $('.disk');
	var cursor = $(".cursor");
	var paused=true;
	window.loopone = false;
	window.shuffle = false;
	$.getJSON("members.json",parseMembers);
	$("#progressbar").width(0);

	//进度条音量条
	$(".progress").mousedown(starDrag = function(ev) {
                ev.stopPropagation();
                var origX = ev.clientX;
                var origW = $(this).prev().width();
                var target = $(this).prev();
                var type = $(this).attr("id");
                $(document).mousemove(doDrag = function(ev){
                    ev.preventDefault();
                    var moveX = ev.clientX - origX;
                    //console.log(moveX/target.parent().width()*100);
                    var value = (origW+moveX)/target.parent().width();
                    value=value>1?1:(value<0?0:value);
                    target.width(value*100+"%");
                    //console.log(value*100);
                    switch(type)
                    {
                    	case "volume":audio.changeVolumeTo(value);break;
                    	case "progress":audio.setCurrentTime(value*audio.duration);break;
                    }
                });
                $(document).mouseup(stopDrag = function(){
                    $(document).unbind("mousemove",doDrag);
                    $(document).unbind("mouseup",stopDrag);
                });
            });
	$(".progress").bind("touchstart",starTDrag = function(ev) {
                ev.stopPropagation();
                var origX = ev.originalEvent.targetTouches["0"].clientX;
                console.log(ev.originalEvent.targetTouches["0"].clientX);
                var origW = $(this).prev().width();
                var target = $(this).prev();
                var type = $(this).attr("id");
                $(document).bind("touchmove",doTDrag = function(ev){
                    ev.preventDefault();
                    var moveX = ev.originalEvent.targetTouches["0"].clientX - origX;
                    console.log(moveX/target.parent().width()*100);
                    var value = (origW+moveX)/target.parent().width();
                    value=value>1?1:(value<0?0:value);
                    target.width(value*100+"%");
                    console.log(value*100);
                    switch(type)
                    {
                    	case "volume":audio.changeVolumeTo(value);break;
                    	case "progress":audio.setCurrentTime(value*audio.duration);break;
                    }
                });
                $(document).bind("touchend",stopTDrag = function(){
                    $(document).unbind("touchmove",doTDrag);
                    $(document).unbind("touchend",stopTDrag);
                });
            });


	//循环按钮
	$('#loop').click(function(){
		if(window.loopone){//window.loopone->window.shuffle
			$(this).addClass('window.shuffle').removeClass('window.loopone');
			audio.loop = false;
			window.loopone=false;
			window.shuffle=true;
		}
		else if(window.shuffle)//window.shuffle->loop
		{
			$(this).addClass('loop').removeClass('window.shuffle');
			audio.loop = false;
			window.loopone = false;
			window.shuffle=false;
		}
		else //loop->window.loopone
		{
			$(this).addClass('window.loopone').removeClass('loop');
			audio.loop = true;
			window.loopone = true;
			window.shuffle=false;
		}
		
	});
	$("#list").click(listshow = function(e){
		e.stopPropagation();
		if(!listshow.shown){
			$(".listcontainer").show().css("animation","listshow 0.7s linear 0s forwards").css("-webkit-animation","listshow 0.7s linear 0s forwards").css("-o-animation","listshow 0.7s linear 0s forwards").css("-moz-animation","listshow 0.7s linear 0s forwards").delay(700);listshow.shown=true;
		}else
		{
			$(".listcontainer").css("animation","listhide 0.7s linear 0s forwards").css("-webkit-animation","listhide 0.7s linear 0s forwards").css("-o-animation","listhide 0.7s linear 0s forwards").css("-moz-animation","listhide 0.7s linear 0s forwards").delay(700).hide(0);listshow.shown=false;
		}
	});
	$(".diskborder").click(function(e){
		e.stopPropagation();
		$(".cursoroutter").fadeToggle();
		$(".outtervolumebar").fadeToggle();
		$(".diskborder").fadeToggle();
		$("#membersshow").fadeToggle();
		$(".funcs>:first-child").fadeToggle();

	});
	$("#membersshow").click(function(e){
		e.stopPropagation();
		$(".cursoroutter").fadeToggle();
		$(".outtervolumebar").fadeToggle();
		$(".diskborder").fadeToggle();
		$("#membersshow").fadeToggle();
		$(".funcs>:first-child").fadeToggle();
	});
	$(".love").click(function(e)
	{
		$(this)[0].flag==undefined&&($(this)[0].flag=false);
		e.stopPropagation();
		if($(this)[0].flag)
		{
			$(this).addClass("love").removeClass("loved");
			$(this)[0].flag=false;
		}
		else
		{
			$(this).addClass("loved").removeClass("love");
			myFirebaseRef.transaction(function(opentimes) {
				
				$(".good").fadeToggle().text("已有"+(opentimes++)+"人点赞").delay(500).fadeToggle();
				return opentimes;
			});
			$(this)[0].flag=true;
		}
	})






	//读取媒体信息
	$(audio).bind("loadedmetadata",function(){
                var totalTime = formatTime(this.duration);
                $($("div").find("span")["1"]).text(totalTime);
                $("#progressbar").width(0);
            });
	$(audio).bind("canplay",function()
	{
		//播放暂停
		$("#play").click(function(e)
		{
			e.stopPropagation();
			if(paused)
			{
				audio.play();
			}
			else
			{
				audio.pause();
			}
		});
	});
	$(audio).trigger("canplay");
	$(audio).trigger("loadedmetadata");

	//播放时间更新
	$(audio).bind("timeupdate",function(){
                var duration = this.duration;
                var curTime = this.currentTime;
                var percentage = curTime/duration * 100;
                $("#progressbar").css("width",percentage + "%");
                var passedTime = formatTime(curTime);
                $(".progressbars>:first-child").text(passedTime);                  
            });

	//音频播放
	$(audio).bind("play",function(){
			$("#play").addClass('pause').removeClass('play');
			disk.css("animation-play-state","running");
			disk.css("-webkit-animation-play-state","running");
			disk.css("-o-animation-play-state","running");
			disk.css("-moz-animation-play-state","running");
			cursor.css("transform","rotate(-20deg)");
			cursor.css("-webkit-transform","rotate(-20deg)");
			cursor.css("-o-transform","rotate(-20deg)");
			cursor.css("-moztransform","rotate(-20deg)");
			cursor.css("animation","cursorclockwise 0.5s linear 0s forwards");
			cursor.css("-webkit-animation","cursorclockwise 0.5s linear 0s forwards");
			cursor.css("-o-animation","cursorclockwise 0.5s linear 0s forwards");
			cursor.css("-moz-animation","cursorclockwise 0.5s linear 0s forwards");
			paused=false;
            });

	//音频暂停
	$(audio).bind("pause",function(){
            $("#play").addClass('play').removeClass('pause');
			disk.css("animation-play-state","paused");
			disk.css("-wevkit-animation-play-state","paused");
			disk.css("-o-animation-play-state","paused");
			disk.css("-mozanimation-play-state","paused");
			cursor.css("transform","rotate(0deg)");
			cursor.css("-webkit-transform","rotate(0deg)");
			cursor.css("-o-transform","rotate(0deg)");
			cursor.css("-moz-transform","rotate(0deg)");
			cursor.css("animation","cursorcounter 0.5s linear 0s forwards");
			cursor.css("-webkit-animation","cursorcounter 0.5s linear 0s forwards");
			cursor.css("-o-animation","cursorcounter 0.5s linear 0s forwards");
			cursor.css("-moz-animation","cursorcounter 0.5s linear 0s forwards");
			paused=true;
            });

	//音频播放结束
	$(audio).bind("ended",function(){
		disk.css("animation-play-state","paused");
			disk.css("-wevkit-animation-play-state","paused");
			disk.css("-o-animation-play-state","paused");
			disk.css("-mozanimation-play-state","paused");
		paused=true;
		$("#play").addClass('play').removeClass('pause');
		if (!window.loopone) {
                $(".next").triggerHandler("click");
            }
        });
	//下一曲
	$(".next").click(function(){
		if(window.shuffle){
			window.currentSrcIndex = Math.ceil(Math.random()*window.memberlist.length)-1;
			window.currentSrcIndex < 0 && (window.currentSrcIndex = 0);
			window.currentSrcIndex = window.currentSrcIndex % window.memberlist.length;
		}
		else
        	++window.currentSrcIndex > window.memberlist.length - 1 && (window.currentSrcIndex = 0);
        
        audio.setCurrentSrc(window.currentSrcIndex);
		audio.play();
		audio.loop = window.loopone;
    });
    //上一曲
    $(".prev").click(function(){
    	if(window.shuffle){
			window.currentSrcIndex = Math.ceil(Math.random()*window.memberlist.length)-1;
			window.currentSrcIndex < 0 && (window.currentSrcIndex = 0);
			window.currentSrcIndex = window.currentSrcIndex % window.memberlist.length;
		}
		else
        	--window.currentSrcIndex < 0 && (window.currentSrcIndex = 0);
        var currentSrc = window.memberlist[window.currentSrcIndex].soundsrc;
        audio.setCurrentSrc(window.currentSrcIndex);
		audio.play();
		audio.loop = window.loopone;
    });





}
HTMLAudioElement.prototype.changeVolumeTo = function(volume){
    this.volume = volume;
}
HTMLAudioElement.prototype.setCurrentTime = function(currentTime){
	// $($("div").find("span")["0"]).text(formatTime(currentTime));  
    this.currentTime = currentTime;
}
HTMLAudioElement.prototype.setCurrentSrc = function(currentSrcIndex){
	
	var val = Math.ceil(Math.random()*window.bgnum);
	val==0&&(val=1);
	currentrandom==val&&(val=(val+1)%window.bgnum);
	currentrandom=val;
	// $("#containerbody").fadeOut("fast",function(){$(this).css("background-image","url(\"img/bg"+val+".jpg\")");$(this).fadeIn()});
	// $(".mask_bg").fadeOut("fast",function(){$(this).css("background-image","url(\"img/bg"+val+".jpg\")");$(this).fadeIn()});
	$("#containerbody").css("background-image","url(\"img/bg"+val+".jpg\")");
	$(".mask_bg").css("background-image","url(\"img/bg"+val+".jpg\")");
	window.currentSrcIndex = currentSrcIndex;
	var currentSrc = window.memberlist[window.currentSrcIndex].soundsrc;
    $("#currenttitle").text(window.memberlist[window.currentSrcIndex].soundtitle);
	$("#currentartist").text(window.memberlist[window.currentSrcIndex].soundartist);
	$(".disk").css("background-image","url(\"img/"+window.memberlist[window.currentSrcIndex].soundtitle+".jpg\")");
	$(".diskmask").css("background-image","url(\"img/"+window.memberlist[window.currentSrcIndex].soundtitle+".jpg\")");
	$(".listcontainer li").css("background-color","");
	$("[data-id="+window.currentSrcIndex+"]").css("background-color","rgba(255,0,0,0.3)");
	$("#membersshow #"+window.memberlist[currentSrcIndex].membername+" .containerwrap").load(window.memberlist[currentSrcIndex].memberintro+' .main-border');
	$("#membersshow .active").removeClass("active");
	$("#membersshow #"+window.memberlist[currentSrcIndex].membername).addClass("active");
	$(".download").click(function()
	{
		 window.open(currentSrc,'_blank');
	});
    this.src = currentSrc;
}
function formatTime(time) {
    var minutes = parseInt(time/60);
    var seconds = parseInt(time%60);
    seconds<10 && (seconds = "0" + seconds);
    minutes<10 && (minutes = "0" + minutes);
    return isNaN(time)?"∞:∞":minutes + ":" + seconds;
};

function parseMembers(data)
{
	window.memberlist;
	window.currentSrcIndex=0;
	window.memberlist = new Array();
	$.each(data,function(i,content)
	{
		window.memberlist[i]=content;
		$(".listcontainer ul").append('<li class="musiclist" data-id="'+i+'" '+(i==0?'style="background-color:rgba(255,0,0,0.3)"':'')+'><div><span>'+content["membername"]+'</span><div><span>'+content["soundtitle"]+'</span><span>'+content["soundartist"]+'</span></div><span>'+content["soundtime"]+'</span></div></li>');
		$("#membersshow").append('<li id="'+content["membername"]+'" '+(i==0?'class="active"':'')+'><div class="containerwrap"></div></li>');
	});
	$("#membersshow #"+window.memberlist[0].membername+" .containerwrap").load(window.memberlist[0].memberintro+' .main-border');
	audio.setCurrentSrc(0);
	$(".musiclist").click(function()
	{
		audio.setCurrentSrc($(this).attr("data-id"));
		audio.play();
		audio.loop = window.loopone;
	})
}