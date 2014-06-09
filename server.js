var express = require('express');
var app = express();
var http = require('http');

var server = http.createServer(app).listen(process.env.PORT || 8888, process.env.IP || "0.0.0.0");

var io = require('socket.io').listen(server);
var authQR = require('./authqr').listen(io);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/static/index.html');
    
}).get('/access', function(req, res){
    var code = req.param('code');
    var user = req.param('user');
    
    console.log('Tentando validar '+user+":"+code);
    
    res.json({ 
        success: authQR.access(code, user) 
    });
    
}).get('/verify', function(req, res){
    var code = req.param('code');
    
    res.json( authQR.verify(code) );
    
}).get('/access/:code', function(req, res){ 
    // Leu o QR Code e não tem o App instalado
    res.sendfile(__dirname + '/static/explain.html');
    
});

app.use(express.static(__dirname + '/static'));