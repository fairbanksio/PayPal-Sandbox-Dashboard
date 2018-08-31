var express = require('express');
var queryString = require('querystring');
var request = require('request');
var bodyParser = require('body-parser');
var logger = require('./configs/logger');
var paypal = require('paypal-rest-sdk');
var url = require('url');
var mongoose = require("mongoose");
var newIPN = require('./models/ipn');

const path = require('path');

// MongoDB Setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'DB Connection Error:'));
connection.once('open', function () { });

// Express Setup
var serverHost = process.env.SERVER_HOST;
var app = express();
app.use(bodyParser.urlencoded({	extended: false }));
app.use(bodyParser.json());

// Define Client Path
app.use(express.static(path.join(__dirname, 'client/build')));


////
// Payment Endpoints
////

// Create Payment
app.post('/api/create-payment', function(req, res){
	var apiKey = req.body.apiCredentials.key
	var apiSecret = req.body.apiCredentials.secret
	var payment = req.body.payment
	var redirectURL = req.body.redirectUrl

	createPayment(apiKey, apiSecret, redirectURL, payment, function(paymentResults){
		res.json(paymentResults)
		logger.info("Payment data sent back to user: " + JSON.stringify(paymentResults));
	});
})

// Create Billing Agreement
app.post('/api/create-billingplan', function(req, res){
	var apiKey = req.body.apiCredentials.key
	var apiSecret = req.body.apiCredentials.secret
	var billingPlanAttributes = req.body.billingPlanAttributes
	createBillingPlan(apiKey, apiSecret, billingPlanAttributes,  function(billingPlanResults){
		// Redirect to our approval handler to execute payment
		res.json(billingPlanResults)
	});
})

// Create Billing Agreement
app.post('/api/create-agreement', function(req, res){
	var apiKey = req.body.apiCredentials.key
	var apiSecret = req.body.apiCredentials.secret
	var billingAgreementAttributes = req.body.billingAgreementAttributes
	createBillingAgreement(apiKey, apiSecret, billingAgreementAttributes, function(billingAgreementResults){
		// Redirect to our approval handler to execute payment
		res.json(billingAgreementResults)
	});
})

// Execute Payment
app.post('/api/execute-payment', function(req, res){
	var payerId = req.body.PayerID;
	var paymentId = req.body.paymentId;
	var apiKey = req.body.apiCredentials.key
	var apiSecret = req.body.apiCredentials.secret

	executePayment(apiKey, apiSecret, payerId, paymentId, function(paymentResults){
		res.json(paymentResults);
		logger.info("User has approved the payment: " + JSON.stringify(paymentResults));
	})
})

// Execute Billing Agreement
app.post('/api/execute-agreement', function(req, res){
	var paymentToken = req.body.token
	var apiKey = req.body.apiCredentials.key
	var apiSecret = req.body.apiCredentials.secret
	executeAgreement(apiKey, apiSecret, paymentToken, function(agreement){
		logger.info('User has approved the agreement: '+ JSON.stringify(agreement));
		res.json(agreement);
	})
})


////
// Payment Handlers
////
function createPayment(apiKey, apiSecret, redirectURL, paymentJSON, callback){
	if(apiKey && apiSecret){
		// Configure PayPal SDK
		paypal.configure({
			'mode': 'sandbox',
			'client_id': apiKey,
			'client_secret': apiSecret,
			'headers' : {
			'custom': 'header'
			}
		});

		paypal.payment.create(paymentJSON, function (error, payment) {
			if (error) {
				callback(error)
			} else {
				logger.info("Payment Created: " + JSON.stringify(payment));
				callback(payment)
			}
		});
	}
}

function createBillingPlan(apiKey, apiSecret, billingPlanAttributes, callback){
	if(apiKey && apiSecret){
		// Configure PayPal SDK
		paypal.configure({
			'mode': 'sandbox',
			'client_id': apiKey,
			'client_secret': apiSecret,
			'headers' : {
			'custom': 'header'
			}
		});

		var billingPlanUpdateAttributes = [
			{
				"op": "replace",
				"path": "/",
				"value": {
					"state": "ACTIVE"
				}
			}
		];

		paypal.billingPlan.create(billingPlanAttributes, function (error, billingPlan) {
			if (error) {
				logger.error("Error Creating Billing Plan: " + error);
				callback(error)
			} else {
				logger.info("Billing plan created: " + JSON.stringify(billingPlan));
				// Activate the plan by changing status to Active
				paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
					if (error) {
						logger.error("Error activating billing plan: " + error);
					} else {
						logger.info("Billing plan state changed to " + billingPlan.state);
						callback(billingPlan)
					}
				});
			}
		});
	}
}

function createBillingAgreement(apiKey, apiSecret, billingAgreementAttributes, callback){
	if(apiKey && apiSecret){
		// Configure PayPal SDK
		paypal.configure({
			'mode': 'sandbox',
			'client_id': apiKey,
			'client_secret': apiSecret,
			'headers' : {
			'custom': 'header'
			}
		});

    // Use activated billing plan to create agreement
    paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
	    if (error) {
        logger.error("Error with billing plan: " + error);
        callback(error)
	    } else {
        logger.info("Billing agreement created from billing plan: " + JSON.stringify(billingAgreement));
				callback(billingAgreement)
	    }
    });
	}
}

function executePayment(apiKey, apiSecret, payerId, paymentId, callback){
		// Configure PayPal SDK
		paypal.configure({
			'mode': 'sandbox',
			'client_id': apiKey,
			'client_secret': apiSecret,
			'headers' : {
			'custom': 'header'
			}
		});

		var execute_payment_json = { "payer_id": payerId	};

		paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
			if (error) {
				logger.error('Error executing payment: ' + error.response);
				callback(error);
			} else {
				logger.info("Payment executed: " + JSON.stringify(payment));
				callback(payment);
			}
		});
}

function executeAgreement(apiKey, apiSecret, paymentToken, callback){
		// Configure PayPal SDK
		paypal.configure({
			'mode': 'sandbox',
			'client_id': apiKey,
			'client_secret': apiSecret,
			'headers' : {
			'custom': 'header'
			}
		});

		paypal.billingAgreement.execute(paymentToken, {}, function (error, billingAgreement) {
			if (error) {
				logger.error('Execute Agreement Error: ' + error);
				callback(error);
			} else {
				logger.info("Billing agreement has been executed: " + JSON.stringify(billingAgreement));
				callback(billingAgreement);
			}
		});
}


////
// IPN Handler and Database Management
////
app.post('/', function(req, res) {
	logger.info('New IPN Message: ' + JSON.stringify(req.body)); // Before anything else, log the IPN
	// Read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
	req.body = req.body || {};
	res.status(200).send('OK');
	res.end();

	postreq = JSON.toString(req.body)
	var postreq = 'cmd=_notify-validate';
	for (var key in req.body) {
		var value = queryString.escape(req.body[key]);
		postreq = postreq + "&" + key + "=" + value;
	}

	logger.debug("IPN Postback: " + postreq);

	var options = {
		url: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
		method: 'POST',
		headers: {
			'Connection': 'close'
		},
		body: postreq,
		strictSSL: true,
		rejectUnauthorized: false,
		requestCert: true,
		agent: false
	};

	request(options, function callback(error, response, body) {
		logger.debug(response.statusCode + ': ' + body);
		if (!error && response.statusCode === 200) {
			// inspect IPN validation result and act accordingly
			if (body.substring(0, 8) === 'VERIFIED') {
				// VERIFIED
				var item_name = req.body['item_name'];
				var item_number = req.body['item_number'];
				var payment_status = req.body['payment_status'];
				var payment_amount = req.body['mc_gross'];
				var payment_currency = req.body['mc_currency'];
				var txn_id = req.body['txn_id'];
				var receiver_email = req.body['receiver_email'];
				var payer_email = req.body['payer_email'];
				// Loop through the array and print the NVPs:
				logger.debug('IPN Data: ')
				for (var key in req.body) {
					var value = req.body[key];
					logger.debug(key + "=" + value);
				}
			} else if (body.substring(0, 7) === 'INVALID') {
				// INVALID
				logger.error('IPN Invalid: ' + body);
			}
			// Save the IPN and associated data to MongoDB
			newIPN.create({
				ipnMessageRaw: JSON.stringify(req.body),
				ipnMessage: req.body,
				ipnPostback: postreq,
				status: body,
				timestamp: Date.now()
			}, function(err, res){
				if(err) logger.error('DB Create Error' + err)
			});
		}
	});
});

// Get IPN Data from MongoDB
app.get('/api/ipnData', function(req, res){
  connection.db.collection("ipn", function(err, collection){
    collection.find({}).sort({ timestamp: -1 }).limit(50).toArray(function(err, data){
      res.json(data);
    })
  });
})

// Get a count of IPNs from MongoDB
app.get('/api/ipnCount', function(req, res){
	connection.db.collection("ipn", function(err, collection){
		collection.find({}).count(function(err, data){
			res.json(data);
		})
	});
})


////
// Serve Client Application
///
app.get('*', (req,res) => {
	res.sendFile(path.join(__dirname, 'client/build/index.html'));
});


////
// App Launcher
////
var port = process.env.PORT || 3000;
var host = process.env.HOST || '0.0.0.0';
app.listen(port, host, function() {
	var msg = 'Server listening at http://localhost:' + port;
	console.log(msg);
});