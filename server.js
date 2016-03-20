var express = require('express');
var app = express();

app.use(express.logger());

app.get('/hello/:name', function(req, res){
    req.params.name = req.params.name.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
       return '&#' + i.charCodeAt(0) + ';';
    });

    res.send('Hello <b>' + req.params.name + '</b>!');
});

console.log('Express server started on port %s', 80);
app.listen(80);
