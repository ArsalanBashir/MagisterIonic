angular.module('magister.services', [])

.factory('socket', function(socketFactory){
    var myIoSocket = io.connect('http://188.166.222.196');
    mySocket = socketFactory({ioSocket: myIoSocket});
    return mySocket;
});
