var db = require('./config/db')();

//Configure express app
var app = require('./config/express')();

//Configure express routes
require('./config/routes.js')(app);

app.listen('3000');
console.log('Listening on port 3000');