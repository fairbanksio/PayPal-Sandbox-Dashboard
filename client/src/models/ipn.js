var mongoose = require('mongoose');

var schema = new mongoose.Schema(
  {
    ipnMessageRaw: String,
    ipnMessage: {
      mc_gross: String,
      protection_eligibility: String,
      address_status: String,
      payer_id: String,
      address_street: String,
      payment_date: String,
      payment_status: String,
      charset: String,
      address_zip: String,
      first_name: String,
      mc_fee: String,
      address_country_code: String,
      address_name: String,
      notify_version: String,
      custom: String,
      payer_status: String,
      business: String,
      address_country: String,
      address_city: String,
      quantity: String,
      verify_sign: String,
      payer_email: String,
      txn_id: String,
      payment_type: String,
      payer_business_name: String,
      last_name: String,
      address_state: String,
      receiver_email: String,
      payment_fee: String,
      receiver_id: String,
      txn_type: String,
      item_name: String,
      mc_currency: String,
      item_number: String,
      residence_country: String,
      test_ipn: String,
      transaction_subject: String,
      payment_gross: String,
      ipn_track_id: String
    },
    ipnPostback: String,
    status: String,
    timestamp: String,
  }, {
    collection: 'ipn',
    versionKey: false
  }
);

var ipnMsg = mongoose.model('ipnMsg', schema);

module.exports = ipnMsg;
