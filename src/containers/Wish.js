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
import {
  onWishFieldChange, 
  saveWish,
  deleteWish,
  setEditable
} from '../actions/wishes'

class Wish extends Component {

  render() {
    console.log('Wish.render()')
    const {wishState, globalState, dispatch} = this.props
    return (
      <View style={{flex: 1}}>

        <StatusBar translucent={true} />

        <AddWishForm
          currentUser={globalState.currentUser} 
          wishState={wishState} 
          onWishFieldChange={(field, value) => dispatch(onWishFieldChange(field, value))} 
          saveWish={(wish) => dispatch(saveWish(wish))} 
          deleteWish = {(wish) => {
            dispatch(deleteWish(wish))
            Actions.pop()
          }}
          setEditable={() => dispatch(setEditable(true))}
          styles={styles}/>
      </View>
    )
  }
}

Wish.propTypes = {
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired
}

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

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishState: state.wish,
    globalState: state.global
  };
}

export default connect(select)(Wish)