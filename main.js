import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
//var stripe = require('./addon/stripejs.js')('sk_test_5zvs6AQgCHvPk4KjiChUn5ZN');
var stripe = require('./addon/stripejs.js')('pk_test_YRjUHSZfJza9RsuNDx9s6e5V');
var cc1 = '4242424242424242';
var cc2 = '4012888888881881';
var cc3 = '5555555555554444';
var cardDetails = {
  "card[number]": '4242424242424242',
  "card[exp_month]": '02',
  "card[exp_year]": '21',
  "card[cvc]": '999',
  "card[name]": 'Steve Jobs'
};

class App extends React.Component {

  state = {
    code: 'default',
  }

  async onPayPress() {
    var card = await stripe.fetch("tokens", cardDetails);
    this.setState({ code: card.id });
    console.log(card);
  }

  async onChargePress() {
    // var charge = await stripe.createChargeToken(2000,'usd',this.state.code,'Charge for La Croix');
    // this.setState({ code: charge.id });
    //var tok = await stripe.fetch("tokens/" + this.state.code, {});
    var tok = await stripe.retrieve('tokens', 'this.state.code');
    console.log(tok);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Stripe test app</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onPayPress.bind(this)}
        >
          <Text style={styles.buttonText}>Tap me to set up credit card</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onChargePress.bind(this)}
        >
          <Text style={styles.buttonText}>Tap me after to charge the credit card</Text>
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
