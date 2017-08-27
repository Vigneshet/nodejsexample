(function() {
 var Message;
 Message = function(arg) {
  this.text = arg.text, this.message_side = arg.message_side;
  this.draw = function(_this) {
   return function() {
    var $message;
    $message = $($('.message_template').clone().html());
    $message.addClass(_this.message_side).find('.text').html(_this.text);
    $('.messages').append($message);
    return setTimeout(function() {
     return $message.addClass('appeared');
    }, 0);
   };
  }(this);
  return this;
 };
 $(function() {

  $('#memberModal').modal('show');
  var trigger = $('.hamburger'),
   overlay = $('.overlay'),
   isClosed = false;

  trigger.click(function() {
   hamburger_cross();
  });

  function hamburger_cross() {

   if (isClosed == true) {
    overlay.hide();
    trigger.removeClass('is-open');
    trigger.addClass('is-closed');
    isClosed = false;
   } else {
    overlay.show();
    trigger.removeClass('is-closed');
    trigger.addClass('is-open');
    isClosed = true;
   }
  }
  
  
  function loadhierarchy(){
	  
	   $("#chat-members").html('<li class="sidebar-brand"><a href="#">Users</a></li>');
	  $.ajax({
		  url:'/userDetails',
		  success:function(res){
			 // alert(res);
			  var chatmembers = res.split("#");
			  //alert(chatmembers.length);
			  for(var i=0;i<(chatmembers.length-1);i++){
				  var detailEmail = chatmembers[i].split("~")[0];
				  var detailUser = chatmembers[i].split("~")[1];
				  if($("#fromsktId").val()!=detailEmail)
				  $("#chat-members").append('<li><a href="#" class="chatMem" data-mail="'+detailEmail+'" onclick="setRec(this)">'+detailUser+'</a><ul style="display:none"></ul></li>')
			  }
		  }
	  });
  }
  

  $('[data-toggle="offcanvas"]').click(function() {
	 
	 $.ajax({
		  url:'/userDetails',
		  success:function(res){
			  //alert(res);
			  var chatmembers = res.split("#");
			  //alert(chatmembers.length);
			  var flag = false;
			  for(var j=0;j<(chatmembers.length-1);j++){
				  flag = false;
				  var detailEmail = chatmembers[j].split("~")[0];
				  var detailUser = chatmembers[j].split("~")[1];
				  if($("#fromsktId").val()!=detailEmail){
					  var listItems = $("#chat-members li");
				  listItems.each(function(){
					var aTag = $(this).find(".chatMem");
					
			  var dataMailId =$(aTag).attr("data-mail");
			  if(dataMailId!=null && dataMailId!='' && dataMailId!="undefined" && dataMailId!=undefined && dataMailId == detailEmail){
				 
				flag=true;
				 
			  }
				  });
				 

if(!flag){
	 $("#chat-members").append('<li><a href="#" class="chatMem" data-mail="'+detailEmail+'" onclick="setRec(this)">'+detailUser+'</a><ul style="display:none"></ul></li>')
}
				  }
				  
				  
 
 
 
 
			  }
		  }	
	  });
	 
   $('#wrapper').toggleClass('toggled');
  });

  
  
loadhierarchy();
  var socket = io();
  socket.on('connect', function() {
   //$("#sktId").val(socket.io.engine.id);
   //var joinData = $("#usr").val()+"~"+$("#mailId").val();
  });

  $("#chatinit").click(function() {
	  
	  if($("#mailId").val()!=null && $("#mailId").val()!='' && $("#mailId").val()!='undefined' && $("#mailId").val()!=undefined && $("#usr").val()!=null && $("#usr").val()!='' && $("#usr").val()!='undefined' && $("#usr").val()!=undefined){
			$("#fromsktId").val($("#mailId").val());
   socket.emit('join', {
    username: $("#usr").val(),
    mailid: $("#mailId").val()
   });
   $('#memberModal').modal('hide');
	  }else{
		  
		$('#memberModal').modal('show');  
	  if($("#mailId").val()==null || $("#mailId").val()=='' || $("#mailId").val()=='undefined' || $("#mailId").val()==undefined){
		$("#mailId").attr("style","border: 2px solid red;border-radius: 4px;");  
	  }else{
		  
		  $("#mailId").attr("style","");
	  }
		
	if($("#usr").val()==null || $("#usr").val()=='' || $("#usr").val()=='undefined' || $("#usr").val()==undefined){
		$("#usr").attr("style","border: 2px solid red;border-radius: 4px;");  
	}else{
		
		$("#usr").attr("style","");
	}
		
	  }
	  
	  
  })


  var getMessageText, message_side, sendMessage;
  message_side = 'right';
  getMessageText = function() {
   var $message_input;
   $message_input = $('.message_input');
   return $message_input.val();
  };
  sendMessage = function(text) {
   var $messages, message;
   if (text.trim() === '') {
    return;
   }
   $('.message_input').val('');
   $messages = $('.messages');
   //message_side = message_side === 'left' ? 'right' : 'left';
   message = new Message({
    text: text,
    message_side: message_side
   });
   message.draw();
   message_side = 'right';
   return $messages.animate({
    scrollTop: $messages.prop('scrollHeight')
   }, 300);
  };
  $('.send_message').click(function(e) {
   //alert($("#usr").val());
   //var data = $('#tosktId').val() + '~' + $('.message_input').val();
   socket.emit('chat message', {
		tosktId:$('#tosktId').val(),
		fromsktId:$('#fromsktId').val(),
		msg:$('.message_input').val()
	});
   sendMessage($('.message_input').val());
   $('.message_input').val('');
  });
  socket.on('chat reply', function(data) {
	  //alert(data.fromSocketId);
	  
	  var currentMessenger =$("#chatBox").find(".title").attr("data-mailId");
	  if(currentMessenger!=null && currentMessenger!='' && currentMessenger!="undefined" && currentMessenger!=undefined && currentMessenger == data.fromSocketId){
		  message_side = 'left';
			return sendMessage(data.msgData);
	  } 
	  else{
		 // alert(data.fromSocketId);
		 // alert($("#chat-members").find(".a").length);
		  $("#chat-members").find(".chatMem").each(function(i,link){
			  var dataMailId = $(link).attr("data-mail");
			 // alert(dataMailId);
			  if(dataMailId!=null && dataMailId!='' && dataMailId!="undefined" && dataMailId!=undefined && dataMailId == data.fromSocketId){
				  console.log($(link).next());
				   var check = $(link).html();
				  if(check.indexOf("-")>-1){
					  var name = check.split("-")[0];
					  var count = check.split("-")[1];
					  count= parseInt(count)+1;
					  $(link).html(name+"-"+count);
				  }else{
					  var name = $(link).html();
					  $(link).html(name+"-"+1);
				  }
				  $(link).next().append('<li class="message left appeared"><div class="text_wrapper"><div class="text">'+data.msgData+'</div></div></li>');
			  }
		  });
	  }
   
  });

  $('.message_input').keyup(function(e) {
   if (e.which === 13) {
    //var data = $('#tosktId').val() + '~' + $('.message_input').val() +'~';
    socket.emit('chat message', {
		tosktId:$('#tosktId').val(),
		fromsktId:$('#fromsktId').val(),
		msg:$('.message_input').val()
	});
    return sendMessage(getMessageText());
   }
  });
 });
}.call(this));


var setRec = function(ths){
	  //alert($(ths).attr("data-mail"));
	  var targetId = $("#chatBox").find(".title").attr("data-mailId");
	  $("#chat-members").find(".chatMem").each(function(i,link){
		  var dataMailId = $(link).attr("data-mail");
	  if(targetId!=null && targetId!='' && targetId!="undefined" && targetId!=undefined && dataMailId==targetId){
		  $(link).next().html($("#chatBox").find(".messages").html())
	  }
	  });
	  
	  $("#tosktId").val($(ths).attr("data-mail"));
	  $("#chatBox").attr("style","display:block");
	  $("#chatBox").find(".title").attr("data-mailId",$(ths).attr("data-mail"));
	  var check = $(ths).html();
	  if(check.indexOf("-")>-1){
		  $("#chatBox").find(".title").html(check.split("-")[0]);
		  $(ths).html(check.split("-")[0]);
	  }else{
		$("#chatBox").find(".title").html($(ths).html());  
	  }
	  
	  $("#chatBox").find(".messages").html($(ths).next().html());
	  
}
