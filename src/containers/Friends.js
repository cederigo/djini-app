import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, {
  Component,
  View, Text,
  PropTypes,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

class Friends extends Component {

  render() {
    return (
        <View style={styles.container}>
          <Text>Meine Freunde</Text>
        </View>
    )
  }
}

Friends.propTypes = {
  globalState: PropTypes.instanceOf(Immutable.Record).isRequired
}

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { globalState: state.global};
}

export default connect(mapStateToProps, null)(Friends)
