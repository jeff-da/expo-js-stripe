"use strict";

var stripe_url = 'https://api.stripe.com/v1/';

module.exports = function(key) {
  return {
    createCardToken: async function (cardNumber, expMonth, expYear, cvc) {
      var token = await _createCardTokenHelper(cardNumber, expMonth, expYear, cvc, key);
      return _parseJSON(token);
    },
    createChargeToken: async function (amount, currency, source, description) {
      var token = await _createChargeTokenHelper(amount, currency, source, description, key);
      return _parseJSON(token);
    },
  }
}

function _parseJSON(token) {
  try {
    let body = JSON.parse('' + token._bodyInit);
    return body;
  } catch (err) {
    return err;
  }
}

function _createCardTokenHelper(cardNumber, expMonth, expYear, cvc, key) {
  var cardDetails = {
    "card[number]": cardNumber,
    "card[exp_month]": expMonth,
    "card[exp_year]": expYear,
    "card[cvc]": cvc
  };

  var formBody = [];
  for (var property in cardDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(cardDetails[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(stripe_url + 'tokens', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: formBody
  });
};

function _createChargeTokenHelper(amount, currency, source, description, key) {
  var chargeDetails = {
    "charge[amount]": amount,
    "charge[currency]": currency,
    "charge[source]": source,
    "charge[description]": description
  };

  var formBody = [];
  var count = 0;
  for (var property in chargeDetails) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(chargeDetails[property]);
    if (count == 0) {
      formBody.push('amount' + "=" + encodedValue);
    }
    if (count == 1) {
      formBody.push('currency' + "=" + encodedValue);
    }
    if (count == 2) {
      formBody.push('source' + "=" + encodedValue);
    }
    if (count == 3) {
      formBody.push('description' + "=" + encodedValue);
    }
    count++;
  }
  formBody = formBody.join("&");

  return fetch(stripe_url + 'charges', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: formBody
  });
};
