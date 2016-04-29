import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Actions} from 'react-native-router-flux'
import Immutable from 'immutable';
import React, {
  Component, ListView,
  View, Text, TouchableOpacity,
  PropTypes, StatusBar,
  StyleSheet
} from 'react-native';

import {getUserWishes, newWish, show} from '../actions/wishes'
import {logout} from '../actions/authActions'
import WishList from '../components/WishList'
import NewWishButton from '../components/NewWishButton'
import LogoutButton from '../components/LogoutButton'

class Wishes extends Component {
  
  props: {
    wishesState: any,
    currentUser: any
  }
  
  componentDidMount() {
    this.props.dispatch(getUserWishes())
  }
  
  render() {
    let wishList
    const {dispatch, wishesState, currentUser} = this.props
    if (wishesState.isFetching) {
      wishList = <Text>Wünsche werden geladen</Text>
    } else {
      if (wishesState.wishes.size > 0) {
        wishList = <WishList wishes={wishesState.wishes} show={(wish) => dispatch(show(wish))}/>
      } else {
        if (wishesState.error !== null) {
          wishList = <View><Text>Du hast keine Wünsche!</Text>
          <Text>(Aber beim Laden gab's einen Fehler)</Text></View>
        } else {
          wishList = <Text>Du hast keine Wünsche!</Text>
        }
      }
    }
    return (
      <View style={styles.container}>
        <Text>Willkommen</Text>
        <LogoutButton/>
        <NewWishButton newWish={() => dispatch(newWish(currentUser.id))}/>
        {wishList}    
      </View>
    )
  }
}

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


/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishesState: state.wishes,
    currentUser: state.global.currentUser
  };
}

export default connect(select)(Wishes)
