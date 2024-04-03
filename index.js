var http = require('http');
require('./worker')
//create a server object:
http.createServer(function (req, res) {
  res.write('A Monk with Jai kishan in Cloud'); //write a response to the client
  res.end(); //end the response
}).listen(80);