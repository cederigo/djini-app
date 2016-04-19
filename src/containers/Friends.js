import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import React, {
  Component,
  View, Text,
  PropTypes,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import * as socialActions from '../reducers/social/socialActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    padding: 15
  }
})

class Friends extends Component {

  render() {
    const {actions} = this.props
    return (
        <View style={styles.container}>
          <Text>Meine Freunde</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { actions.refreshContacts()}}>
            <Text style={styles.buttonText}>Sync Friends</Text>
          </TouchableOpacity>
        </View>
    )
  }
}

Friends.propTypes = {
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
  return { actions: bindActionCreators(socialActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
