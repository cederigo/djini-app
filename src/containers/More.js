
import { connect } from 'react-redux';
import React, {Component} from 'react'
import { StyleSheet, View, StatusBar } from 'react-native';

import {logout} from '../actions/authActions'

import WMButton from '../components/WMButton'
import WMColors from '../lib/WMColors'

class More extends Component {
  render() {
    const {dispatch} = this.props
    return(
      <View style={ styles.container }>
        <StatusBar translucent={true}/>
        <WMButton style={styles.button} onPress={() => dispatch(logout())} caption="Abmelden"/>
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
  button: {
    margin: 20,
    alignSelf: 'stretch'
  }
});

export default connect()(More);
