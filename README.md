# TcpServer
一个简单的TCP服务器。

## 介绍

## 安装
```bash
npm install tcpserver --save
```

## 使用
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

## 许可证
MIT

## 相关链接
[github](https://github.com/rise0chen/tcpserver)  
