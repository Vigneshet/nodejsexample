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

  $('[data-toggle="offcanvas"]').click(function() {
	  $("#chat-members").html('<li class="sidebar-brand"><a href="#">Users</a></li>');
	  $.ajax({
		  url:'/userDetails',
		  success:function(res){
			  //alert(res);
			  var chatmembers = res.split("#");
			  //alert(chatmembers.length);
			  for(var i=0;i<(chatmembers.length-1);i++){
				  var detailEmail = chatmembers[i].split("~")[0];
				  var detailUser = chatmembers[i].split("~")[1];
				  if($("#mailId").val()!=detailEmail)
				  $("#chat-members").append('<li><a href="#" class="chatMem" data-mail="'+detailEmail+'" onclick="setRec(this)">'+detailUser+'</a></li>')
			  }
		  }
	  });
	  
   $('#wrapper').toggleClass('toggled');
  });

  
  

  var socket = io();
  socket.on('connect', function() {
   //$("#sktId").val(socket.io.engine.id);
   //var joinData = $("#usr").val()+"~"+$("#mailId").val();
  });

  $("#chatinit").click(function() {
$("#fromsktId").val($("#mailId").val());
   socket.emit('join', {
    username: $("#usr").val(),
    mailid: $("#mailId").val()
   });
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
   message_side = message_side === 'left' ? 'right' : 'left';
   message = new Message({
    text: text,
    message_side: message_side
   });
   message.draw();
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
			return sendMessage(data.msgData);
	  } 
	  else{
		  
		  
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
	  $("#tosktId").val($(ths).attr("data-mail"));
	  $("#chatBox").attr("style","display:block");
	  $("#chatBox").find(".title").attr("data-mailId",$(ths).attr("data-mail"));
	  $("#chatBox").find(".title").html($(ths).html());
}