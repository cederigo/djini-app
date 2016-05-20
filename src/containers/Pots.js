import React, {Component} from 'react'
import { StyleSheet, View, Text, StatusBar } from 'react-native';

import WMColors from '../lib/WMColors'

export default class Pots extends Component {
  render() {
    return(
      <View style={ styles.container }>
        <StatusBar translucent={true}/>
        <Text style={styles.text}>Coming soon ;-)</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WMColors.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50
  },
  text: {
    color: WMColors.lightText
  }
});
