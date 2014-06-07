/**
 * Module dependencies.
 */
//var sanitizer = require('sanitizer');

var AuthQR = function(io){
    var activeSockets = {};
    var activeCodes = {};

    var register = function(socket){
        socket.code = "code_" + getUniqueCode();
        
        activeSockets[socket.code] = socket;
        
        socket.emit('code', {code: socket.code});
    };
    
    var getUniqueCode = function(){
        return new Date().getTime();
    };
    
    var init = function(){
        io.sockets.on('connection', register);
    };
    
    this.access = function(code, user){
        var socket = activeSockets[code];
        
        if(!socket){ 
            return false; 
        }
        
        var newCode = getUniqueCode();
        activeCodes[newCode] = {
            createAt: new Date(),
            user: user
        };
        
        socket.emit('access', {code: newCode});
        return true;
    };
    
    this.verify = function(code){
        var userObj = activeCodes[code];
        if(!userObj){
            return {error:{code:1, message: 'Invalid code'}};
        }
        
        delete activeCodes[code];
        
        return userObj;
    }
    
    init();
};

function listen(io){
    return new AuthQR(io);
}

module.exports.listen = listen;