# TcpServer
A simple tcp server.

## Installation
```bash
npm install tcpserver --save
```

## Usage
``` js
const TcpServer = require('tcpserver');

const tcpServer = new TcpServer(1234);
tcpServer.start();
tcpServer.callback['connect'] = function(client){
	console.log('%s:%s connect.', client['socket'].remoteAddress, client['socket'].remotePort);
	
};
tcpServer.callback['data'] = function(client, data){
	console.log('%s:%s send: %s.', client['socket'].remoteAddress, client['socket'].remotePort, data.toString());
	data = data.toString().trim();
	//tcpServer.broadcast(client, data);
	for (let x in tcpServer.clients) {
		tcpServer.clients[x]['socket'].write(data);
	}
};
tcpServer.callback['close'] = function(client){
	console.log('%s:%s disconnect.', client['socket'].remoteAddress, client['socket'].remotePort);
};
```

## License
MIT

## Reference
[github](https://github.com/rise0chen/tcpserver)  
