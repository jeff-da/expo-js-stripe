"use strict";

var stripe_url = 'https://api.stripe.com/v1/';

module.exports = function(key) {
  return {
    createCardToken: async function (cardNumber, expMonth, expYear, cvc) {
      var token = await _createCardTokenHelper(cardNumber, expMonth, expYear, cvc, key);
      return _parseJSON(token);
    },
    // charge token requires secret key
    createChargeToken: async function (amount, currency, source, description) {
      var token = await _createChargeTokenHelper(amount, currency, source, description, key);
      return _parseJSON(token);
    },
    createBankAccountToken: async function (country, currency, account_holder_name, account_holder_type, routing_number, account_number) {
      var token = await _createBankAccountTokenHelper(country, currency, account_holder_name, account_holder_type, routing_number, account_number, key);
      return _parseJSON(token);
    },
    createPIIToken: async function (personal_id_number) {
      var token = await _createPIITokenHelper(country, currency, account_holder_name, account_holder_type, routing_number, account_number, key);
      return _parseJSON(token);
    },
    createToken: async function (details) {
      if (details.card != null || details.bank_account != null || details.pii != null) {
        details = _convertDetails(details);
      }
      var token = await _createTokenHelper(details, key);
      return _parseJSON(token);
    },
    // may require secret key
    fetch: async function (type, details) {
      var token = await _fetchHelper(type, details, key);
      return _parseJSON(token);
    },
    // require secret key
    retrieve: async function (type, token) {
      var token = await _fetchHelper(type, token, key);
      return _parseJSON(token);
    }
  }
}

function _convertDetails(details) {
  if (details.card != null) {
    var type = 'card';
    var database = Object.entries(details.card);
  } else if (details.bank_account != null) {
    var type = 'bank_account';
    var database = Object.entries(details.bank_account);
  } else {
    var type = 'pii';
    var database = Object.entries(details.pii);
  }
  var convertedDetails = {}
  for (var data in database) {
    var string = type + '[' + database[data][0] + ']';
    convertedDetails[string] = database[data][1];
  }
  return convertedDetails;
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

function _createTokenHelper(details, key) {
  var formBody = _makeBody(details);

  return fetch(stripe_url + 'tokens', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: formBody
  });
}

function _fetchHelper(type, details, key) {
  var formBody = _makeBody(details);

  return fetch('' + stripe_url + type, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: formBody
  });
}

function _retrieveHelper(type, token, key) {
  var formBody = {};

  return fetch('' + stripe_url + type + '/' + token, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + key
    },
    body: {}
  });
}

function _createBankAccountTokenHelper(country, currency, account_holder_name, account_holder_type, routing_number, account_number, key) {
  var details = {
    "bank_account[country]": country,
    "bank_account[currency]": currency,
    "bank_account[account_holder_name]": account_holder_name,
    "bank_account[account_holder_type]": account_holder_type,
    "bank_account[routing_number]": routing_number,
    "bank_account[account_number]": account_number,
  };

  var formBody = _makeBody(details);

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

function _createPIITokenHelper(personal_id_number, key) {
  var details = {
    "pii[personal_id_number]": personal_id_number
  };

  var formBody = _makeBody(details);

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
