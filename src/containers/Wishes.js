import { connect } from 'react-redux';
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  StatusBar,
  Text
} from 'react-native';

import {newWish} from '../actions/wishes'

import MyWishList from '../components/MyWishList'
import {AppBar, ActionButton} from '../components/AppBar'
import DjiniButton from '../components/DjiniButton'
import WMColors from '../lib/WMColors'
import {Wish, User} from '../lib/types'

class Wishes extends Component {
  
  props: {
    user: User,
    wishes: Array<Wish>,
    isFetching: bool,
    error: any,
    showSwipeoutHint: bool,
  }

  render() {

    const {wishes, isFetching, error, user, showSwipeoutHint, dispatch} = this.props

    if (error) {
      Alert.alert('Oops', 'Wünsche konnten nicht geladen werden')
    }

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <AppBar title="Meine Wünsche" showBackButton={false}>
          <ActionButton iconName="add" onPress={() => dispatch(newWish(user, user))}/>
        </AppBar>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}>
          <DjiniButton toUser={user}/>
          {isFetching ? 
            <Text style={styles.loading}>Laden..</Text> :
            <MyWishList style={styles.list} wishes={wishes.toArray()} showSwipeoutHint={showSwipeoutHint} scrollEnabled={false} />
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    color: WMColors.lightText,
    textAlign: 'center'
  },
  list: {
    marginTop: 30 
  }
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
    showSwipeoutHint: wishesState.showSwipeoutHint
  };
}

export default connect(select)(Wishes)
