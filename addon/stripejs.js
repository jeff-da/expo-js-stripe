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

function _makeBody(details) {
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}

function _createCardTokenHelper(cardNumber, expMonth, expYear, cvc, key) {
  var cardDetails = {
    "card[number]": cardNumber,
    "card[exp_month]": expMonth,
    "card[exp_year]": expYear,
    "card[cvc]": cvc
  };

  var formBody = _makeBody(cardDetails);

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
    "amount": amount,
    "currency": currency,
    "source": source,
    "description": description
  };

  var formBody = _makeBody(chargeDetails);

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
