import { connect } from 'react-redux';
import Immutable from 'immutable';
import {Actions} from 'react-native-router-flux';

import React, {
    Platform,
   Component,
   PropTypes,
   View,
   StyleSheet,
   StatusBar
} from 'react-native';

import AddWishForm from '../components/wish/AddWishForm'
import {
  onWishFieldChange, 
  saveWish,
  editWish,
  deleteWish,
  fullfillWish,
  setWishAttribute
} from '../actions/wishes'

class Wish extends Component {

  render() {
    const {wishState, globalState, dispatch} = this.props
    

    //TODO: cre: Introduce ShowWishForm & EditWishForm and "connect" them. Passing around so many
    //props is error-prone. Decide based on wishState which one to show
  
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <AddWishForm
          currentUser={globalState.currentUser} 
          wishState={wishState} 
          onWishFieldChange={(field, value) => dispatch(onWishFieldChange(field, value))} 
          saveWish={(wish) => dispatch(saveWish(wish))}
          editWish={(wish) => dispatch(editWish(wish))}
          deleteWish = {(wish) => {
            dispatch(deleteWish(wish))
            Actions.pop()
          }}
          fullfillWish = {(wish) => {dispatch(fullfillWish(wish))}}
          unfullfillWish = {(wish) => {dispatch(setWishAttribute(wish, 'fullfillerId', null))}}
          styles={styles}/>
      </View>
    )
  }
}

Wish.propTypes = {
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
  globalState: PropTypes.instanceOf(Immutable.Record).isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  button: {
    padding: 15,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500'
  },
  text: {
    paddingTop: 30
  },
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