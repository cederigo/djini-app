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

class Home extends Component {

  render() {
    console.log('Home.render()')
    const {currentUser} = this.props.globalState
    return (
        <View style={styles.container}>
          <Text>Willkommen {currentUser.firstName}</Text>
        </View>
    )
  }
}

Home.propTypes = {
  globalState: PropTypes.instanceOf(Immutable.Record).isRequired
}

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { globalState: state.global};
}

export default connect(mapStateToProps, null)(Home)
