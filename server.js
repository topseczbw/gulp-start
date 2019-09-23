const http = require('http')
const querystring = require('querystring')

var server = http.createServer(function(req, res) {
  res.end(JSON.stringify({
    name: 'zbw',
    sex: 1
  }))
}).listen(8222)
