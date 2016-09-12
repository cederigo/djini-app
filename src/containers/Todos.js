import React, {Component} from 'react'
import { StyleSheet, View} from 'react-native';

import DjiniText from '../components/DjiniText'

export default class Todos extends Component {
  render() {
    return(
      <View style={ styles.container }>
        <DjiniText style={styles.text}>Coming soon ;-)</DjiniText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50
  }
});
