# TcpServer

一个简单的 TCP 服务器。

## 安装

```bash
npm install tcpserver --save
```

## 使用

```js
const TcpServer = require('tcpserver');
const tcpServer = new TcpServer(1234);

tcpServer.on('connect', client => {
  console.log('%s:%s connect.', client['ip'], client['port']);
});
tcpServer.on('data', client => {
  let data = client['data'].toString();
  console.log('%s:%s send: %s.', client['ip'], client['port'], data);
  tcpServer.broadcast(data);
});
tcpServer.on('close', client => {
  console.log('%s:%s close.', client['ip'], client['port']);
});
tcpServer.start();
```

## 许可证

MIT

## 相关链接

[github](https://github.com/rise0chen/tcpserver)
