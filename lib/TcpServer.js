const net = require('net');

class TcpServer extends net.Server {
  constructor(p) {
    super();
    this.address = '0.0.0.0'; //127.0.0.1是监听本机 0.0.0.0是监听整个网络
    this.port = p; //监听端口
    this.timeout = 0; //超时时间(单位：毫秒)
    this.clients = []; //客户端信息
  }

  start() {
    this.listen(this.port, this.address);
    this.on('connection', this._handleConnection);
    this.on('listening', () => {
      console.log('Server listening: %s:%s.', this.address, this.port);
    });
    this.on('error', (err) => {
      console.log('Server error: %s.', err);
    });
  }

  _handleConnection(socket) {
    this.clients.push({
      socket: socket,
      ip: socket.remoteAddress,
      port: socket.remotePort,
    });
    const client = this.getClient('socket', socket);
    //console.log('%s:%s connect.', client['ip'], client['port']);
    if (this.timeout != 0) {
      client['lastTime'] = Date.now();
      client['interval'] = setInterval(() => {
        if (Date.now() - client['lastTime'] > this.timeout) {
          //console.log('%s:%s overtime.', client['ip'], client['port']);
          this.closeClient(client);
        }
      }, this.timeout);
    }
    this.emit('connect', client);

    socket.on('data', (data) => {
      //console.log('%s:%s send: %s.', client['ip'], client['port'], data.toString());
      if (this.timeout != 0) {
        client['lastTime'] = Date.now();
      }
      client['data'] = data;
      this.emit('data', client, data);
    });
    socket.on('close', () => {
      //console.log('%s:%s disconnect.', client['ip'], client['port']);
      this.closeClient(client);
    });
    socket.on('error', (err) => {
      //console.log("%s:%s error: %s.", client['ip'], client['port'], err);
      this.closeClient(client);
    });
  }

  setTimeout(time) {
    this.timeout = time;
  }
  getClient(where, val) {
    for (let i in this.clients) {
      if (this.clients[i][where] == val) {
        return this.clients[i];
      }
    }
  }
  closeClient(client) {
    clearInterval(client['interval']); //停止超时判定
    this.emit('close', client);
    client['socket'].destroy();
    for (let i in this.clients) {
      if (this.clients[i] == client) {
        this.clients.splice(i, 1);
      }
    }
  }

  broadcast(data) {
    for (let i in this.clients) {
      this.clients[i]['socket'].write(data);
    }
  }
}

module.exports = TcpServer;
