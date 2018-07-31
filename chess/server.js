var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var txt = url.parse(req.url, true).query;
  var output = txt.input; 
  res.end(output);
}).listen(8080);
