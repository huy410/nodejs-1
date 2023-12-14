const io = require('socket.io')(3000);

io.on('connect', socket => {
  console.log('có người kết nối này');
});
