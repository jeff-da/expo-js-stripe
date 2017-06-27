import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
//var stripe = require('./addon/stripejs.js')('sk_test_5zvs6AQgCHvPk4KjiChUn5ZN');
var stripe = require('./addon/stripejs.js')('sk_test_5zvs6AQgCHvPk4KjiChUn5ZN');
var cc1 = '4242424242424242';
var cc2 = '4012888888881881';
var cc3 = '5555555555554444';

class App extends React.Component {

  state = {
    code: 'default',
  }

  async onPayPress() {
    var card = await stripe.createCard(cc1,'02','21','999');
    this.setState({ code: card.id });
  }

  /*async onPayPress() {
    var token = await stripe.createCardToken(cc3,'02','20','999');
    console.log(token);
    try {
      let body = JSON.parse('' + token._bodyInit);
      console.log(body);
      this.setState({ code: body.id });
    } catch (err) {
      console.log(err);
    }
    //this.setState({ code: body.id });
    if (token._65 != null) {
      this.setState({ code: token._65 });
      console.log(token._55);
      //token._55._bodyInit.id
    } else {
      this.setState({ code: token._55 });
    }*
  }*/

  async onChargePress() {
    var charge = await stripe.createCharge(2000,'usd',this.state.code,'Charge for La Croix');
    this.setState({ code: charge.id });
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
