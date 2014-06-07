(function($){
    
    $.authQR = function(options){
        var defaultOptions = {
            image: '#authqr',
            callback: function(res){
                if(res.error){
                    console.error(res.error);
                } else {
                    console.log(res);
                }
            }
        };
        
        var op = $.extend(defaultOptions, options);
        
        if( !io ){
            throw Error('Required Socket.io lib not found');
        }
        
        var socket = io.connect('/');
        
        socket.on('connect',function(){
            console.log('Connection successful');
              
        }).on('code', function(data){
            console.log(data);
            $(op.image).html('<img src="https://api.qrserver.com/v1/create-qr-code/?data='+data.code+'&size=220x220&margin=0" title="QR Code" alt="QR Code" />');
              
        }).on('access', function(data){
            $(op.code).val(data.code);
            
            if(typeof op.callback == "function"){
                op.callback(data.code);
            }
              
        });
        
    };
    
})(jQuery);