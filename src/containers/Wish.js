import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {Actions} from 'react-native-router-flux';

import React, {
    Platform,
   Component,
   PropTypes,
   View,
   StyleSheet,
   StatusBar,
   TouchableOpacity,
   Text
} from 'react-native';

import AddWishForm from '../components/wish/AddWishForm'
import * as wishActions from '../reducers/wish/wishActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'flex-start'
  },
  button: {
    padding: 15,
    alignSelf: 'flex-end'
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500'
  },
  text: {},
  icon: {
    alignSelf: 'center',
    marginBottom: 30
  },

  input: {
    marginLeft: Platform.OS === 'android' ? -5 : 0,
    height: 50,
    marginTop: 10
  }
});

class Wish extends Component {

    // TODO load existing wish

  render() {
    console.log('Wish.render()')
    return (
      <View style={{flex: 1}}>

        <StatusBar translucent={true} />

        <AddWishForm {...this.props} styles={styles}/>
        
        <TouchableOpacity
            onPress={Actions.home}>
            <Text>zurück</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

Wish.propTypes = {
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired
}

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { wishState: state.wish};
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(wishActions, dispatch) };
}
export default connect(mapStateToProps, mapDispatchToProps)(Wish)