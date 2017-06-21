"use strict";

var stripe_url = 'https://api.stripe.com/v1/'
var secret_key = 'sk_test_rhp4YpVRawbtYeFpIfv0XeET'

module.exports.createCardToken = function (cardNumber, expMonth, expYear, cvc) {
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
  console.log('happening');
  
  return fetch(stripe_url + 'tokens', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + secret_key
    },
    body: formBody
  });
};
