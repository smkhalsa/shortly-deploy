var app = require('./server-config.js');
// console.log(process.env.NODE_ENV); //undefined
// console.log(app.get('env')); //development

var port = process.env.PORT || 1337;

app.listen(port);

console.log('Server now listening on port ' + port);
