# TcpServer

A simple tcp server.

## Installation

```bash
npm install tcpserver --save
```

## Usage

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

## License

MIT

## Reference

[github](https://github.com/rise0chen/tcpserver)
