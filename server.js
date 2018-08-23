var express = require('express');
var queryString = require('querystring');
var request = require('request');
var bodyParser = require('body-parser');
var logger = require('./configs/logger');
var paypal = require('paypal-rest-sdk');
var url = require('url');
var mongoose = require("mongoose");

const path = require('path');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'DB Connection Error:'));
connection.once('open', function () { });

var serverHost = process.env.SERVER_HOST;
var app = express();
app.use(bodyParser.urlencoded({	extended: false }));

// Define path for react-app client front end
app.use(express.static(path.join(__dirname, 'client/build')));

// Create Payment
app.get('/api/create-payment', function(req, res){
	var apiKey = req.query.APIKey;
	var apiSecret = req.query.APISecret;
	var redirectURL = req.query.RedirectURL;
	createPayment(apiKey, apiSecret, redirectURL, function(paymentResults){
		//redirect to our approval handler to execute payment
		res.json(paymentResults)
		console.log("Payment data sent back to user")
	});
})

// Create Billing Agreement
app.get('/api/create-agreement', function(req, res){
	var apiKey = req.query.APIKey;
	var apiSecret = req.query.APISecret;
	var redirectURL = req.query.RedirectURL;
	createBillingPlan(apiKey, apiSecret, redirectURL, function(billingAgreementResults){
		// Redirect to our approval handler to execute payment
		res.json(billingAgreementResults)
	});
})

// Execute Payment
app.get('/api/execute-payment', function(req, res){
	var payerId = req.query.PayerID;
	var paymentId = req.query.paymentId;
	var apiKey = req.query.APIKey;
	var apiSecret = req.query.APISecret;
	console.log("User has approved the payment");
	executePayment(apiKey, apiSecret, payerId, paymentId, function(payment){
		//console.log(payment)
		res.json(payment);
	})
})

// Execute Billing Agreement
app.get('/api/execute-agreement', function(req, res){
	var paymentToken = req.query.token
	var apiKey = req.query.APIKey;
	var apiSecret = req.query.APISecret;
	console.log("User has approved the agreement");
	executeAgreement(apiKey, apiSecret, paymentToken, function(agreement){
		//console.log(payment)
		res.json(agreement);
	})
})

app.get('/api/ipnData', function(req, res){
    connection.db.collection("ipn", function(err, collection){
            console.time('Loaded IPN Data from DB:');
            collection.find({}).sort({ timestamp: -1 }).limit(50).toArray(function(err, data){
                    res.json(data);
                    console.timeEnd('Loaded IPN Data from DB:');
            })
    });
})

app.get('/api/ipnCount', function(req, res){
	connection.db.collection("ipn", function(err, collection){
			collection.find({}).count(function(err, data){
					res.json(data);
			})
	});
})

function createPayment(apiKey, apiSecret, redirectURL, callback){
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

		var create_payment_json = {
			"intent": "sale",
			"payer": {
					"payment_method": "paypal"
			},
			"redirect_urls": {
					"return_url": redirectURL,
					"cancel_url": redirectURL
			},
			"transactions": [{
					"item_list": {
							"items": [{
									"name": "item",
									"sku": "item",
									"price": "1.00",
									"currency": "USD",
									"quantity": 1
							}]
					},
					"amount": {
							"currency": "USD",
							"total": "1.00"
					},
					"description": "This is the payment description."
			}]
		};

		paypal.payment.create(create_payment_json, function (error, payment) {
			if (error) {
					callback(error)
					//throw error;
			} else {
					console.log("Payment Created");
					callback(payment)
			}
		});
	}
}

function createBillingPlan(apiKey, apiSecret, redirectURL, callback){
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

		var isoDate = new Date();
		isoDate.setSeconds(isoDate.getSeconds() + 10);
		isoDate = isoDate.toISOString().slice(0,19) + 'Z';
		console.log(isoDate);

		var billingPlanAttributes = {
		    "description": "Create Plan for Regular",
		    "merchant_preferences": {
		        "auto_bill_amount": "yes",
		        "cancel_url": redirectURL,
		        "initial_fail_amount_action": "continue",
		        "max_fail_attempts": "1",
		        "return_url": redirectURL,
		        "setup_fee": {
		            "currency": "USD",
		            "value": "25"
		        }
		    },
		    "name": "Testing1-Regular1",
		    "payment_definitions": [
		        {
		            "amount": {
		                "currency": "USD",
		                "value": "100"
		            },
		            "charge_models": [
		                {
		                    "amount": {
		                        "currency": "USD",
		                        "value": "10.60"
		                    },
		                    "type": "SHIPPING"
		                },
		                {
		                    "amount": {
		                        "currency": "USD",
		                        "value": "20"
		                    },
		                    "type": "TAX"
		                }
		            ],
		            "cycles": "0",
		            "frequency": "DAY",
		            "frequency_interval": "1",
		            "name": "Regular 1",
		            "type": "REGULAR"
		        },
		        {
		            "amount": {
		                "currency": "USD",
		                "value": "20"
		            },
		            "charge_models": [
		                {
		                    "amount": {
		                        "currency": "USD",
		                        "value": "10.60"
		                    },
		                    "type": "SHIPPING"
		                },
		                {
		                    "amount": {
		                        "currency": "USD",
		                        "value": "20"
		                    },
		                    "type": "TAX"
		                }
		            ],
		            "cycles": "4",
		            "frequency": "DAY",
		            "frequency_interval": "1",
		            "name": "Trial 1",
		            "type": "TRIAL"
		        }
		    ],
		    "type": "INFINITE"
		};

		var billingAgreementAttributes = {
		    "name": "Fast Speed Agreement",
		    "description": "Agreement for Fast Speed Plan",
		    "start_date": isoDate,
		    "plan": {
		        "id": "P-0NJ10521L3680291SOAQIVTQ"
		    },
		    "payer": {
		        "payment_method": "paypal"
		    },
		    "shipping_address": {
		        "line1": "StayBr111idge Suites",
		        "line2": "Cro12ok Street",
		        "city": "San Jose",
		        "state": "CA",
		        "postal_code": "95112",
		        "country_code": "US"
		    }
		};

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
		        console.log(error);
						callback(billingPlan)
						//throw error;
		    } else {
		        console.log("Billing plan created");

						billingAgreementAttributes.plan.id = billingPlan.id;
						// Activate the plan by changing status to Active
		        paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, function (error, response) {
		            if (error) {
		                console.log(error);
		                //throw error;
		            } else {
		                console.log("Billing plan state changed to " + billingPlan.state);
		                billingAgreementAttributes.plan.id = billingPlan.id;

		                // Use activated billing plan to create agreement
		                paypal.billingAgreement.create(billingAgreementAttributes, function (error, billingAgreement) {
		                    if (error) {
		                        console.log(error);
		                        //throw error;
		                    } else {
		                        console.log("Billing agreement created from billing plan");
		                        //console.log(billingAgreement);
														callback(billingAgreement)
		                    }
		                });
		            }
		        });
		    }
		});
	}
}

function executePayment(apiKey, apiSecret, payerId, paymentId, callback){
		//configure paypal
		paypal.configure({
			'mode': 'sandbox',
			'client_id': apiKey,
			'client_secret': apiSecret,
			'headers' : {
			'custom': 'header'
			}
		});

		var execute_payment_json = {
				"payer_id": payerId,
				"transactions": [{
						"amount": {
								"currency": "USD",
								"total": "1.00"
						}
				}]
		};
		paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
				if (error) {
						console.log(error.response);
						callback(error);
						//throw error;
				} else {
						console.log("Payment executed");
						callback(payment);
				}
		});
}

function executeAgreement(apiKey, apiSecret, paymentToken, callback){
		//configure paypal
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
						console.log(error);
						callback(error);
				} else {
						console.log("Billing agreement has been executed");
						callback(billingAgreement);
				}
		});
}
// Serve react-app client application
app.get('*', (req,res) => {
 res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

var port = null;
if(process.env.PORT){ port = process.env.PORT; }else{ port = 3000; } // Default port is 8888 unless passed
app.listen(port);
var msg = 'Server listening at http://localhost:' + port;
console.log(msg);
