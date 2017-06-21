import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
var stripe = require('./addon/stripejs.js');

class App extends React.Component {

  onPayPress() {
    var token = stripe.createCardToken('4242424242424242','02','20','999');
    console.log(token);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Stripe test app</Text>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onPayPress.bind(this)}
        >
          <Text style={styles.buttonText}>Tap me to pay</Text>
        </TouchableHighlight>
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
