/**
 * # app.js
 *  Display startup screen and navigate according to auth state
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import React, { Component, StyleSheet, View, Text, PropTypes } from 'react-native';
import {getSessionToken, getCurrentUser} from '../reducers/auth/authActions';
import {refreshContacts} from '../reducers/social/socialActions';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

class App extends Component {

  componentDidMount() {
    this.props.dispatch(getSessionToken())
      .then(() => this.props.dispatch(getCurrentUser()))
      .then(() => {
        this.props.dispatch(refreshContacts())
        Actions.home()
      })
      .catch(() => {
        Actions.login()
      })
  }

  render() {
    console.log('App.render()')
    return(
      <View style={ styles.container }>
        <Text style={ styles.summary }>Wishmaster</Text>
      </View>
    );
  }
}

App.propTypes = {
  actions: PropTypes.object.isRequired
}

export default connect()(App);
