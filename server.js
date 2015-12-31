var http = require('http');
var path = require('path');
var braintree = require("braintree");
var express = require('express');


var clientToken;

var app = express();
var server = http.createServer(app);
app.use(express.bodyParser());


app.set('views', __dirname + '/client');


app.set('view engine', 'ejs');
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "",
  publicKey: "",
  privateKey: ""
});

app.get("/client_token", function(req, res) {
  gateway.clientToken.generate({}, function(err, response) {
    console.log(response.clientToken);
    res.send(response.clientToken);
  });
});

app.post("/checkout", function(req, res) {
 
  var nonce = req.body.payment_method_nonce;
  var transaction_amount = req.body.amount;
  if (transaction_amount == 0.0 || transaction_amount == undefined) {
    transaction_amount = "10.00";
  }

  // Use payment method nonce here
  console.log("in purchases for amount" + transaction_amount);
  gateway.transaction.sale({
    amount: transaction_amount,
    paymentMethodNonce: nonce,
    
    
    options: {
      submitForSettlement: true,
    }
  }, function(err, result) {
    console.log(result);
    if (err) {
      res.send(err);
    }
    else if (result.success) {
      res.send(result.transaction.id);
      
    }
    else {
      res.send(result.message);
    }
  });
});

app.post("/purchases", function(req, res) {
  var nonce = req.body.payment_method_nonce;
  var transaction_amount = req.body.amount;
  if (transaction_amount == 0.0 || transaction_amount == undefined) {
    transaction_amount = "10.00";
  }

  // Use payment method nonce here
  console.log("in purchases for amount" + transaction_amount);
  gateway.transaction.sale({
    amount: transaction_amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true,
    }
  }, function(err, result) {
    console.log(result);
    if (err) {
      res.send("<h1>Error:  " + err + "</h1>");
    }
    else if (result.success) {
      res.send("<h3>Success! Transaction ID: " + result.transaction.id + "</h3>");
      res.render('transactionStatus', {
        transactionID: result.transaction.id
      });
    }
    else {
      res.send("<h3>Error: " + result.message + "</h3>");
    }
  });
});

app.use(express.static(path.resolve(__dirname, 'client')));

//app.get('/index',function(req,res){res.render('index')});
app.get('/test', function(req, res) {
  clientToken = gateway.clientToken.generate({

  }, function(err, response) {
    clientToken = response.clientToken;
    console.log(clientToken);
    res.render('test', {
      clientToken: clientToken
    });

  });

});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
