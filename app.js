var http=require('http');
var path=require('path');
var express=require('expess');
var braintree = require('braintree');

var app=express();
var server=http.createServer(app);
app.use(express.bodyParser);

app.set('views',__dirname+'/client');
app.set('view engine','ejs');
app.set('view engine','html');


app.engine('html',require('ejs').__express);
