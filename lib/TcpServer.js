const net = require('net');

class TcpServer extends net.Server{
	constructor(p) {
		super();
		this.address = '0.0.0.0'; //127.0.0.1是监听本机 0.0.0.0是监听整个网络
		this.port = p;      //监听端口
		this.timeout = 0;   //超时时间(单位：秒)
		this.clients = [];  //客户端信息
		this.callback = {}; //触发事件
		this.callback['connect'] = function(...args){};
		this.callback['data'] = function(...args){};
		this.callback['close'] = function(...args){};
	}
	
	start() {
		let self = this;
		self.listen(self.port, self.address);
		self.on('connection', self.clientHandler);
		self.on('listening', function(){console.log('Server listening: %s:%s.', self.address, self.port);});
		self.on('error', function(err){console.log("Server error: %s.",err);});
	}
	
	clientHandler(socket) {
		let self = this;
		//console.log('%s:%s connect.', socket.remoteAddress, socket.remotePort);
		self.clients.push({'socket': socket});
		let client = self.getClient('socket', socket);
		self.callback['connect'](client);

		socket.on('data', function(data){
			//console.log('%s:%s send: %s.', socket.remoteAddress, socket.remotePort, data.toString());
			self.callback['data'](client, data);
		});
		socket.on('close', function(){
			//console.log('%s:%s disconnect.', socket.remoteAddress, socket.remotePort);
			self.callback['close'](client);
			for (let i=0; i<self.clients.length; i++){
				if (self.clients[i] == client){
					self.clients.splice(i, 1);
				}
			}
		});
		socket.on('error', function(err){
			//console.log("%s:%s error: %s.", socket.remoteAddress, socket.remotePort, err);
			self.callback['close'](client);
			for (let i=0; i<self.clients.length; i++){
				if (self.clients[i] == client){
					self.clients.splice(i, 1);
				}
			}
		});
	}
	
	
	getClient(where, val) {
		let self = this;
		for (let i=0; i<self.clients.length; i++){
			if (self.clients[i][where] == val){
				return self.clients[i];
			}
		}
	}
	broadcast(client, data){
		let self = this;
		for (let i=0; i<self.clients.length; i++){
			self.clients[i]['socket'].write(data);
		}
	}
}

module.exports = TcpServer;
