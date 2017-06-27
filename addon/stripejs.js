"use strict";

var stripe_url = 'https://api.stripe.com/v1/';

module.exports = function(key) {
  return {
    createCard: async function (cardNumber, expMonth, expYear, cvc) {
      console.log('kappa');
      var token = await _createCardToken(cardNumber, expMonth, expYear, cvc, key);
      try {
        let body = JSON.parse('' + token._bodyInit);
        return body;
      } catch (err) {
        return err;
      }
    },
    createCharge: async function (amount, currency, source, description) {
      var token = await _createChargeToken(amount, currency, source, description, key);
      try {
        let body = JSON.parse('' + token._bodyInit);
        return body;
      } catch (err) {
        return err;
      }
    },
  }
}

function _createCardToken(cardNumber, expMonth, expYear, cvc, key) {
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

function _createChargeToken(amount, currency, source, description, key) {
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
  //console.log('happening');
  console.log(formBody);

  return fetch(stripe_url + 'charges', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: formBody
  });
  /*return fetch('https://api.stripe.com/v1/tokens?card[number]=4242424242424242&card[exp_month]=1&card[exp_year]=2020&card[cvc]=123&amount=999&currency=usd', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + secret_key
    }
  })*/
};
