var express = require('express');
var app = express();

const PORT = process.env.PORT || 3000;

app.post('/greeting', function(req, res){
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(
    {
      text: "hello world"
    }
  ));
});

app.listen(PORT);
console.log('Listening on port ' + PORT + '...');