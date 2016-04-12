/**
 * # app.js
 *  Display startup screen and 
 *  getSessionTokenAtStartup which will navigate upon completion 
 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, StyleSheet, View, Text, PropTypes } from 'react-native';
import * as authActions from '../reducers/auth/authActions';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    borderTopWidth: 2,
    borderBottomWidth:2,
    marginTop: 80,
    padding: 10
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

class App extends Component {

  componentDidMount() {
    this.props.actions.getSessionToken();
  }

  render() {
    console.log('App.render()')
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
