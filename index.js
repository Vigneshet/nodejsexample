var app = require('express')();
var http = require('http').Server(app);

app.get('/',function(req,res){
	res.send('<h1>Hello World</h1>');	
});

http.listen(5858,function(){
	console.log('server up in 5858')
});