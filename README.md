# PayPal Sandbox Dashboard
![PayPal-Sandbox-Dashboard](https://raw.githubusercontent.com/Fairbanks-io/PayPal-Sandbox-Dashboard/master/PayPal-Payment-Dashboard.gif)

Test various features of the PayPal Sandbox using React.js and PayPal's REST SDK.

[![PayPal-Sandbox-Dashboard](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Fairbanks-io/PayPal-Sandbox-Dashboard)

##### Features
* It's Open Source!
* Based on Material UI and React.js
* Testing of Sale Payments and Billing Agreements
* [PayPal-IPN-Listener](https://github.com/Fairbanks-io/PayPal-IPN-Listener) built-in
* IPN Based Transaction Reports
* In-App Help & FAQs

##### Prerequisites
* A running instance of MongoDB with associated user details
* Node version 8 or higher
* `yarn` or `npm` (hopefully `yarn`)
* A domain with SSL

##### Setup Instructions
* [Create a Sandbox Merchant account](https://developer.paypal.com/developer/accounts/) and add verified funding sources and pre-fill the account with test money. 

* Once created, login into [Sandbox.PayPal.com](https://sandbox.paypal.com) using your business account and be sure to set the IPN handler to point to this application!

* While [creating accounts](https://developer.paypal.com/developer/accounts/), also setup a Sandbox Payer account and be sure to add a verified funding source and pre-fill the account with test money.

* [Create a new REST API application](https://developer.paypal.com/developer/applications/) and tie it to the previously created Sandbox merchant account. Take note of your **Sandbox** *ClientID* and *Secret*. (Live is supported by this app, but make note that **if Live credentials are used, real money will be moved!**)

* Download this app's source code from Github. Extract to the folder of your choice and run `yarn install` to download dependencies.

* Launch the app using `MONGO_URI='mongodb://user:password@mysite.io/paypal' REACT_APP_HOST='sandbox.mysite.io' yarn start`

* _Optional: The app can be ran on an alternate port by passing `PORT=3001` along with the startup command above._

* Provide the previously generated merchant *ClientID* and *Secret* on the Getting Started page. These **details are not saved on the server at any point**, but stored within the browser and securely transmitted between you and PayPal.

* Finally, go test some payments!

##### Helpful Links
[Creating PayPal REST API Credentials](https://www.paypal.com/us/smarthelp/article/How-do-I-create-REST-API-credentials-ts1949)
[Payments API Docs](https://developer.paypal.com/docs/api/payments/v1/#payment_list)
[PayPal IPN Simulator](https://developer.paypal.com/developer/ipnSimulator/)
[PayPal Developer FAQs](https://developer.paypal.com/docs/faq/)

##### Bugs and Feature Requests
For Help with Sandbox Dashboard Bugs and Feature Requests: [Open a GitHub Issue](https://github.com/Fairbanks-io/PayPal-Sandbox-Dashboard/issues)

For Help with PayPal Sandbox Setup and SDK Bugs: [Contact PayPal Technical Support](https://www.paypal-techsupport.com/)

##### Contributors
* [bsord](https://github.com/bsord "bsord")
* [jonfairbanks](https://github.com/jonfairbanks "jonfairbanks")
