/**
 * # app.js
 *  Display startup screen and navigate according to auth state
 */

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Parse from 'parse/react-native'
import React, { 
  Component,
  StyleSheet,
  View,
  Text,
} from 'react-native';

/* actions */
import {loginSuccess, loginFailure} from '../actions/authActions';
import {refreshContacts} from '../actions/socialActions';

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
    const {dispatch} = this.props
    Parse.User.currentAsync()
      .then((parseUser) => {
        if (!parseUser) {
          throw ('User not logged in')
        }
        dispatch(refreshContacts())
        dispatch(loginSuccess(parseUser))
      })
      .catch((error) => {
        dispatch(loginFailure(error))
        Actions.login()
      })
  }

  render() {
    return(
      <View style={ styles.container }>
        <Text style={ styles.summary }>Wishmaster</Text>
      </View>
    );
  }
}

export default connect()(App);
