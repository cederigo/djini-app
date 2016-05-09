import { connect } from 'react-redux';
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Alert,
  StatusBar,
  Text
} from 'react-native';

import MyWishList from '../components/MyWishList'
import NewWishButton from '../components/NewWishButton'
import {Wish, User} from '../lib/types'

class Wishes extends Component {
  
  props: {
    user: User,
    wishes: Array<Wish>,
    isFetching: bool,
    error: any,
  }
  
  render() {

    const {wishes, isFetching, error, user} = this.props

    if (error) {
      Alert.alert('Oops', 'Wünsche konnten nicht geladen werden')
    }

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <NewWishButton toUser={user}/>
        <MyWishList wishes={wishes.toArray()}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
})


/**
 * Redux boilerplate
 */
function select(state) {
  const wishesState = state.wishes
  return { 
    user: state.global.currentUser,
    wishes: wishesState.wishes,
    isFetching: wishesState.isFetching,
    error: wishesState.error,
  };
}

export default connect(select)(Wishes)
