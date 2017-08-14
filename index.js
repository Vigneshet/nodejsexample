var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 8080;
app.get('/',function(req,res){
	res.send('<h1>Hello World</h1>');	
});

http.listen(port,function(){
	console.log('server up');
});
