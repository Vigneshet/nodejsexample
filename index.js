var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var socketMap = new Map();
var socketName = new Map();
app.use(express.static('public'));

app.get('/',function(req,res){
	//res.send('<h1>Hello World</h1>');	
	res.sendFile(__dirname+'/index.html');
});



io.on('connection',function(socket){
	console.log('user connected');
	socket.on('join',function(data){
		console.log('joining');
		console.log(data.mailid);
		console.log(data.username);
		console.log(socket.id);
		socketMap.set(data.mailid,socket);
		socketName.set(data.mailid,data.username);
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('chat message',function(data){
		//console.log(msg);
		var toSocketId = data.tosktId;
		var msgData = data.msg;
		var fromSocketId = data.fromsktId
		socketMap.get(toSocketId).emit('chat reply',{
			msgData : msgData,
			fromSocketId:fromSocketId
		});
	});
	
});


app.get('/userDetails',function(req,res){
	var data ='';
	console.log('/userdetails');
	for (var [key, value] of socketName.entries()) {
		console.log(key + ' = ' + value);
		data +=key+"~"+value;
		data += "#";
	}
	console.log(data);
	//res.write(data);
	res.end(data);
})

http.listen(port,function(){
	console.log('server up');
});
