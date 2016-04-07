/**
 * # app.js
 *  Display startup screen and 
 *  getSessionTokenAtStartup which will navigate upon completion 
 */

/*
 * ## Imports
 *  
 * Imports from redux
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, StyleSheet, View, Text, PropTypes } from 'react-native';

/**
 * Actions
 */
import * as authActions from '../reducers/auth/authActions';

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'red',
    borderTopWidth: 2,
    borderBottomWidth:2,
    marginTop: 80,
    padding: 10
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

/**
 * ## App class
 */
class App extends Component {

  /**
   * See if there's a sessionToken from a previous login
   * 
   */
  componentDidMount() {
    this.props.actions.getSessionToken();
  }

  render() {
    return(
      <View style={ styles.container }>
        <Text style={ styles.summary }>App Startup Screen</Text>
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
