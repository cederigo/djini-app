import { connect } from 'react-redux';
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';

import {djini_logo, lamp_ani} from '../../img'

import {newWish} from '../actions/wishes'

import MyWishList from '../components/MyWishList'
import DjiniText from '../components/DjiniText'
import {AppBar, ActionButton} from '../components/AppBar'
import WMColors from '../lib/WMColors'


class Wishes extends Component {

  static propTypes = {
    wishes: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    showSwipeoutHint: PropTypes.bool.isRequired,
    error: PropTypes.object,
  }
  
  render() {

    const {wishes, isFetching, error, user, showSwipeoutHint, dispatch} = this.props

    if (error) {
      Alert.alert('Oops', 'Wünsche konnten nicht geladen werden')
    }
        // <AppBar title="Meine Wünsche" showBackButton={false}>
        //   <ActionButton iconName="add" onPress={() => dispatch(newWish(user, user))}/>
        // </AppBar>

          // <DjiniButton toUser={user}/>
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}>
          <Image style={styles.logo} source={djini_logo}/>
          <TouchableOpacity onPress={() => dispatch(newWish(user, user))}>
            <Image resizeMode="contain" style={styles.lamp} source={lamp_ani}/>
          </TouchableOpacity>
          {isFetching ? 
            <DjiniText style={styles.loading}>Laden..</DjiniText> :
            <MyWishList wishes={wishes.toArray()} showSwipeoutHint={showSwipeoutHint} scrollEnabled={false} />
          }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  logo: {
    alignSelf: 'center',
    marginTop: 80,
    marginBottom: 25,
    width: 142,
    height: 87
  },
  lamp: {
    alignSelf: 'center',
    width: 220,
    height: 120,
    marginBottom: 60 
  },
  loading: {
    flex: 1,
    textAlign: 'center'
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
