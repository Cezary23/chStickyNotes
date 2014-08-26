/*

	js-sticky-notes.js
	Aug 26th, 2014
	Cezary Kubel

	Creates sticky notes with JQuery & Local Storage

*/

$(document).ready(function() {
	if(jsStickies == null) {
		var jsStickies = []; 
	}

	var currentPath = window.location.pathname;
	
	var chStickyString = window.localStorage.getItem("chSticky-customer-" + $("#addSticky span#customer").attr("value"));
	
	if(chStickyString) {
		chObj = JSON.parse(chStickyString);
		$.each(chObj, function() {
			
			if(this.page == currentPath) {
				var number = this.id.split('sticky-')[1];
				
				$("#content").append("<div class='chSticky "+this.id+"' style='left: "+this.left+";top:"+this.top+"'><label>"+this.content+"</label>" +
						"<span class='sticky-number' value='"+number+"'></span>" +
						"<h2 class='editHeader' style='display:none'>Edit Sticky Note</h2><br />" +
						"<a href='#' id='chDeleteFinalSticky' class='deleteSticky' style='color:#333' style='top: 4px;right:4px'>X</a>" +
						"<textarea id='editValue' style='display: none'>"+this.content+"</textarea>" +
						"<a href='#' class='saveEdit' style='display: none'>Save</a></div>");
				$(".chSticky").draggable();
	
			}
			
			chStickies.push({
		       "id": this.id,
		       "left": this.left,
		       "top": this.top,
		       "page": this.page,
		       "content": this.content
			});
		});
	}
	
	var stickyText = "";
	
	$("#chNewSticky").click(function(){
		var display = $("#addSticky").css("display");
		if(display == "none") {
			$("#chTextarea").val("");
			$("#addSticky").css("display", "block");
			$("#addSticky input").focus();
		}
	});
		
	$(".save").click(function() {
		stickyText = $("#chTextarea").val();
		stickyText = stickyText.replace(/\r?\n/g, '<br />');
		if(stickyText.length > 0) {
			var number = Math.floor(Math.random() * 1000);
			$("#addSticky").css("display", "none");
			$("#content").append("<div class='chSticky sticky-"+number+"'><label>"+stickyText+"</label>" +
					"<span class='sticky-number' value='"+number+"'></span>" +
					"<h2 class='editHeader' style='display:none'>Edit Sticky Note</h2><br />" +
					"<a href='#' id='chDeleteFinalSticky' class='deleteSticky' style='color:#333' style='top: 4px;right:4px'>X</a>" +
					"<textarea id='editValue' style='display: none'>"+stickyText+"</textarea>" +
					"<a href='#' class='saveEdit' style='display: none'>Save</a></div>");
			$(".chSticky").draggable();
			
			// Save to JSON
			chStickies.push({
		       "id": "sticky-"+number,
		       "left": "",
		       "top": "",
		       "page": window.location.pathname,
		       "content": stickyText
			});
			
			console.log(chStickies);
			
		}
		else
		{
			console.log("You must enter text in the sticky note to save!")
		}
	});
	
	$("#content").on('mouseup','.chSticky', function() {
		var left = $(this).css("left"),
			top = $(this).css("top"),
			val = $(this).find("span.sticky-number").attr("value");
		
		for(var x = 0; x < chStickies.length; x++) {
			if(chStickies[x].id == "sticky-" + val) {
				chStickies[x].left = left;
				chStickies[x].top = top;
			}
		}
		
		var customerId = "chSticky-customer-" + $("#addSticky span#customer").attr("value");
		
		var chStickiesString = JSON.stringify(chStickies);
		window.localStorage.setItem(customerId,chStickiesString);
		
		console.log(window.localStorage);
		
	});
	
	$("#content").on('click','.deleteSticky', function() {
		$(this).parent().remove();
		var id = "sticky-"+$(this).parent().find("span.sticky-number").attr("value");
		
		var index = -1;
		for(var i = 0;i < chStickies.length; i++) {
		    if (chStickies[i].id === id) {
		        index = i;
		        break;
		    }
		}
		
		chStickies.splice(index,1);
		chStickiesString = JSON.stringify(chStickies);
		var customerId = "chSticky-customer-" + $("#addSticky span#customer").attr("value");
		window.localStorage.setItem(customerId,chStickiesString);
		
	});
	
	$("#content").on('click','.saveEdit', function() {
		var newVal = $(this).parent().find("#editValue").val();
		newVal = newVal.replace(/\r?\n/g, '<br />');
		var parent = $(this).parent();
		parent.css("z-index","1000");
		parent.find('label').html(newVal);
		parent.find('label').show();
		parent.find('textarea').hide().focus();
        parent.find("a.saveEdit").hide();
        parent.find("h2.editHeader").hide();
        parent.find("a.closeEdit").removeClass("closeEdit").addClass("deleteSticky");
        
        var id = "sticky-"+$(this).parent().find("span.sticky-number").attr("value");
		
		var index = -1;
		for(var i = 0;i < chStickies.length; i++) {
		    if (chStickies[i].id === id) {
		        index = i;
		        break;
		    }
		}
		
		console.log("index" + index);
		console.log("newVal" + newVal);
		console.log(chStickies);

		chStickies[index].content = newVal;
		chStickiesString = JSON.stringify(chStickies);
		var customerId = "chSticky-customer-" + $("#addSticky span#customer").attr("value");
		window.localStorage.setItem(customerId,chStickiesString);
	});
	
	$("#content").on('dblclick','.chSticky label', function() {
		var parent = $(this).parent();
		parent.css("z-index","1001");
		parent.find('label').hide();
		var labelVal = parent.find('label').html();
		labelVal = labelVal.replace(/<br\s*\/?>/ig, "\r\n");
		parent.find('textarea').attr("value", labelVal);
		parent.find('textarea').show().focus();
        parent.find("a.saveEdit").show();
        parent.find("h2.editHeader").show();
        parent.find("a.deleteSticky").removeClass("deleteSticky").addClass("closeEdit");
	});

	$("#cancelNewSticky").click(function() {
		$(this).parent().css("display","none");
	});	
	
	$("#content").on('click','.closeEdit', function() {
		var parent = $(this).parent();
		parent.css("z-index","1000");
		parent.find('label').show();
		parent.find('textarea').hide().focus();
        parent.find("a.saveEdit").hide();
        parent.find("h2.editHeader").hide();
        parent.find("a.closeEdit").removeClass("closeEdit").addClass("deleteSticky");
	});
	
	window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
	
	/* SELECTING COLORS */
	
	$("#selectDefault").click(function(){
		console.log("Select Default");
		var color = $("#selectDefault span").css("background");
		$(this).find("span").text("X");
		$("#selectRed").find("span").text("");
		$("#selectGreen").find("span").text("");
		$("#selectPurple").find("span").text("");
		$(".chSticky").css("background",color);
	});
	
	$("#selectRed").click(function(){
		console.log("Select Red");
		var color = $("#selectRed span").css("background");
		$(this).find("span").text("X");
		$(this).find("span").css("border", "1px solid #dd3b3b")
							.css("color", "white");
		$("#selectDefault").find("span").text("");
		$("#selectGreen").find("span").text("");
		$("#selectPurple").find("span").text("");
		$(".chSticky").css("background",color);
		$(".chSticky h2").css("color","#ffffff");
	});
	
	$("#selectGreen").click(function(){
		console.log("Select Green");
		var color = $("#selectGreen span").css("background");
		$(this).find("span").text("X");
		$("#selectRed").find("span").text("");
		$("#selectDefault").find("span").text("");
		$("#selectPurple").find("span").text("");
		$(".chSticky").css("background",color);
	}); 
	
	$("#selectPurple").click(function(){
		console.log("Select Purple");
		var color = $("#selectPurple span").css("background");
		$(this).find("span").text("X");
		$("#selectRed").find("span").text("");
		$("#selectGreen").find("span").text("");
		$("#selectDefault").find("span").text("");
		$(".chSticky").css("background",color);
	});
	
});
