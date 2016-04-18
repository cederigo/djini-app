import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import React, {
  Component,
  View, Text, TouchableOpacity,
  PropTypes,
  StyleSheet
} from 'react-native';

import * as authActions from '../reducers/auth/authActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    padding: 15
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
  }
})

class Wishes extends Component {

  render() {
    const {actions, globalState} = this.props
    const {currentUser} = globalState
    return (
        <View style={styles.container}>
          <Text>Willkommen {currentUser.name}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { actions.logout()}}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
    )
  }
}

Wishes.propTypes = {
  globalState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired
}

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { globalState: state.global};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(authActions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Wishes)
