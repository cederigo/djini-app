/**
 * # app.js
 *  Display startup screen and navigate according to auth state
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import React, { Component, StyleSheet, View, Text, PropTypes } from 'react-native';
import * as authActions from '../reducers/auth/authActions';

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
    this.props.actions.getSessionToken()
      .then(() => this.props.actions.getCurrentUser())
      .then(() => this.props.actions.phoneNumberForm())
      .catch(() => {
        this.props.actions.phoneNumberForm()
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

/**
 * ## Redux boilerplate
 */
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(authActions, dispatch) };
}
export default connect(null, mapDispatchToProps)(App);
