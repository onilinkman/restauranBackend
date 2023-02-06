
const path = require('path');
const port=8000
let serverStarted=false;


const dirPublic=path.join(__dirname, 'public')
const dirFiles={
  uploads:path.join(__dirname,"uploads"),
  imgMenu:path.join(__dirname,"uploads/imgMenu")
}

const Server = require(path.join(__dirname, 'models/server'));

if (!serverStarted) {
    const server = new Server(dirPublic,port,dirFiles);
    server.listen();
    serverStarted = true;
  }

