var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.get('/',function(req,res){
	//res.send('<h1>Hello World</h1>');	
	res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){
	console.log('user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on('chat message',function(msg){
		console.log(msg);
		io.emit('chat reply',msg);
	});
	
})


http.listen(port,function(){
	console.log('server up');
});
