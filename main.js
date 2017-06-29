import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
var stripe = require('./addon/stripejs.js')('pk_test_YRjUHSZfJza9RsuNDx9s6e5V');
var cardDetails = {
  "card[number]": '4242424242424242',
  "card[exp_month]": '02',
  "card[exp_year]": '21',
  "card[cvc]": '999',
  "card[name]": 'Steve Jobs'
};

var bankDetails = {
  bank_account: {
    country: 'US',
    currency: 'usd',
    account_holder_name: 'Noah Martinez',
    account_holder_type: 'individual',
    routing_number: '110000000',
    account_number: '000123456789'
  }
}

class App extends React.Component {

  state = {
    code: 'default',
  }

  async onPayPress() {
    var card = await stripe.createToken(bankDetails);
    //var card = await stripe.fetch("tokens", cardDetails);
    this.setState({
      code: card.id,
    });
    console.log(card);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Stripe test app</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onPayPress.bind(this)}
        >
          <Text style={styles.buttonText}>Tap me to set token</Text>
        </TouchableHighlight>
        <Text>{this.state.code}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FAFAFA',
   },
   button: {
    height: 45,
    alignSelf: 'stretch',
    backgroundColor: '#05A5D1',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
   },
});

Expo.registerRootComponent(App);
